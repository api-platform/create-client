import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import fs from "fs";
import tmp from "tmp";
import VuetifyGenerator from "./VuetifyGenerator";

test("Generate a Vuetify app", () => {
  const generator = new VuetifyGenerator({
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
  generator.generate(api, resource, tmpobj.name).then(() => {
    [
      "/components/ActionCell.vue",
      "/components/Breadcrumb.vue",
      "/components/ConfirmDelete.vue",
      "/components/DataFilter.vue",
      "/components/foo/Filter.vue",
      "/components/foo/Form.vue",
      "/components/foo/Layout.vue",
      "/components/InputDate.vue",
      "/components/Loading.vue",
      "/components/Snackbar.vue",
      "/components/Toolbar.vue",
      "/config/entrypoint.js",
      "/error/SubmissionError.js",
      "/locales/en.js",
      "/router/foo.js",
      "/services/api.js",
      "/services/foo.js",
      "/utils/dates.js",
      "/utils/fetch.js",
      "/utils/hydra.js",
      "/views/foo/Create.vue",
      "/views/foo/List.vue",
      "/views/foo/Show.vue",
      "/views/foo/Update.vue",
    ].forEach((file) => {
      expect(fs.existsSync(tmpobj.name + file)).toBe(true);
    });

    tmpobj.removeCallback();
  });
});
