import { NextComponentType, NextPageContext } from 'next';
import { Form } from '../../../components/{{{lc}}}/Form';
import { {{{ucf}}} } from '../../../types/{{{ucf}}}';
import { fetch } from '../../../utils/dataAccess';

interface Props {
  {{{lc}}}: {{{ucf}}};
};

const Page: NextComponentType<NextPageContext, Props, Props> = ({ {{{lc}}} }) => {

  return (
    <Form {{{lc}}}={ {{{lc}}} }/>
  );
};

Page.getInitialProps = async ({ asPath }: NextPageContext) => {
  const {{{lc}}} = await fetch(asPath.replace( '/edit', ''));

  return { {{{lc}}} };
};

export default Page;
