import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import QuasarGenerator from "./QuasarGenerator.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

test("Generate a Quasar app", async () => {
  const generator = new QuasarGenerator({
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
    getParameters: function getParameters() {
      return Promise.resolve([]);
    },
  });
  const api = new Api("http://example.com", {
    entrypoint: "http://example.com:8080",
    title: "My API",
    resources: [resource],
  });

  await generator.generate(api, resource, tmpobj.name, []);

  // common components
  [
    "ActionCell",
    "Breadcrumb",
    "ConfirmDelete",
    "DataFilter",
    "FormRepeater",
    "Loading",
    "Toolbar",
  ].forEach((name) => {
    expect(
      fs.existsSync(`${tmpobj.name}/components/common/Common${name}.vue`)
    ).toBe(true);
  });

  // components
  ["Create", "Form", "List", "Show", "Update"].forEach((name) => {
    expect(fs.existsSync(`${tmpobj.name}/components/foo/Foo${name}.vue`)).toBe(
      true
    );
  });

  // i18n
  expect(fs.existsSync(`${tmpobj.name}/i18n/en-US/common.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/i18n/en-US/foo.ts`)).toBe(true);

  // pages
  ["Create", "List", "Show", "Update"].forEach((name) => {
    expect(fs.existsSync(`${tmpobj.name}/pages/foo/Page${name}.vue`)).toBe(
      true
    );
  });

  // router
  expect(fs.existsSync(`${tmpobj.name}/router/foo.ts`)).toBe(true);

  // stores
  ["create", "delete", "list", "show", "update"].forEach((name) => {
    expect(fs.existsSync(`${tmpobj.name}/stores/foo/${name}.ts`)).toBe(true);
  });

  // types
  ["breadcrumb", "collection", "error", "foo", "item", "list", "view"].forEach(
    (name) => {
      expect(fs.existsSync(`${tmpobj.name}/types/${name}.ts`)).toBe(true);
    }
  );

  // utils
  expect(fs.existsSync(`${tmpobj.name}/utils/config.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/utils/error.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/utils/date.ts`)).toBe(true);
  expect(fs.existsSync(`${tmpobj.name}/utils/fetch.ts`)).toBe(true);

  tmpobj.removeCallback();
});
