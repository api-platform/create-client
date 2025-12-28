import "../styles/style.css";
import type { AppProps } from "next/app";
import type { DehydratedState } from "@tanstack/react-query";

import Layout from "../components/common/Layout";

const App = ({ Component, pageProps }: AppProps<{dehydratedState: DehydratedState}>) => (
  <Layout dehydratedState={pageProps.dehydratedState}>
    <Component {...pageProps} />
  </Layout>
);

export default App;
