import { defineStore } from "pinia";
import type { {{titleUcFirst}} } from "~~/types/{{lc}}";
import { FetchError } from "ofetch";
import { FetchItemData } from "~~/types/api";
interface State {
  retrieved?: {{titleUcFirst}};
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
}

export const use{{titleUcFirst}}ShowStore = defineStore("{{lc}}Show", {
  state: (): State => ({
    retrieved: undefined,
    isLoading: false,
    error: "",
    hubUrl: undefined,
  }),

  actions: {
    setData({ retrieved, isLoading, error, hubUrl }: FetchItemData<{{titleUcFirst}}>) {
      this.setRetrieved(retrieved.value);
      this.setLoading(isLoading.value);
      this.setHubUrl(hubUrl.value);

      if (error.value instanceof FetchError) {
        this.setError(error.value?.message);
      }
    },

    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setRetrieved(retrieved?: {{titleUcFirst}}) {
      this.retrieved = retrieved;
    },

    setHubUrl(hubUrl?: URL) {
      this.hubUrl = hubUrl;
    },

    setError(error?: string) {
      this.error = error;
    },
  },
});
