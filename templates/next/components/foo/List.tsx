import { FunctionComponent } from "react";
import Link from "next/link";
import ReferenceLinks from "../{{{pathNesting}}}components/common/ReferenceLinks";
import { {{{camelNameUcf}}} } from '../{{{pathNesting}}}types/{{{camelNameUcf}}}';

interface Props {
  {{{camelName}}}: {{{camelNameUcf}}}[];
}

export const List: FunctionComponent<Props> = ({ {{{camelName}}} }) => (
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
        { {{{camelName}}} && ({{{camelName}}}.length !== 0) && {{{camelName}}}.map( ( {{{camelName}}}Item ) => (
          <tr key={ {{{camelName}}}Item['@id'] }>
            <th scope="row"><ReferenceLinks items={ {{{camelName}}}Item['@id'] } type="{{{lc}}}" /></th>
            {{#each fields}}
              <td>{{#if reference}}<ReferenceLinks items={ {{{../camelName}}}Item['{{{name}}}'] } type="{{{reference.title}}}" />{{else}}{ {{{../camelName}}}Item['{{{name}}}'] }{{/if}}</td>
            {{/each}}
            <td><ReferenceLinks items={ {{{camelName}}}Item['@id'] } type="{{{lc}}}" useIcon={true} /></td>
           <td>
            <Link href={`${ {{~camelName}}Item["@id"]}/edit`}>
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
