import AdminOnRestGenerator from "./generators/AdminOnRestGenerator";
import NextGenerator from "./generators/NextGenerator";
import ReactGenerator from "./generators/ReactGenerator";
import ReactNativeGenerator from "./generators/ReactNativeGenerator";
import TypescriptGenerator from "./generators/TypescriptGenerator";
import VueGenerator from "./generators/VueGenerator";
import VuetifyGenerator from "./generators/VuetifyGenerator";
import QuasarGenerator from "./generators/QuasarGenerator";

function wrap(cl) {
  return ({ hydraPrefix, templateDirectory }) =>
    new cl({ hydraPrefix, templateDirectory });
}

export default function generators(generator = "react") {
  switch (generator) {
    case "admin-on-rest":
      return wrap(AdminOnRestGenerator);
    case "next":
      return wrap(NextGenerator);
    case "react":
      return wrap(ReactGenerator);
    case "react-native":
      return wrap(ReactNativeGenerator);
    case "typescript":
      return wrap(TypescriptGenerator);
    case "vue":
      return wrap(VueGenerator);
    case "vuetify":
      return wrap(VuetifyGenerator);
    case "quasar":
      return wrap(QuasarGenerator);
  }
}
