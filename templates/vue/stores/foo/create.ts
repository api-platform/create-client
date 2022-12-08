import { defineStore } from "pinia";
import fetch from "@/utils/fetch";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";
import type { CreateState } from "@/types/stores";
import type { SubmissionErrors, TError } from "@/types/error";
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
    create(item: {{titleUcFirst}}) {
      this.setError("");
      this.toggleLoading();

      return fetch("{{name}}", { method: "POST", body: JSON.stringify(item) })
        .then((response: Response) => {
          this.setError("");
          this.toggleLoading();

          return response.json();
        })
        .then((data: {{titleUcFirst}}) => {
          this.setCreated(data);
        })
        .catch((e: TError) => {
          this.toggleLoading();

          if (e instanceof SubmissionError) {
            this.setViolations(e.errors);
            this.setError(e.errors._error);
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

    setError(error: string) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors) {
      this.violations = violations;
    },
  },
});
