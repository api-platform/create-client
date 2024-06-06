import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import AngularGenerator from "./AngularGenerator.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

test("Generate a React app", () => {
  const generator = new AngularGenerator({
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
    entrypoint: "http://example.com:8080",
    title: "My API",
    resources: [resource],
  });
  generator.generate(api, resource, tmpobj.name);

  [
    "app/components/common/delete/delete.component.html",
    "app/components/common/delete/delete.component.ts",
    "app/components/common/form/form.component.html",
    "app/components/common/form/form.component.ts",
    "app/components/common/header/header.component.html",
    "app/components/common/header/header.component.ts",
    "app/components/common/sidebar/sidebar.component.html",
    "app/components/common/sidebar/sidebar.component.ts",
    "app/components/common/table /table.component.html",
    "app/components/common/table/table.component.ts",
    "app/components/svg/list-svg/list-svg.component.svg",
    "app/components/svg/list-svg/list-svg.component.ts",
    "app/components/svg/menu/menu.component.svg",
    "app/components/svg/menu/menu.component.ts",
    "app/interface/api.ts",
    "app/interface/foo.model.ts",
    "app/interface/hero.model.ts",
    "app/interface/list.model.ts",
    "app/interface/show.model.ts",
    "app/interface/update.model.ts",
    "app/router/foo.ts",
    "app/service/api.service.ts",
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
