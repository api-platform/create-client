import { defineStore } from "pinia";
import { {{titleUcFirst}} } from "~~/types/{{lc}}";
import type { SubmissionErrors } from "~~/types/error";
import { CreateItemData } from "~~/types/api";
import { FetchError } from "ofetch";

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
    setData({ created, isLoading, error, violations }: CreateItemData<{{titleUcFirst}}>) {
      this.setCreated(created.value);
      this.setLoading(isLoading.value);
      this.setViolations(violations.value);

      if (error.value instanceof FetchError) {
        this.setError(error.value?.message);
      }
    },

    setCreated(created?: {{titleUcFirst}}) {
      this.created = created;
    },

    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setError(error: string | undefined) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors | undefined) {
      this.violations = violations;
    },
  },
});
