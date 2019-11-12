import { Api } from "@api-platform/api-doc-parser/lib/Api";
import { Resource } from "@api-platform/api-doc-parser/lib/Resource";
import { Field } from "@api-platform/api-doc-parser/lib/Field";
import fs from "fs";
import tmp from "tmp";
import AdminOnRestGenerator from "./AdminOnRestGenerator";

test("Generate a Admin On Rest app", () => {
  const generator = new AdminOnRestGenerator({
    hydraPrefix: "hydra:",
    templateDirectory: `${__dirname}/../../templates`
  });
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
    "/config/entrypoint.js",
    "/resources/abc.js",
    "/resource-import.js"
  ].forEach(file => expect(fs.existsSync(tmpobj.name + file)).toBe(true));

  ["/components/abc.js", "/config/abc.js"].forEach(file => {
    expect(fs.existsSync(tmpobj.name + file)).toBe(true);
    expect(fs.readFileSync(tmpobj.name + file, "utf8")).toMatch(/bar/);
  });

  tmpobj.removeCallback();
});
