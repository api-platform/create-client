import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import AngularGenerator from "./AngularGenerator.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const generator = new AngularGenerator({
  hydraPrefix: "hydra:",
  templateDirectory: `${dirname}/../../templates`,
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("generate", () => {
  test("Generate an Angular app", () => {
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
      "app/components/common/header/header.component.css",
      "app/components/common/header/header.component.html",
      "app/components/common/header/header.component.ts",
      "app/components/common/layout/layout.component.html",
      "app/components/common/layout/layout.component.ts",
      "app/components/common/pagination/pagination.component.html",
      "app/components/common/pagination/pagination.component.ts",
      "app/components/common/sidebar/sidebar.component.css",
      "app/components/common/sidebar/sidebar.component.html",
      "app/components/common/sidebar/sidebar.component.ts",
      "app/components/common/svg/list-svg/list-svg.component.svg",
      "app/components/common/svg/list-svg/list-svg.component.ts",
      "app/components/common/svg/show-svg/show-svg.component.svg",
      "app/components/common/svg/show-svg/show-svg.component.ts",
      "app/components/common/svg/edit-svg/edit-svg.component.svg",
      "app/components/common/svg/edit-svg/edit-svg.component.ts",
      "app/components/common/svg/menu/menu.component.svg",
      "app/components/common/svg/menu/menu.component.ts",
      "app/components/common/back-to-list/back-to-list.component.html",
      "app/components/common/back-to-list/back-to-list.component.ts",
      "app/components/common/alert/alert.component.html",
      "app/components/common/alert/alert.component.ts",
      "app/interface/api.ts",
      "app/router/foo.ts",
      "app/service/api.service.ts",
    ].forEach((file) => expect(fs.existsSync(tmpobj.name + file)).toBe(true));

    [
      "app/components/abc/create/create.component.html",
      "app/components/abc/create/create.component.ts",
      "app/components/abc/edit/edit.component.html",
      "app/components/abc/edit/edit.component.ts",
      "app/components/abc/list/list.component.html",
      "app/components/abc/list/list.component.ts",
      "app/components/abc/show/show.component.html",
      "app/components/abc/show/show.component.ts",
      "/interfaces/Abc.ts",
    ].forEach((file) => {
      expect(fs.existsSync(tmpobj.name + file)).toBe(true);
      expect(fs.readFileSync(tmpobj.name + file, "utf8")).toMatch(/bar/);
    });

    tmpobj.removeCallback();
  });
});
