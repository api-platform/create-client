import { Route } from "react-router-dom";
import { List, Create, Update, Show } from "../components/{{{lc}}}/";

const routes = [
  <Route path="/{{{name}}}/create" element={<Create />} key="create" />,
  <Route path="/{{{name}}}/edit/:id" element={<Update />} key="update" />,
  <Route path="/{{{name}}}/show/:id" element={<Show />} key="show" />,
  <Route path="/{{{name}}}" element={<List />} key="list" />,
  <Route path="/{{{name}}}/:page" element={<List />} key="page" />,
];

export default routes;
