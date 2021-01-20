import { Api, Resource, Field } from "@api-platform/api-doc-parser/lib";
import fs from "fs";
import tmp from "tmp";
import NextGenerator from "./NextGenerator";

const generator = new NextGenerator({
  hydraPrefix: "hydra:",
  templateDirectory: `${__dirname}/../../templates`,
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
    const resource = new Resource("abc", "http://example.com/foos", {
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
      "/components/common/ReferenceLinks.tsx",
      "/error/SubmissionError.ts",
      "/types/Abc.ts",
      "/types/Collection.ts",
      "/pages/abcs/[id]/index.tsx",
      "/pages/abcs/[id]/edit.tsx",
      "/pages/abcs/index.tsx",
      "/pages/abcs/create.tsx",
      "/utils/dataAccess.ts",
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
