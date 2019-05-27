import { NextContext, NextFunctionComponent } from 'next';
import { withRouter } from 'next/router';
import { Show } from '../components/{{{lc}}}/Show';
import { {{{ucf}}} } from '../interfaces/{{{ucf}}}';
import { atob, fetch } from '../utils/dataAccess';

interface Props {
  {{{lc}}}: {{{ucf}}};
};

const Page: NextFunctionComponent<Props> = ({ {{{lc}}} }) => {
  return (
    <Show {{{lc}}}={ {{{lc}}} }/>
  );
};

Page.getInitialProps = async ({query}: NextContext) => {
  const id = atob(query.id as string);
  const {{{lc}}} = await fetch(id);

  return { {{{lc}}} };
};

export default withRouter(Page);
