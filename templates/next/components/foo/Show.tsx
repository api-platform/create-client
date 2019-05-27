import { NextFunctionComponent } from 'next';
import Link from 'next/link';
import { ReferenceLinks } from '../common/ReferenceLinks';
import { {{{ucf}}} } from '../../interfaces/{{{ucf}}}';

interface Props {
  {{{lc}}}: {{{ucf}}};
}

export const Show: NextFunctionComponent<Props> = ({ {{{lc}}} }) => (
  <div>
    <h1>Show { {{{lc}}}['@id'] }</h1>
    <table className="table table-responsive table-striped table-hover">
      <thead>
      <tr>
        <th>Field</th>
        <th>Value</th>
      </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">title</th>
          <td>{ {{{lc}}}.title }</td>
        </tr>
{{#each fields}}
        <tr>
          <th scope="row">{{name}}</th>
          <td>{{#if reference}}<ReferenceLinks items={ {{{../lc}}}['{{{name}}}'] } type="{{{reference.title}}}" />{{else}}{ {{{../lc}}}['{{{name}}}'] }{{/if}}</td>
        </tr>
{{/each}}
      </tbody>
    </table>
    <Link href="/{{{name}}}"><a className="btn btn-primary">
      Back to list
    </a></Link>
  </div>
);
