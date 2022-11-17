import { mercureSubscribe } from 'src/utils/mercure';
import { onBeforeUnmount } from 'vue';
import type { Item } from 'src/types/item';
import type { StoreGeneric } from 'pinia';

export function useMercureList({
  store,
  deleteStore,
}: {
  store: StoreGeneric;
  deleteStore: StoreGeneric;
}) {
  const mercureEl = <T extends Item>(data: T) => {
    if (Object.keys(data).length === 1) {
      store.deleteItem(data);
      deleteStore.setMercureDeleted(data);
      return;
    }

    store.updateItem(data);
  };

  let mercureSub: EventSource | null = null;

  store.$subscribe((mutation: any, state: any) => {
    if (!state.hubUrl) {
      return;
    }

    if (mercureSub) {
      mercureSub.close();
    }

    if (!state.items?.length) {
      return;
    }

    mercureSub = mercureSubscribe(
      state.hubUrl,
      state.items.map((i: Item) => i['@id'] ?? ''),
      mercureEl
    );
  });

  onBeforeUnmount(() => {
    mercureSub?.close();
  });
}
