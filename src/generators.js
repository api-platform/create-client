import AdminOnRestGenerator from "./generators/AdminOnRestGenerator";
import ReactGenerator from "./generators/ReactGenerator";
import ReactNativeGenerator from "./generators/ReactNativeGenerator";
import TypescriptInterfaceGenerator from "./generators/TypescriptInterfaceGenerator";
import VueGenerator from "./generators/VueGenerator";
import QuasarGenerator from "./generators/QuasarGenerator";

function wrap(cl) {
  return ({ hydraPrefix, templateDirectory }) => new cl({ hydraPrefix, templateDirectory });
}

export default function generators(generator = "react") {
  switch (generator) {
    case "admin-on-rest":
      return wrap(AdminOnRestGenerator);
    case "react":
      return wrap(ReactGenerator);
    case "react-native":
      return wrap(ReactNativeGenerator);
    case "typescript":
      return wrap(TypescriptInterfaceGenerator);
    case "vue":
      return wrap(VueGenerator);
    case "quasar":
      return wrap(QuasarGenerator);
  }
}
