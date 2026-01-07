import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/{{{lc}}}/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create {{{ucf}}}</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
