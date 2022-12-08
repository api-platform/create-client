import { defineStore } from "pinia";
import fetch from "@/utils/fetch";
import { extractHubURL } from "@/utils/mercure";
import type { {{titleUcFirst}} } from "@/types/{{lc}}";
import type { UpdateState } from "@/types/stores";
import type { SubmissionErrors, TError } from "@/types/error";
import { SubmissionError } from "@/utils/error";

interface State extends UpdateState<{{titleUcFirst}}> {}

export const use{{titleUcFirst}}UpdateStore = defineStore("{{lc}}Update", {
  state: (): State => ({
    updated: undefined,
    retrieved: undefined,
    isLoading: false,
    error: undefined,
    hubUrl: undefined,
    violations: undefined,
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

    update(payload: {{titleUcFirst}}) {
      this.setError("");
      this.toggleLoading();

      if (!this.retrieved) {
        this.setError("No {{lc}} found. Please reload");
        return;
      }

      return fetch(this.retrieved["@id"] ?? "", {
        method: "PUT",
        headers: new Headers({ "Content-Type": "application/ld+json" }),
        body: JSON.stringify(payload),
      })
        .then((response: Response) => response.json())
        .then((data: {{titleUcFirst}}) => {
          this.toggleLoading();
          this.setUpdated(data);
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

    setError(error: string) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors) {
      this.violations = violations;
    },
  },
});
