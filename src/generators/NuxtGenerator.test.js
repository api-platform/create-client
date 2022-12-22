import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import NuxtGenerator from "./NuxtGenerator.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

test("Generate a Nuxt app", () => {
  const generator = new NuxtGenerator({
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
      type: "string",
    }),
  ];
  const resource = new Resource("abc", "http://example.com/foos", {
    id: "foo",
    title: "Foo",
    readableFields: fields,
    writableFields: fields,
  });
  const api = new Api("http://example.com", {
    entrypoint: "http://example.com:8080",
    title: "My API",
    resources: [resource],
  });

  generator.generate(api, resource, tmpobj.name);

  [
    "/assets/css/main.css",
    "/components/common/FormRepeater.vue",
    "/components/foo/FooCreate.vue",
    "/components/foo/FooForm.vue",
    "/components/foo/FooList.vue",
    "/components/foo/FooShow.vue",
    "/components/foo/FooUpdate.vue",
    "/composables/mercureItem.ts",
    "/composables/mercureList.ts",
    "/pages/foos/[id]/edit.vue",
    "/pages/foos/[id]/index.vue",
    "/pages/foos/create.vue",
    "/pages/foos/index.vue",
    "/pages/index.vue",
    "/stores/foo/create.ts",
    "/stores/foo/delete.ts",
    "/stores/foo/list.ts",
    "/stores/foo/show.ts",
    "/stores/foo/update.ts",
    "/types/collection.ts",
    "/types/error.ts",
    "/types/foo.ts",
    "/types/item.ts",
    "/types/view.ts",
    "/utils/api.ts",
    "/utils/config.ts",
    "/utils/date.ts",
    "/utils/error.ts",
    "/utils/mercure.ts",
  ].forEach((file) => {
    expect(fs.existsSync(tmpobj.name + file)).toBe(true);
  });

  tmpobj.removeCallback();
});
