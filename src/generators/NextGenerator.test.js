import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import NextGenerator from "./NextGenerator.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const generator = new NextGenerator({
  hydraPrefix: "hydra:",
  templateDirectory: `${dirname}/../../templates`,
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("generate", () => {
  test("Generate a Next app", () => {
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
    const resource = new Resource("abcs", "http://example.com/foos", {
      id: "abc",
      title: "abc",
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
      "/config/entrypoint.ts",
      "/components/abc/List.tsx",
      "/components/abc/Show.tsx",
      "/components/abc/Form.tsx",
      "/components/common/Layout.tsx",
      "/components/common/ReferenceLinks.tsx",
      "/components/common/Pagination.tsx",
      "/types/Abc.ts",
      "/types/collection.ts",
      "/types/item.ts",
      "/pages/abcs/[id]/index.tsx",
      "/pages/abcs/[id]/edit.tsx",
      "/pages/abcs/index.tsx",
      "/pages/abcs/create.tsx",
      "/pages/_app.tsx",
      "/utils/dataAccess.ts",
      "/utils/mercure.ts",
    ].forEach((file) => expect(fs.existsSync(tmpobj.name + file)).toBe(true));

    [
      "/components/abc/List.tsx",
      "/components/abc/Show.tsx",
      "/components/abc/Form.tsx",
      "/types/Abc.ts",
    ].forEach((file) => {
      expect(fs.existsSync(tmpobj.name + file)).toBe(true);
      expect(fs.readFileSync(tmpobj.name + file, "utf8")).toMatch(/bar/);
    });

    tmpobj.removeCallback();
  });
});
