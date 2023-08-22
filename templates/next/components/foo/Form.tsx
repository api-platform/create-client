import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm{{#if hasManyRelations}}, useFieldArray{{/if}} } from "react-hook-form";

import { useMutation } from "react-query";

import { customFetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { {{{ucf}}} } from '../../types/{{{ucf}}}';

interface Props {
  {{{lc}}}?: {{{ucf}}};
}

interface SaveParams {
  values: {{{ucf}}};
}

interface DeleteParams {
  id: string;
}

const save{{{ucf}}} = async ({ values }: SaveParams) =>
  await customFetch<{{ucf}}>(!values["@id"] ? "/{{{name}}}" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const delete{{{ucf}}} = async (id: string) => await customFetch<{{ucf}}>(id, { method: "DELETE" });


const formatDefaultValue = ({{lc}} : {{{ucf}}} | undefined)=> {
  return {{lc}} ?
  {
    ...{{lc}},
    {{#each fields}}
      {{#if isEmbeddeds}}
        {{name}}: {{../lc}}["{{name}}"]?.map((emb: any) => emb['@id']) ?? [],
      {{else if embedded}}
        {{name}}: {{../lc}}["{{name}}"]?.['@id'] ?? "",
      {{/if}}
    {{/each}}
  } :
  new {{{ucf}}}()
}


export const Form: FunctionComponent<Props> = ({ {{{lc}}} }) => {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    setError,
    control,
    formState: { errors, isSubmitting, dirtyFields, isValid },
  } = useForm<{{{ucf}}}>({
    defaultValues: formatDefaultValue({{lc}}),
  });

  {{#each formFields}}
  {{#if isRelations}}
  const { fields: {{{name}}}, append: append{{{name}}}, remove: remove{{{name}}} } = useFieldArray({
    control,
    name: "{{{name}}}",
  });
  {{/if}}
  {{/each}}
  const saveMutation = useMutation<FetchResponse<{{ucf}}> | undefined, Error|FetchError, SaveParams>((saveParams) => save{{{ucf}}}(saveParams));

  const deleteMutation = useMutation<FetchResponse<{{ucf}}> | undefined, Error|FetchError, DeleteParams>(({ id }) => delete{{{ucf}}}(id), {
    onSuccess: () => {
      router.push("/{{{lc}}}s");
    },
    onError: (error)=> {
      setMessage(`Error when deleting the resource: ${error}`);
      console.error(error);
    }
  });

	const handleDelete = () => {
    setMessage(null);
    if (!{{lc}} || !{{lc}}["@id"]) return;
		if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: {{lc}}["@id"] });
	};

  const onSubmit = async (values: {{{ucf}}}) => {
    const isCreation = !values["@id"];
    setMessage(null);
    
    saveMutation.mutate(
      { values },
      {
        onSuccess: () => {
          setMessage(`Element ${isCreation ? "created" : "updated"}.`);
          router.push("/{{{name}}}");
        },
        onError: (error) => {
          setMessage(error.message);
          if ("fields" in error) {
            error.fields.map(
              ({ field, message }: { field: string; message: string }) =>
                setError(field, { type: "custom", message })
            );
          }
        }
      }
    );
  }

	return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/{{{lc}}}s"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        { {{{lc}}} ? `Edit {{{ucf}}} ${ {{~lc}}['@id']}` : `Create {{{ucf}}}` }
      </h1>
      <form className="shadow-md p-4" onSubmit={handleSubmit(onSubmit)}>
      {{#each formFields}}
            <div className="mb-2">
              {{#if isRelations}}
                <div className="text-gray-700 block text-sm font-bold">{{name}}</div>
                <ul>
                  { {{name}}.map((item, index) => (
                    <li key={item.id}>
                      <input
                        {...register(`{{name}}.${index}`)}
                        name={`{{name}}.${index}`}
                        id={`{{../lc}}_{{name}}.${index}`}
                        aria-label={`{{name}} ${index}`}
                        className="mt-1 border-grey-500 border-2 p-1 "
                      />
                      <button type="button" onClick={() => remove{{name}}(index)}>
                        -
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => append{{name}}("")}
                >
                  Add
                </button>
              {{else}}
                <label className="text-gray-700 block text-sm font-bold" htmlFor="{{../lc}}_{{name}}">{{name}}</label>
                <input
                  {...register("{{name}}", { required: "{{name}} is required" })}
                  name="{{name}}"
                  id="{{../lc}}_{{name}}"
                  type="{{type}}"
                  {{#if step}}step="{{{step}}}"{{/if}}
                  placeholder="{{{description}}}"
                  {{#if required}}required={true}{{/if}}
                  className={`mt-1 block w-full border-grey-500 border-2 p-1 ${errors.{{name}} && dirtyFields.{{name}} ? 'border-red-500' : ''}`}
                  aria-invalid={errors.{{name}} && dirtyFields.{{name~}} ? 'true' : undefined}
                />
                {errors?.{{name}} && (
                  <p className="text-red-600 text-sm">{errors?.{{name}}?.message}</p>
                )}
              {{/if}}
            </div>
          {{/each}}
            {message && (
              <div
              className={`border px-4 py-3 my-4 rounded ${
                isValid ? "text-cyan-700 border-cyan-500 bg-cyan-200/50" : "text-red-700 border-red-400 bg-red-100"
              }`}
                role="alert"
              >
                {message}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
      </form>
      <div className="flex space-x-2 mt-4 justify-end">
      { {{{lc}}} && (
        <button className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded" onClick={handleDelete}>
          Delete
        </button>
      )}
      </div>
    </div>
  );
};
