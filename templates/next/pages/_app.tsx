import type { AppProps } from "next/app";

import Layout from "../components/common/Layout";

const App = ({ Component, pageProps }: AppProps) => (
  <Layout dehydratedState={pageProps.dehydratedState}>
    <Component {...pageProps} />
  </Layout>
);

export default App;
