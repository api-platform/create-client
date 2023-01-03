import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage{{#if hasManyRelations}}, Field, FieldArray{{/if}}, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
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
  await fetch<{{ucf}}>(!values["@id"] ? "/{{{name}}}" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const delete{{{ucf}}} = async (id: string) => await fetch<{{ucf}}>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ {{{lc}}} }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<FetchResponse<{{ucf}}> | undefined, Error|FetchError, SaveParams>((saveParams) => save{{{ucf}}}(saveParams));

  const deleteMutation = useMutation<FetchResponse<{{ucf}}> | undefined, Error|FetchError, DeleteParams>(({ id }) => delete{{{ucf}}}(id), {
    onSuccess: () => {
      router.push("/{{{lc}}}s");
    },
    onError: (error)=> {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    }
  });

	const handleDelete = () => {
    if (!{{lc}} || !{{lc}}["@id"]) return;
		if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: {{lc}}["@id"] });
	};

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
      <Formik
        initialValues={
          {{lc}} ?
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
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/{{{name}}}");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: ()=> {
                setSubmitting(false);
              }
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
          {{#each formFields}}
            <div className="mb-2">
              {{#if isRelations}}
                <div className="text-gray-700 block text-sm font-bold">{{name}}</div>
                <FieldArray
                  name="{{name}}"
                  render={(arrayHelpers) => (
                    <div className="mb-2" id="{{../lc}}_{{name}}">
                      {values.{{name}} && values.{{name}}.length > 0 ? (
                        values.{{name}}.map((item: any, index: number) => (
                          <div key={index}>
                            <Field name={`{{name}}.${index}`} />
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => arrayHelpers.insert(index, '')}
                            >
                              +
                            </button>
                          </div>
                        ))
                      ) : (
                        <button type="button" onClick={() => arrayHelpers.push('')}>
                          Add
                        </button>
                      )}
                    </div>
                  )}
                />
              {{else}}
                <label className="text-gray-700 block text-sm font-bold" htmlFor="{{../lc}}_{{name}}">{{name}}</label>
                <input
                  name="{{name}}"
                  id="{{../lc}}_{{name}}"
                  {{#compare type "==" "dateTime" }}
                  value={values.{{name}}?.toLocaleString() ?? ""}
                  {{/compare}}
                  {{#compare type "!=" "dateTime" }}
                  value={values.{{name}} ?? ""}
                  {{/compare}}
                  type="{{type}}"
                  {{#if step}}step="{{{step}}}"{{/if}}
                  placeholder="{{{description}}}"
                  {{#if required}}required={true}{{/if}}
                  className={`mt-1 block w-full ${errors.{{name}} && touched.{{name}} ? 'border-red-500' : ''}`}
                  aria-invalid={errors.{{name}} && touched.{{name~}} ? 'true' : undefined}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  className="text-xs text-red-500 pt-1"
                  component="div"
                  name="{{name}}"
                />
              {{/if}}
            </div>
          {{/each}}
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid ? "text-cyan-700 border-cyan-500 bg-cyan-200/50" : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
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
        )}
      </Formik>
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
