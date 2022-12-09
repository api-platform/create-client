import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import VueGenerator from "./VueGenerator.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

test("Generate a Vue app", () => {
  const generator = new VueGenerator({
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

  ["Create", "List", "Update", "Show"].forEach((action) => {
    // components
    expect(
      fs.existsSync(`${tmpobj.name}/components/foo/Foo${action}.vue`)
    ).toBe(true);

    // views
    expect(fs.existsSync(`${tmpobj.name}/views/foo/${action}View.vue`)).toBe(
      true
    );
  });

  // composables
  expect(fs.existsSync(`${tmpobj.name}/composables/mercureItem.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/composables/mercureList.ts`)).toBe(true);

  // routes
  expect(fs.existsSync(`${tmpobj.name}/router/foo.ts`)).toBe(true);

  // stores
  ["create", "delete", "list", "show", "update"].forEach((action) => {
    expect(fs.existsSync(`${tmpobj.name}/stores/foo/${action}.ts`)).toBe(true);
  });

  // types
  expect(fs.existsSync(`${tmpobj.name}/types/collection.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/types/error.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/types/foo.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/types/item.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/types/stores.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/types/view.ts`)).toBe(true);

  // utils
  expect(fs.existsSync(`${tmpobj.name}/utils/config.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/utils/date.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/utils/fetch.ts`)).toBe(true);

  tmpobj.removeCallback();
});
