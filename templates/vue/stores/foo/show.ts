import { defineStore } from "pinia";
import { extractHubURL } from "@/utils/mercure";
import fetch from "@/utils/fetch";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";
import type { ShowState } from "@/types/stores";

interface State extends ShowState<{{titleUcFirst}}> {}

export const use{{titleUcFirst}}ShowStore = defineStore("{{lc}}Show", {
  state: (): State => ({
    retrieved: undefined,
    isLoading: false,
    error: "",
    hubUrl: undefined,
  }),

  actions: {
    retrieve(id: string) {
      this.setError("");
      this.toggleLoading();

      return fetch(id)
        .then((response: Response) =>
          response.json().then((data: {{titleUcFirst}}) => ({
            data,
            hubUrl: extractHubURL(response),
          }))
        )
        .then(({ data, hubUrl }: { data: {{titleUcFirst}}; hubUrl: URL | null }) => {
          this.setError("");
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

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setRetrieved(retrieved: {{titleUcFirst}}) {
      this.retrieved = retrieved;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
