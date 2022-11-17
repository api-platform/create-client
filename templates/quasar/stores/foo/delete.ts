import { defineStore } from 'pinia';
import { {{titleUcFirst}} } from 'src/types/{{lc}}';
import fetch from 'src/utils/fetch';

interface State {
  deleted?: {{titleUcFirst}};
  mercureDeleted?: {{titleUcFirst}};
  isLoading: boolean;
  error?: string;
}

export const use{{titleUcFirst}}DeleteStore = defineStore('{{lc}}Delete', {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    deleteItem(item: {{titleUcFirst}}) {
      this.toggleLoading();

      return fetch(item['@id'] ?? '', { method: 'DELETE' })
        .then(() => {
          this.setError('');
          this.toggleLoading();
          this.setDeleted(item);
          this.setMercureDeleted(undefined);
        })
        .catch((e: Error) => {
          this.toggleLoading();
          this.setError(e.message);
        });
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setDeleted(deleted: {{titleUcFirst}}) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted?: {{titleUcFirst}}) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
