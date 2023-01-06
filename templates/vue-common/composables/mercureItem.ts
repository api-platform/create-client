import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import type { StoreGeneric } from "pinia";
import { mercureSubscribe } from "../utils/mercure";
import type { Item } from "../types/item";

export function useMercureItem({
  store,
  deleteStore,
  redirectRouteName,
}: {
  store: StoreGeneric;
  deleteStore: StoreGeneric;
  redirectRouteName: string;
}) {
  const router = useRouter();

  const mercureEl = <T extends Item>(data: T) => {
    if (Object.keys(data).length === 1) {
      deleteStore.setMercureDeleted(data);
      return;
    }

    store.setRetrieved(data);
  };

  let mercureSub: EventSource | null = null;

  store.$subscribe((mutation: any, state: any) => {
    if (!state.hubUrl) {
      return;
    }

    if (mercureSub) {
      mercureSub.close();
    }

    if (!state.retrieved) {
      return;
    }

    mercureSub = mercureSubscribe(
      state.hubUrl,
      [state.retrieved["@id"] ?? ""],
      mercureEl
    );
  });

  deleteStore.$subscribe((mutation: any, state: any) => {
    if (state.mercureDeleted) {
      router.push({ name: redirectRouteName });
    }
  });

  onBeforeUnmount(() => {
    mercureSub?.close();
  });
}
