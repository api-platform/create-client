import type { PagedCollection } from "~~/types/collection";
import type { FetchAllData, FetchItemData } from "~~/types/api";
import type { Ref } from "vue";
import type { View } from "~~/types/view";
import type { UseFetchOptions } from "#app";
import type { SubmissionErrors } from "~~/types/error";
import type { Item } from "~~/types/item";

const MIME_TYPE = "application/ld+json";

async function useApi<T>(path: string, options: UseFetchOptions<T>) {
  return useFetch(path, {
    baseURL: ENTRYPOINT,
    headers: {
      Accept: MIME_TYPE,
      "Content-Type": MIME_TYPE,
    },

    onResponseError({ response }) {
      const error = response._data["hydra:description"] || response.statusText;

      throw new Error(error);
    },

    ...options,
  });
}

export async function useFetchList<T>(
  resource: string
): Promise<FetchAllData<T>> {
  const route = useRoute();

  const items = ref<T[]>([]) as Ref<T[]>;
  const view = ref<View>();
  const hubUrl = ref<string>();

  const page = ref(route.params.page);

  const { data, pending, error } = await useApi<T>(resource, {
    params: { page },

    onResponse({ response }) {
      hubUrl.value = extractHubURL(response)?.toString();
    },
  });

  const value = data.value as PagedCollection<T>;
  items.value = value["hydra:member"];
  view.value = value["hydra:view"];

  return {
    items,
    view,
    isLoading: pending,
    error,
    hubUrl,
  };
}

export async function useFetchItem<T>(path: string): Promise<FetchItemData<T>> {
  const retrieved = ref<T>();
  const hubUrl = ref<string>();

  const { data, pending, error } = await useApi<T>(path, {
    onResponse({ response }) {
      retrieved.value = response._data;
      hubUrl.value = extractHubURL(response)?.toString();
    },
  });

  retrieved.value = data.value as T;

  return {
    retrieved,
    isLoading: pending,
    error,
    hubUrl,
  };
}

export async function useCreateItem<T>(resource: string, payload: Item) {
  const created = ref<T>();
  const violations = ref<SubmissionErrors>();

  const { data, pending, error } = await useApi(resource, {
    method: "POST",
    body: payload,

    onResponseError({ response }) {
      const data = response._data;
      const error = data["hydra:description"] || response.statusText;

      if (!data.violations) throw new Error(error);

      const errors: SubmissionErrors = { _error: error };
      data.violations.forEach(
        (violation: { propertyPath: string; message: string }) => {
          errors[violation.propertyPath] = violation.message;
        }
      );

      violations.value = errors;

      throw new SubmissionError(errors);
    },
  });

  created.value = data.value as T;

  return {
    created,
    isLoading: pending,
    error,
    violations,
  };
}

export async function useUpdateItem<T>(item: Item, payload: Item) {
  const updated = ref<T>();
  const violations = ref<SubmissionErrors>();

  const { data, pending, error } = await useApi(item["@id"] ?? "", {
    method: "PUT",
    body: payload,
    headers: {
      Accept: MIME_TYPE,
      "Content-Type": MIME_TYPE,
    },

    onResponseError({ response }) {
      const data = response._data;
      const error = data["hydra:description"] || response.statusText;

      if (!data.violations) throw new Error(error);

      const errors: SubmissionErrors = { _error: error };
      data.violations.forEach(
        (violation: { propertyPath: string; message: string }) => {
          errors[violation.propertyPath] = violation.message;
        }
      );

      violations.value = errors;

      throw new SubmissionError(errors);
    },
  });

  updated.value = data.value as T;

  return {
    updated,
    isLoading: pending,
    error,
    violations,
  };
}

export async function useDeleteItem(item: Item) {
  const error = ref<string>();

  if (!item?.["@id"]) {
    error.value = "No item found. Please reload";
    return {
      error,
    };
  }

  const { pending } = await useApi(item["@id"] ?? "", { method: "DELETE" });

  return {
    isLoading: pending,
    error,
  };
}
