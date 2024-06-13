import { Route } from "react-router-dom";
import { List, Create, Update, Show } from "../components/{{{lc}}}/";

const routes = [
  <Route path="/{{{lc}}}s/create" element={<Create />} key="create" />,
  <Route path="/{{{lc}}}s/edit/:id" element={<Update />} key="update" />,
  <Route path="/{{{lc}}}s/show/:id" element={<Show />} key="show" />,
  <Route path="/{{{lc}}}s" element={<List />} key="list" />,
  <Route path="/{{{lc}}}s/:page" element={<List />} key="page" />,
];

export default routes;
