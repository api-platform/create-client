import fs from "fs";
import NextGenerator from "./generators/NextGenerator";
import NuxtGenerator from "./generators/NuxtGenerator";
import ReactGenerator from "./generators/ReactGenerator";
import ReactNativeGenerator from "./generators/ReactNativeGenerator";
import TypescriptInterfaceGenerator from "./generators/TypescriptInterfaceGenerator";
import VueGenerator from "./generators/VueGenerator";
import VuetifyGenerator from "./generators/VuetifyGenerator";
import QuasarGenerator from "./generators/QuasarGenerator";

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
