import { FunctionComponent } from "react";
import Link from "next/link";
import ReferenceLinks from "../../components/common/ReferenceLinks";
import { {{{ucf}}} } from '../../types/{{{ucf}}}';

interface Props {
  {{{snc}}}: {{{ucf}}}[];
}

export const List: FunctionComponent<Props> = ({ {{{snc}}} }) => (
  <div>
    <h1>{{{ucf}}} List</h1>
    <Link href="/{{{name}}}/create">
      <a className="btn btn-primary">Create</a>
    </Link>
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
        { {{{snc}}} && ({{{snc}}}.length !== 0) && {{{snc}}}.map( ( {{{snc}}}Item ) => (
          <tr key={ {{{snc}}}Item['@id'] }>
            <th scope="row"><ReferenceLinks items={ {{{snc}}}Item['@id'] } type="{{{lc}}}" /></th>
            {{#each fields}}
              <td>{{#if reference}}<ReferenceLinks items={ {{{../snc}}}Item['{{{lc}}}'] } type="{{{reference.title}}}" />{{else}}{ {{{../snc}}}['{{{lc}}}'] }{{/if}}</td>
            {{/each}}
            <td><ReferenceLinks items={ {{{snc}}}Item['@id'] } type="{{{lc}}}" useIcon={true} /></td>
           <td>
            <Link href={`${ {{~snc}}Item["@id"]}/edit`}>
              <a>
                <i className="bi bi-pen" aria-hidden="true" />
                <span className="sr-only">Edit</span>
              </a>
            </Link>
           </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
