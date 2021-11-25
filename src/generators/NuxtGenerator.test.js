import { Api, Resource, Field } from "@api-platform/api-doc-parser/lib";
import fs from "fs";
import tmp from "tmp";
import NuxtGenerator from "./NuxtGenerator";

const generator = new NuxtGenerator({
  hydraPrefix: "hydra:",
  templateDirectory: `${__dirname}/../../templates`,
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("generate", () => {
  test("Generate a Nuxt app", () => {
    const tmpobj = tmp.dirSync({ unsafeCleanup: true });

    const fields = [
      new Field("bar", {
        id: "http://schema.org/url",
        range: "http://www.w3.org/2001/XMLSchema#string",
        reference: null,
        required: true,
        description: "An URL",
      }),
    ];
    const resource = new Resource("prefix/aBe_cd", "http://example.com/foos", {
      id: "foo",
      title: "Foo",
      readableFields: fields,
      writableFields: fields,
      getParameters: function getParameters() {
        return Promise.resolve([]);
      },
    });
    const api = new Api("http://example.com", {
      entrypoint: "http://example.com:8080",
      title: "My API",
      resources: [resource],
    });

    generator.generate(api, resource, tmpobj.name).then(() => {
      [
        "/components/prefix/abecd/Form.vue",
        "/components/InputDate.vue",
        "/components/Loading.vue",
        "/components/Alert.vue",
        "/components/Toolbar.vue",
        "/config/entrypoint.js",
        "/error/SubmissionError.js",
        "/services/api.js",
        "/services/prefixabecd.js",
        "/store/prefixabecd.js",
        "/store/notifications.js",
        "/utils/dates.js",
        "/utils/fetch.js",
        "/utils/hydra.js",
        "/pages/prefix/abecd/_id.vue",
        "/pages/prefix/abecd/index.vue",
        "/pages/prefix/abecd/new.vue",
      ].forEach((file) => {
        expect(fs.existsSync(tmpobj.name + file)).toBe(true);
      });

      tmpobj.removeCallback();
    });
  });
});
