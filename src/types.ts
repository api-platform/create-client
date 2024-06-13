import type { Field } from "@api-platform/api-doc-parser";
import type { BaseGenerator } from "./generators";

export interface Options {
  resource?: string;
  hydraPrefix: string;
  username?: string;
  password?: string;
  bearer?: string;
  generator: string;
  templateDirectory: string;
  format: "hydra" | "swagger" | "openapi2" | "openapi3";
  serverPath?: string;
}

export interface ParamType {
  htmlInputType: string;
  step?: string;
  variable: string;
  range: string | null;
  required: boolean;
  description: string;
  deprecated?: boolean;
  multiple?: boolean;
}

type ParsedField = ReturnType<
  InstanceType<typeof BaseGenerator>["parseFields"]
>[0] & {
  sortable?: boolean;
};

export interface Context {
  title: string;
  name: string;
  lc: string;
  uc?: string;
  fields: ParsedField[] | Field[];
  /** @deprecated Use the `fields` property instead */
  formFields?: Field[];
  hydraPrefix?: string;
  titleUcFirst?: string;
  hasIsRelation?: boolean;
  hasIsRelations?: boolean;
  hasRelations?: boolean;
  hasDateField?: boolean;
  entrypoint?: string;
  labels?: Record<string, string> | string[];
}

export interface GeneratorParams extends Partial<Options> {
  hydraPrefix?: string;
  templateDirectory: string;
}
