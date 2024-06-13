import {
  Field,
  parseHydraDocumentation,
  parseOpenApi3Documentation,
  parseSwaggerDocumentation,
} from "@api-platform/api-doc-parser";
import pc from "picocolors";
import type { Options } from "./index";
import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export const filterDeprecated = (fields?: Field[] | null) =>
  fields?.filter(({ deprecated }) => !deprecated) ?? [];

const getParserOptions = (options: Options) => {
  const parserOptions: { headers?: Headers } = {};
  // options refers to the opts set via the CLI
  if (options.format === "hydra" && options.username && options.password) {
    const encoded = Buffer.from(
      `${options.username}:${options.password}`
    ).toString("base64");

    parserOptions.headers = new Headers();
    parserOptions.headers.set("Authorization", `Basic ${encoded}`);
  }
  if (options.bearer) {
    parserOptions.headers = new Headers();
    parserOptions.headers.set("Authorization", `Bearer ${options.bearer}`);
  }

  return parserOptions;
};

const parserByFormat = {
  hydra: parseHydraDocumentation,
  swagger: parseSwaggerDocumentation,
  openapi2: parseSwaggerDocumentation,
  openapi3: parseOpenApi3Documentation,
};

export const parseDocumentation = (entrypoint: string, options: Options) => {
  const docParser = parserByFormat[options.format];

  if (options.format === "hydra") {
    return docParser(entrypoint, getParserOptions(options));
  }
  return docParser(entrypoint);
};

export const formatError = (string: string) =>
  `\n${pc.bgRed(pc.bold(" ERROR "))} ${pc.red(
    string.trim().replace(/^error:/, "")
  )}\n`;

export const canParseURL = (url: string) => {
  try {
    return !!new URL(url);
  } catch {
    return false;
  }
};

export const outputFile = async (
  file: string,
  data: string,
  encoding: BufferEncoding = "utf8"
) => {
  const dir = dirname(file);

  await mkdir(dir, { recursive: true });

  return writeFile(file, data, encoding);
};

export const pathExists = (path: string) => {
  return access(path)
    .then(() => true)
    .catch(() => false);
};
