import { NextComponentType, NextPageContext } from "next";
import { Form } from "../{{{pathNesting}}}components/{{{path}}}/Form";
import Head from "next/head";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create {{{ucf}}} </title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
