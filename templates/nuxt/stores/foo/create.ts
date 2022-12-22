import { defineStore } from "pinia";
import { {{titleUcFirst}} } from "~~/types/{{lc}}";
import type { SubmissionErrors } from "~~/types/error";
import { SubmissionError } from "~~/utils/error";
import api from "~~/utils/api";

interface State {
  created?: {{titleUcFirst}};
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const use{{titleUcFirst}}CreateStore = defineStore("{{lc}}Create", {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async create(payload: {{titleUcFirst}}) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      try {
        const response = await api("{{name}}", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data: {{titleUcFirst}} = await response.json();

        this.toggleLoading();
        this.setCreated(data);
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
