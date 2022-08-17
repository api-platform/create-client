import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import VueBaseGenerator from "./VueBaseGenerator.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

test("Test VueBaseGenerator", () => {
  const generator = new VueBaseGenerator({
    hydraPrefix: "hydra:",
    templateDirectory: `${dirname}/../../templates`,
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
  generator.generate(api, resource, tmpobj.name).then(() => {
    expect(fs.existsSync(tmpobj.name + "/mixins/CreateMixin.js")).toBe(true);
    expect(fs.existsSync(tmpobj.name + "/mixins/ListMixin.js")).toBe(true);
    expect(fs.existsSync(tmpobj.name + "/mixins/NotificationMixin.js")).toBe(
      true
    );
    expect(fs.existsSync(tmpobj.name + "/mixins/ShowMixin.js")).toBe(true);
    expect(fs.existsSync(tmpobj.name + "/mixins/UpdateMixin.js")).toBe(true);

    expect(fs.existsSync(tmpobj.name + "/error/SubmissionError.js")).toBe(true);

    expect(fs.existsSync(tmpobj.name + "/store/modules/crud.js")).toBe(true);
    expect(fs.existsSync(tmpobj.name + "/store/modules/notifications.js")).toBe(
      true
    );

    expect(fs.existsSync(tmpobj.name + "/utils/dates.js")).toBe(true);
    expect(fs.existsSync(tmpobj.name + "/utils/fetch.js")).toBe(true);
    expect(fs.existsSync(tmpobj.name + "/utils/hydra.js")).toBe(true);

    tmpobj.removeCallback();
  });
});
