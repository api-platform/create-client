import { NextFunctionComponent } from 'next';
import { ListItem } from './ListItem';
import { {{{ucf}}} } from '../../interfaces/{{{ucf}}}';

interface Props {
  {{{name}}}: {{{ucf}}}[];
}

export const {{{ucf}}}List: NextFunctionComponent<Props> = ({ {{{name}}} }) => (
  <div>
    <h1>{{{ucf}}} List</h1>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
{{#each fields}}
          <th>{{name}}</th>
{{/each}}
          <th/>
        </tr>
      </thead>
      <tbody>
        { {{{name}}} && {{{name}}}.length && {{{name}}}.map({{{lc}}} => (
          <ListItem key={ {{{lc}}}['@id'] } {{{lc}}}={ {{{lc}}} } />
        ))}
      </tbody>
    </table>
  </div>
);
