import Api from "@api-platform/api-doc-parser/lib/Api";
import Resource from "@api-platform/api-doc-parser/lib/Resource";
import Field from "@api-platform/api-doc-parser/lib/Field";
import fs from "fs";
import tmp from "tmp";
import NextGenerator from "./NextGenerator";

const generator = new NextGenerator({
  hydraPrefix: "hydra:",
  templateDirectory: `${__dirname}/../../templates`
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
        description: "An URL"
      })
    ];
    const resource = new Resource("abc", "http://example.com/foos", {
      id: "abc",
      title: "abc",
      readableFields: fields,
      writableFields: fields
    });
    const api = new Api("http://example.com", {
      entrypoint: "http://example.com:8080",
      title: "My API",
      resources: [resource]
    });
    generator.generate(api, resource, tmpobj.name);

    [
      "/config/entrypoint.ts",
      "/components/abc/List.tsx",
      "/components/abc/ListItem.tsx",
      "/components/abc/Show.tsx",
      "/components/common/ReferenceLinks.tsx",
      "/error/SubmissionError.ts",
      "/interfaces/Abc.ts",
      "/interfaces/Collection.ts",
      "/pages/abcs/[id].tsx",
      "/pages/abcs/index.tsx",
      "/utils/dataAccess.ts"
    ].forEach(file => expect(fs.existsSync(tmpobj.name + file)).toBe(true));

    [
      "/components/abc/List.tsx",
      "/components/abc/ListItem.tsx",
      "/components/abc/Show.tsx",
      "/interfaces/Abc.ts"
    ].forEach(file => {
      expect(fs.existsSync(tmpobj.name + file)).toBe(true);
      expect(fs.readFileSync(tmpobj.name + file, "utf8")).toMatch(/bar/);
    });

    tmpobj.removeCallback();
  });
});
