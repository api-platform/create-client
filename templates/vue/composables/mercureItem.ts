import { useRouter } from "vue-router";
import { mercureSubscribe } from "@/utils/mercure";
import { onBeforeUnmount } from "vue";

export function useMercureItem({
  store,
  deleteStore,
  redirectRouteName,
}: {
  store: any;
  deleteStore: any;
  redirectRouteName: string;
}) {
  const router = useRouter();

  const mercureEl = (data: any) => {
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
