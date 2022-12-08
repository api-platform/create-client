import { defineStore } from "pinia";
import fetch from "@/utils/fetch";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";
import type { CreateState } from "@/types/stores";
import type { SubmissionErrors } from "@/types/error";
import { SubmissionError } from "@/utils/error";

interface State extends CreateState<{{titleUcFirst}}> {}

export const use{{titleUcFirst}}CreateStore = defineStore("{{lc}}Create", {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async create(payload: {{titleUcFirst}}) {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await fetch("{{name}}", {
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

    setError(error: string) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors) {
      this.violations = violations;
    },
  },
});
