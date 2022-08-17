import fs from "fs";
import NextGenerator from "./generators/NextGenerator.js";
import NuxtGenerator from "./generators/NuxtGenerator.js";
import ReactGenerator from "./generators/ReactGenerator.js";
import ReactNativeGenerator from "./generators/ReactNativeGenerator.js";
import TypescriptInterfaceGenerator from "./generators/TypescriptInterfaceGenerator.js";
import VueGenerator from "./generators/VueGenerator.js";
import VuetifyGenerator from "./generators/VuetifyGenerator.js";
import QuasarGenerator from "./generators/QuasarGenerator.js";

function wrap(cl) {
  return ({ hydraPrefix, templateDirectory }) =>
    new cl({ hydraPrefix, templateDirectory });
}

export default async function generators(generator = "react") {
  if (fs.existsSync(generator)) {
    const gen = await import(generator);
    return wrap(gen.default);
  }

  switch (generator) {
    case "next":
      return wrap(NextGenerator);
    case "nuxt":
      return wrap(NuxtGenerator);
    case "react":
      return wrap(ReactGenerator);
    case "react-native":
      return wrap(ReactNativeGenerator);
    case "typescript":
      return wrap(TypescriptInterfaceGenerator);
    case "vue":
      return wrap(VueGenerator);
    case "vuetify":
      return wrap(VuetifyGenerator);
    case "quasar":
      return wrap(QuasarGenerator);
  }
}
