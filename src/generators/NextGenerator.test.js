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
    const resource = new Resource("prefix/aBe_cd", "http://example.com/foos", {
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
      "/components/prefix/abe_cd/List.tsx",
      "/components/prefix/abe_cd/Show.tsx",
      "/components/prefix/abe_cd/Form.tsx",
      "/components/common/ReferenceLinks.tsx",
      "/components/common/Pagination.tsx",
      "/types/PrefixABeCd.ts",
      "/types/Collection.ts",
      "/pages/prefix/abe_cd/[id]/index.tsx",
      "/pages/prefix/abe_cd/[id]/edit.tsx",
      "/pages/prefix/abe_cd/index.tsx",
      "/pages/prefix/abe_cd/create.tsx",
      "/utils/dataAccess.ts",
      "/utils/mercure.ts",
    ].forEach((file) => expect(fs.existsSync(tmpobj.name + file)).toBe(true));

    [
      "/components/prefix/abe_cd/List.tsx",
      "/components/prefix/abe_cd/Show.tsx",
      "/components/prefix/abe_cd/Form.tsx",
      "/types/PrefixABeCd.ts",
    ].forEach((file) => {
      expect(fs.existsSync(tmpobj.name + file)).toBe(true);
      expect(fs.readFileSync(tmpobj.name + file, "utf8")).toMatch(/bar/);
    });

    tmpobj.removeCallback();
  });
});
