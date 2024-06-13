import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import { ReactGenerator } from "./ReactGenerator";

const dirname = path.dirname(fileURLToPath(import.meta.url));

test("Generate a React app", async () => {
  const generator = new ReactGenerator({
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
    id: "abc",
    title: "abc",
    readableFields: fields,
    writableFields: fields,
  });
  const api = new Api("http://example.com", {
    title: "My API",
    resources: [resource],
  });
  await generator.generate(api, resource, tmpobj.name);

  [
    "/utils/dataAccess.ts",
    "/utils/types.ts",
    "/config/entrypoint.ts",

    "/interfaces/Abc.ts",
    "/interfaces/Collection.ts",

    "/components/abc/index.ts",
    "/components/abc/Create.tsx",
    "/components/abc/Update.tsx",
    "/components/abc/type.ts",

    "/components/Field.tsx",
    "/components/Links.tsx",
    "/components/Pagination.tsx",

    "/routes/abc.tsx",

    "/hooks/create.ts",
    "/hooks/delete.ts",
    "/hooks/fetch.ts",
    "/hooks/index.ts",
    "/hooks/list.ts",
    "/hooks/mercure.ts",
    "/hooks/retrieve.ts",
    "/hooks/show.ts",
    "/hooks/update.ts",
  ].forEach((file) => expect(fs.existsSync(tmpobj.name + file)).toBe(true));

  [
    "/components/abc/Form.tsx",
    "/components/abc/List.tsx",
    "/components/abc/Show.tsx",
    "/interfaces/Abc.ts",
  ].forEach((file) => {
    expect(fs.existsSync(tmpobj.name + file)).toBe(true);
    expect(fs.readFileSync(tmpobj.name + file, "utf8")).toMatch(/bar/);
  });

  tmpobj.removeCallback();
});
