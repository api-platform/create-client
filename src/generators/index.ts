import { access, constants } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { NextGenerator } from "./NextGenerator";
import { NuxtGenerator } from "./NuxtGenerator";
import { ReactGenerator } from "./ReactGenerator";
import { ReactNativeGenerator } from "./ReactNativeGenerator";
import { TypescriptInterfaceGenerator } from "./TypescriptInterfaceGenerator";
import { VueGenerator } from "./VueGenerator";
import { VuetifyGenerator } from "./VuetifyGenerator";
import { QuasarGenerator } from "./QuasarGenerator";

const isPath = (generator: string) => generator !== basename(generator);

const generators = {
  next: NextGenerator,
  nuxt: NuxtGenerator,
  react: ReactGenerator,
  "react-native": ReactNativeGenerator,
  typescript: TypescriptInterfaceGenerator,
  vue: VueGenerator,
  vuetify: VuetifyGenerator,
  quasar: QuasarGenerator,
};

export const getGeneratorClass = async (generatorOption: string) => {
  if (isPath(generatorOption)) {
    const generatorAbsolutePath = resolve(generatorOption);

    try {
      await access(generatorAbsolutePath, constants.R_OK);
    } catch (error) {
      (error as Error).message =
        `The provided generator path "${generatorOption}" does not resolve to a known file.
${(error as Error).message}`;
      throw error;
    }

    const generator = await import(generatorAbsolutePath);
    if (!generator.default) {
      throw new Error(
        `The provided generator "${generatorOption}" doesn't expose a default export`
      );
    }

    return generator.default;
  }

  const generator = generators[generatorOption as keyof typeof generators];
  if (!generator) {
    throw new Error(`Unknown generator "${generatorOption}".
    Valid generator names are: ${Object.keys(generators).join(", ")}`);
  }

  return generator;
};

export { BaseGenerator } from "./BaseGenerator";
export {
  NextGenerator,
  NuxtGenerator,
  ReactGenerator,
  ReactNativeGenerator,
  TypescriptInterfaceGenerator,
  VueGenerator,
  VuetifyGenerator,
  QuasarGenerator,
};
