import { Api, Resource, Field } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import ReactNativeGeneratorV2 from "./ReactNativeGeneratorV2.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

test("Generate a React Native V2 app", () => {
  const generator = new ReactNativeGeneratorV2({
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
    "/lib/types/ApiResource.ts",
    "/lib/types/HydraView.ts",
    "/lib/types/HydraResponse.ts",
    "/lib/utils/Logs.ts",
    "/lib/utils/icons.tsx",
    "/lib/utils/Logs.ts",
    "/lib/utils/mercure.ts",
    "/lib/hooks/data.ts",
    "/lib/hooks/mercure.ts",
    "/lib/hooks/modal.ts",
    "/lib/hooks/notifications.ts",
    "/config/entrypoint.js",
    "/components/Main.tsx",
    "/components/Navigation.tsx",
    "/components/ConfirmModal.tsx",
    "/app/_layout.tsx.dist",

    "/app/(tabs)/abcs.tsx",
    "/lib/api/abcApi.ts",
    "/lib/types/Abc.ts",
    "/components/abc/Context.ts",
    "/components/abc/CreateEditModal.tsx",
    "/components/abc/Form.tsx",
    "/components/abc/LogsRenderer.tsx",
  ].forEach((file) => expect(fs.existsSync(tmpobj.name + file)).toBe(true));

  tmpobj.removeCallback();
});
