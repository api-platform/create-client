import { defineStore } from "pinia";
import fetch from "@/utils/fetch";
import SubmissionError from "@/error/SubmissionError";
import type { {{titleUcFirst}}, SubmissionErrors } from "@/utils/types";

interface State {
  isLoading: boolean;
  error: string;
  created: {{titleUcFirst}} | null;
  violations: SubmissionErrors | null;
}

export const use{{titleUcFirst}}CreateStore = defineStore("{{lc}}Create", {
  state: (): State => ({
    isLoading: false,
    error: "",
    created: null,
    violations: null,
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
        .catch((e: Error | SubmissionError) => {
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
