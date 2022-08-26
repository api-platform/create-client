import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { {{{ucf}}} } from '../../types/{{{ucf}}}';

interface Props {
  {{{lc}}}s: {{{ucf}}}[];
}

export const List: FunctionComponent<Props> = ({ {{{lc}}}s }) => (
  <div>
    <h1>{{{ucf}}} List</h1>
    <Link href="/{{{lc}}}s/create">
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
        { {{{lc}}}s && ({{{lc}}}s.length !== 0) && {{{lc}}}s.map( ( {{{lc}}} ) => (
          {{{lc}}}['@id'] &&
          <tr key={ {{{lc}}}['@id'] }>
            <th scope="row">
              <ReferenceLinks items={ { href: getPath({{{lc}}}['@id'], '/{{{lc}}}s/[id]'), name: {{{lc}}}['@id'] } } />
            </th>
            {{#each fields}}
              <td>
                {{#if reference}}
                  <ReferenceLinks items={ { href: getPath({{{../lc}}}['{{{name}}}'], '/{{{lowercase reference.title}}}s/[id]'), name: {{{../lc}}}['{{{name}}}'] } } />
                {{else if isEmbeddeds}}
                  <ReferenceLinks items={ {{{../lc}}}['{{{name}}}'].map((emb: any) => ({ href: getPath(emb['@id'], '/{{{lowercase embedded.title}}}s/[id]'), name: emb['@id'] })) } />
                {{else if embedded}}
                  <ReferenceLinks items={ { href: getPath({{{../lc}}}['{{{name}}}']['@id'], '/{{{lowercase embedded.title}}}s/[id]'), name: {{{../lc}}}['{{{name}}}']['@id'] } } />
                {{else if (compare type "==" "Date") }}
                  { {{{../lc}}}['{{{name}}}']?.toLocaleString() }
                {{else}}
                  { {{{../lc}}}['{{{name}}}'] }
                {{/if}}
              </td>
            {{/each}}
            <td>
              <Link href={ getPath({{{lc}}}['@id'], '/{{{lc}}}s/[id]') }>
                <a>
                  <i className="bi bi-search" aria-hidden="true"></i>
                  <span className="sr-only">Show</span>
                </a>
              </Link>
            </td>
            <td>
              <Link href={ getPath({{{lc}}}["@id"], '/{{{lc}}}s/[id]/edit') }>
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
