import { defineStore } from 'pinia';
import api from 'src/utils/api';
import type { {{titleUcFirst}} } from 'src/types/{{lc}}';

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
    async deleteItem(item: {{titleUcFirst}}) {
      this.toggleLoading();

      if (!item?.['@id']) {
        this.setError('No {{lc}} found. Please reload');
        return;
      }

      try {
        await api(item['@id'], { method: 'DELETE' });

        this.toggleLoading();
        this.setDeleted(item);
        this.setMercureDeleted(undefined);
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
