import { defineStore } from "pinia";
import fetch from "@/utils/fetch";
import { extractHubURL } from "@/utils/mercure";
import SubmissionError from "@/error/SubmissionError";
import type { {{titleUcFirst}}, SubmissionErrors } from "@/utils/types";

interface State {
  isLoading: boolean;
  error: string;
  retrieved: {{titleUcFirst}} | null;
  hubUrl: URL | null;
  updated: {{titleUcFirst}} | null;
  violations: SubmissionErrors | null;
}

export const use{{titleUcFirst}}UpdateStore = defineStore("{{lc}}Update", {
  state: (): State => ({
    isLoading: false,
    error: "",
    retrieved: null,
    hubUrl: null,
    updated: null,
    violations: null,
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
