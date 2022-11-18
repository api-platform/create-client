import { defineStore } from 'pinia';
import { {{titleUcFirst}} } from 'src/types/{{lc}}';
import { SubmissionError, type SubmissionErrors } from 'src/types/error';
import fetch from 'src/utils/fetch';

interface State {
  created?: {{titleUcFirst}};
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const use{{titleUcFirst}}CreateStore = defineStore('{{lc}}Create', {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    create(values: {{titleUcFirst}}) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      return fetch('{{name}}', { method: 'POST', body: JSON.stringify(values) })
        .then((response: Response) => {
          this.toggleLoading();

          return response.json();
        })
        .then((data) => {
          this.setCreated(data);
        })
        .catch((e: Error | SubmissionError) => {
          this.toggleLoading();

          if (e instanceof SubmissionError) {
            this.setViolations(e.errors);
            return;
          }

          this.setError(e.message);
        });
    },

    setCreated(created: {{titleUcFirst}}) {
      this.created = created;
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setError(error: string | undefined) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors | undefined) {
      this.violations = violations;
    },
  },
});
