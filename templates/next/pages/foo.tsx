import { NextContext, NextFunctionComponent } from 'next';
import { withRouter } from 'next/router';
import { {{{ucf}}}Show } from '../components/{{{lc}}}/Show';
import { {{{ucf}}} } from '../interfaces/{{{ucf}}}';
import { atob, fetch } from '../utils/dataAccess';

interface Props {
  {{{lc}}}: {{{ucf}}};
};

const {{{ucf}}}Page: NextFunctionComponent<Props> = ({ {{{lc}}} }) => {
  return (
    <{{{ucf}}}Show {{{lc}}}={ {{{lc}}} }/>
  );
};

{{{ucf}}}Page.getInitialProps = async ({query}: NextContext) => {
  const id = atob(query.hash as string);
  const {{{lc}}} = await fetch(id);

  return { {{{lc}}} };
};

export default withRouter({{{ucf}}}Page);
