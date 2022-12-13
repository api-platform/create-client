import { defineStore } from 'pinia';
import { {{titleUcFirst}} } from 'src/types/{{lc}}';
import fetch from 'src/utils/fetch';
import { extractHubURL } from 'src/utils/mercure';

interface State {
  retrieved?: {{titleUcFirst}};
  hubUrl?: URL;
  isLoading: boolean;
  error?: string;
}

export const use{{titleUcFirst}}ShowStore = defineStore('{{lc}}Show', {
  state: (): State => ({
    retrieved: undefined,
    hubUrl: undefined,
    isLoading: false,
    error: undefined,
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
