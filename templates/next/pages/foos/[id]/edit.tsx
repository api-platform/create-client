import { NextComponentType, NextPageContext } from 'next';
import { Form } from '../../../components/{{{lc}}}/Form';
import { {{{ucf}}} } from '../../../types/{{{ucf}}}';
import { fetch } from '../../../utils/dataAccess';
import Head from "next/head";

interface Props {
  {{{lc}}}: {{{ucf}}};
};

const Page: NextComponentType<NextPageContext, Props, Props> = ({ {{{lc}}} }) => {
  return (
    <div>
      <div>
        <Head>
          <title>{ {{{lc}}} && `Edit {{{ucf}}} ${ {{~lc}}['@id']}`}</title>
        </Head>
      </div>
      <Form {{{lc}}}={ {{{lc}}} }/>
    </div>
  );
};

Page.getInitialProps = async ({ asPath }: NextPageContext) => {
  const {{{lc}}} = await fetch(asPath.replace( '/edit', ''));

  return { {{{lc}}} };
};

export default Page;
