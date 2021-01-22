import { NextComponentType, NextPageContext } from 'next';
import { Show } from '../../../components/{{{lc}}}/Show';
import { {{{ucf}}} } from '../../../types/{{{ucf}}}';
import { fetch } from '../../../utils/dataAccess';

interface Props {
  {{{lc}}}: {{{ucf}}};
};

const Page: NextComponentType<NextPageContext, Props, Props> = ({ {{{lc}}} }) => {
  return (
    <Show {{{lc}}}={ {{{lc}}} }/>
  );
};

Page.getInitialProps = async ({ asPath }: NextPageContext) => {
  const {{{lc}}} = await fetch(asPath);

  return { {{{lc}}} };
};

export default Page;
