import { mercureSubscribe } from "@/utils/mercure";
import { onBeforeUnmount } from "vue";

export function useMercureList({
  store,
  deleteStore,
}: {
  store: any;
  deleteStore: any;
}) {
  const mercureEl = (data: any) => {
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
      state.items.map((i: any) => i["@id"] ?? ""),
      mercureEl
    );
  });

  onBeforeUnmount(() => {
    mercureSub?.close();
  });
}
