import { NextFunctionComponent } from 'next';
import { {{{ucf}}}List } from '../components/{{{lc}}}/List';
import { PagedCollection } from '../interfaces/Collection';
import { {{{ucf}}} } from '../interfaces/{{{ucf}}}';
import { fetch } from '../utils/dataAccess';

interface Props {
  collection: PagedCollection<{{{ucf}}}>;
}

const {{{ucf}}}sPage: NextFunctionComponent<Props> = ({collection}) => (
  <{{{ucf}}}List {{{name}}}={collection['{{{hydraPrefix}}}member'] || []}/>
);

{{{ucf}}}sPage.getInitialProps = async () => {
  const collection = await fetch('/{{{name}}}');

  return {collection};
};

export default {{{ucf}}}sPage;
