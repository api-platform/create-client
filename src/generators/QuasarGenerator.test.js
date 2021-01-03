import { Api, Resource, Field } from "@api-platform/api-doc-parser/lib";
import fs from "fs";
import tmp from "tmp";
import QuasarGenerator from "./QuasarGenerator";

test("Generate a Quasar app", () => {
  const generator = new QuasarGenerator({
    hydraPrefix: "hydra:",
    templateDirectory: `${__dirname}/../../templates`,
  });
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
  const resource = new Resource("abc", "http://example.com/foos", {
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
  generator
    .generate(api, resource, tmpobj.name)
    .then(() => {
      expect(fs.existsSync(tmpobj.name + "/components/foo/Create.vue")).toBe(
        true
      );
      expect(fs.existsSync(tmpobj.name + "/components/foo/Form.vue")).toBe(
        true
      );
      expect(fs.existsSync(tmpobj.name + "/components/foo/List.vue")).toBe(
        true
      );
      expect(fs.existsSync(tmpobj.name + "/components/foo/Show.vue")).toBe(
        true
      );
      expect(fs.existsSync(tmpobj.name + "/components/foo/Update.vue")).toBe(
        true
      );

      expect(fs.existsSync(tmpobj.name + "/config/entrypoint.js")).toBe(true);

      expect(fs.existsSync(tmpobj.name + "/error/SubmissionError.js")).toBe(
        true
      );

      expect(fs.existsSync(tmpobj.name + "/router/foo.js")).toBe(true);

      expect(fs.existsSync(tmpobj.name + "/store/modules/foo/index.js")).toBe(
        true
      );

      ["create", "delete", "list", "show", "update"].forEach((action) => {
        expect(
          fs.existsSync(`${tmpobj.name}/store/modules/foo/${action}/actions.js`)
        ).toBe(true);
        expect(
          fs.existsSync(`${tmpobj.name}/store/modules/foo/${action}/getters.js`)
        ).toBe(true);
        expect(
          fs.existsSync(`${tmpobj.name}/store/modules/foo/${action}/index.js`)
        ).toBe(true);
        expect(
          fs.existsSync(
            `${tmpobj.name}/store/modules/foo/${action}/mutation_types.js`
          )
        ).toBe(true);
        expect(
          fs.existsSync(
            `${tmpobj.name}/store/modules/foo/${action}/mutations.js`
          )
        ).toBe(true);
      });
      expect(fs.existsSync(tmpobj.name + "/utils/fetch.js")).toBe(true);
      tmpobj.removeCallback();
    })
    .catch(() => {});
});
