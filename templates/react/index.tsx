import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import App from "./App";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import bookRoutes from "./routes/book";
import reviewRoutes from "./routes/review";
import bookmarkRoutes from "./routes/bookmark";
import userRoutes from "./routes/user";

const NotFound = () => <h1>Not Found</h1>;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        {bookRoutes}
        {reviewRoutes}
        {bookmarkRoutes}
        {userRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
