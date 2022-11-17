import { defineStore } from 'pinia';
import { {{titleUcFirst}} } from 'src/types/{{lc}}';
import { SubmissionError, SubmissionErrors } from 'src/types/error';
import fetch from 'src/utils/fetch';
import { extractHubURL } from 'src/utils/mercure';

interface State {
  retrieved?: {{titleUcFirst}};
  updated?: {{titleUcFirst}};
  hubUrl?: URL;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const use{{titleUcFirst}}UpdateStore = defineStore('{{lc}}Update', {
  state: (): State => ({
    retrieved: undefined,
    updated: undefined,
    hubUrl: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    retrieve(id: string) {
      this.toggleLoading();

      return fetch(id)
        .then((response: Response) =>
          response.json().then((data: {{titleUcFirst}}) => ({
            data,
            hubUrl: extractHubURL(response),
          }))
        )
        .then(({ data, hubUrl }: { data: {{titleUcFirst}}; hubUrl?: URL }) => {
          this.setError('');
          this.toggleLoading();
          this.setRetrieved(data);

          if (hubUrl) {
            this.setHubUrl(hubUrl);
          }
        })
        .catch((e: Error) => {
          this.toggleLoading();
          this.setError(e.message);
        });
    },

    update(values: {{titleUcFirst}}) {
      this.setError(undefined);
      this.toggleLoading();

      if (!this.retrieved) {
        this.setError('No {{lc}} found. Please reload');
        return;
      }

      return fetch(this.retrieved['@id'] ?? values['@id'] ?? '', {
        method: 'PUT',
        headers: new Headers({ 'Content-Type': 'application/ld+json' }),
        body: JSON.stringify(values),
      })
        .then((response: Response) => response.json())
        .then((data: {{titleUcFirst}}) => {
          this.toggleLoading();
          this.resetErrors();
          this.setUpdated(data);
        })
        .catch((e: Error) => {
          this.toggleLoading();

          if (e instanceof SubmissionError) {
            this.setViolations(e.errors);
            this.setError(e.errors._error);
            return;
          }

          this.setError(e.message);
        });
    },

    setRetrieved(retrieved: {{titleUcFirst}}) {
      this.retrieved = retrieved;
    },

    setUpdated(updated: {{titleUcFirst}}) {
      this.updated = updated;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setError(error?: string) {
      this.error = error;
    },

    setViolations(violations?: SubmissionErrors) {
      this.violations = violations;
    },

    resetErrors() {
      this.setError(undefined);
      this.setViolations(undefined);
    },
  },
});
