import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Field from "../Field";
{{#if hasManyRelations}}import { normalizeLinks } from "../../utils/dataAccess";{{/if}}
import TResource from "./type";
import { SubmissionError, TError } from "../../utils/types";

interface FormProps {
  onSubmit: (item: Partial<TResource>) => any;
  initialValues?: Partial<TResource>;
  error?: TError;
  reset: () => void;
}

const Form = ({onSubmit, error, reset, initialValues}: FormProps) => {
  const { register, setError, handleSubmit, formState: { errors } } = useForm<TResource>({
    defaultValues: initialValues ? {
      ...initialValues,
      {{#each formFields}}
        {{#if isEmbeddeds}}
          {{name}}: initialValues["{{name}}"]?.map((emb: any) => emb['@id']) ?? [],
        {{else if embedded}}
          {{name}}: initialValues["{{name}}"]?.['@id'] ?? "",
        {{/if}}
      {{/each}}
    } : undefined,
  });

  useEffect(() => {
    if (error instanceof SubmissionError) {
      Object.keys(error.errors).forEach((errorPath) => {
        if (errors[errorPath as keyof TResource]) {
          return;
        }
        setError(errorPath as keyof TResource, { type: 'server', message: error.errors[errorPath] });
      });

      reset();
    }
  }, [error, errors, reset, setError]);

  const onFormSubmit: SubmitHandler<TResource> = (data) => {
    onSubmit(
      {
        ...data,
        {{#each formFields ~}}
          {{#if isRelations ~}}
            {{{name}}}: normalizeLinks(data["{{{name}}}"]),
          {{/if ~}}
        {{/each}}
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {{#each formFields}}
        <Field
          register={register}
          name="{{{name}}}"
          placeholder="{{{description}}}"
          type="{{{type}}}"
          {{#if step}}step="{{{step}}}"{{/if}}
          {{#if required}}required{{/if}}
          errors={errors}
        />
      {{/each}}

      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  );
}

export default Form;
