import { NextComponentType, NextPageContext } from "next";
import { Form } from "../../components/{{{lc}}}/Form";
import Head from "next/head";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create {{{ucf}}} </title>
        <meta property="og:title" content="Create {{{ucf}}}" key="title" />
      </Head>
    </div>
    <Form />
  </div>
)


export default Page;
