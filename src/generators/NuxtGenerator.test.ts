import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import { NuxtGenerator } from "./NuxtGenerator";

const dirname = path.dirname(fileURLToPath(import.meta.url));

test("Generate a Nuxt app", async () => {
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
    title: "My API",
    resources: [resource],
  });

  await generator.generate(api, resource, tmpobj.name);

  // common components
  expect(
    fs.existsSync(`${tmpobj.name}/components/common/FormRepeater.vue`)
  ).toBe(true);

  // components
  expect(fs.existsSync(`${tmpobj.name}/components/foo/FooCreate.vue`)).toBe(
    true
  );
  expect(fs.existsSync(`${tmpobj.name}/components/foo/FooForm.vue`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/components/foo/FooList.vue`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/components/foo/FooShow.vue`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/components/foo/FooUpdate.vue`)).toBe(
    true
  );

  // composables
  expect(fs.existsSync(`${tmpobj.name}/composables/api.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/composables/mercureItem.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/composables/mercureList.ts`)).toBe(true);

  // pages
  expect(fs.existsSync(`${tmpobj.name}/pages/foos/[id]/edit.vue`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/pages/foos/[id]/index.vue`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/pages/foos/create.vue`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/pages/foos/index.vue`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/pages/index.vue`)).toBe(true);

  // stores
  expect(fs.existsSync(`${tmpobj.name}/stores/foo/create.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/stores/foo/delete.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/stores/foo/list.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/stores/foo/show.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/stores/foo/update.ts`)).toBe(true);

  // types
  expect(fs.existsSync(`${tmpobj.name}/types/api.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/types/collection.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/types/error.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/types/foo.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/types/item.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/types/view.ts`)).toBe(true);

  // utils
  expect(fs.existsSync(`${tmpobj.name}/utils/config.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/utils/date.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/utils/error.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/utils/mercure.ts`)).toBe(true);

  tmpobj.removeCallback();
});
