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
    async retrieve(id: string) {
      this.toggleLoading();

      try {
        const response = await fetch(id);
        const data: {{titleUcFirst}} = await response.json();
        const hubUrl = extractHubURL(response);

        this.toggleLoading();
        this.setRetrieved(data);

        if (hubUrl) {
          this.setHubUrl(hubUrl);
        }
      } catch (error) {
        this.toggleLoading();

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    async update(payload: {{titleUcFirst}}) {
      this.setError(undefined);
      this.toggleLoading();

      if (!this.retrieved) {
        this.setError('No {{lc}} found. Please reload');
        return;
      }

      try {
        const response = await fetch(
          this.retrieved['@id'] ?? payload['@id'] ?? '',
          {
            method: 'PUT',
            headers: new Headers({ 'Content-Type': 'application/ld+json' }),
            body: JSON.stringify(payload),
          }
        );
        const data: {{titleUcFirst}} = await response.json();

        this.toggleLoading();
        this.setUpdated(data);
      } catch (error) {
        this.toggleLoading();

        if (error instanceof SubmissionError) {
          this.setViolations(error.errors);
          this.setError(error.errors._error);
          return;
        }

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
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
