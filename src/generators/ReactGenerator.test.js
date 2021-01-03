import { Api, Resource, Field } from "@api-platform/api-doc-parser/lib";
import fs from "fs";
import tmp from "tmp";
import ReactGenerator from "./ReactGenerator";

test("Generate a React app", () => {
  const generator = new ReactGenerator({
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
    "/utils/dataAccess.js",
    "/config/entrypoint.js",

    "/actions/abc/create.js",
    "/actions/abc/delete.js",
    "/actions/abc/list.js",
    "/actions/abc/show.js",
    "/actions/abc/update.js",

    "/components/abc/index.js",
    "/components/abc/Create.js",
    "/components/abc/Update.js",

    "/routes/abc.js",

    "/reducers/abc/create.js",
    "/reducers/abc/delete.js",
    "/reducers/abc/index.js",
    "/reducers/abc/list.js",
    "/reducers/abc/show.js",
    "/reducers/abc/update.js",
  ].forEach((file) => expect(fs.existsSync(tmpobj.name + file)).toBe(true));

  [
    "/components/abc/Form.js",
    "/components/abc/List.js",
    "/components/abc/Show.js",
  ].forEach((file) => {
    expect(fs.existsSync(tmpobj.name + file)).toBe(true);
    expect(fs.readFileSync(tmpobj.name + file, "utf8")).toMatch(/bar/);
  });

  tmpobj.removeCallback();
});
