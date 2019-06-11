import { NextFunctionComponent } from 'next';
import { {{{ucf}}} } from '../../interfaces/{{{ucf}}}';
import { ReferenceLinks } from '../common/ReferenceLinks';

interface Props {
  {{{lc}}}: {{{ucf}}}
}

export const ListItem: NextFunctionComponent<Props> = ({ {{{lc}}} }: Props) => (
  <tr>
    <th scope="row"><ReferenceLinks items={ {{{lc}}}['@id'] } type="{{{lc}}}" /></th>
{{#each fields}}
    <td>{{#if reference}}<ReferenceLinks items={ {{{../lc}}}['{{{name}}}'] } type="{{{reference.title}}}" />{{else}}{ {{{../lc}}}['{{{name}}}'] }{{/if}}</td>
{{/each}}
    <td><ReferenceLinks items={ {{{lc}}}['@id'] } type="{{{lc}}}" useIcon={true} /></td>
  </tr>
);
