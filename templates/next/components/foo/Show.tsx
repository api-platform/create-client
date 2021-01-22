import { FunctionComponent, useState } from 'react';
import Link from 'next/link';
import { ReferenceLinks } from '../common/ReferenceLinks';
import { {{{ucf}}} } from '../../types/{{{ucf}}}';
import { useRouter } from "next/router";

interface Props {
  {{{lc}}}: {{{ucf}}};
}

export const Show: FunctionComponent<Props> = ({ {{{lc}}} }) => {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			try {
        fetch({ {{{lc}}}["@id"] }, { method: "DELETE" });
        router.push("/{{{name}}}");
			} catch (error) {
        setError("Error when deleting the resource.");
				console.error(error);
			}
		}
	};
return(
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
{{#each fields}}
        <tr>
          <th scope="row">{{name}}</th>
          <td>{{#if reference}}<ReferenceLinks items={ {{{../lc}}}['{{{name}}}'] } type="{{{reference.title}}}" />{{else}}{ {{{../lc}}}['{{{name}}}'] }{{/if}}</td>
        </tr>
{{/each}}
      </tbody>
    </table>
    {error && (
							<div className='alert alert-danger' role='alert'>
								{error}
							</div>
						)}
    <Link href="/{{{name}}}"><a className="btn btn-primary">
      Back to list
    </a></Link>
    <Link href="/{{{name}}}/edit"><a className="btn btn-warning">
      Edit
    </a></Link>
    <button className='btn btn-danger' onClick={handleDelete}>
				<a>Delete</a>
			</button>
  </div>
)};
