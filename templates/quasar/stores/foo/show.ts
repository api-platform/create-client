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
    retrieve(id: string) {
      this.toggleLoading();

      return fetch(id)
        .then((response: Response) =>
          response.json().then((data: {{titleUcFirst}}) => ({
            data,
            hubUrl: extractHubURL(response),
          }))
        )
        .then(({ data, hubUrl }: { data: {{titleUcFirst}}; hubUrl?: URL }) => {
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
