import { PagedCollection } from "~~/types/collection";
import { FetchAllData, FetchItemData } from "~~/types/api";
import { Ref } from "vue";
import { View } from "~~/types/view";
import { FetchError } from "ofetch";
import { UseFetchOptions } from "#app";
import { SubmissionErrors } from "~~/types/error";
import { Item } from "~~/types/item";

const MIME_TYPE = 'application/ld+json';

async function useApi<T>(path: string, options: UseFetchOptions<T>) {
  const response = await useFetch(path, {
    baseURL: ENTRYPOINT,

    mode: "cors",

    headers: {
      Accept: MIME_TYPE,
    },

    onResponseError({ response }) {
      const data = response._data;
      const error = data["hydra:description"] || response.statusText;

      throw new FetchError(error);
    },

    ...options,
  });

  return response;
}

export async function useFetchAll<T>(
  resource: string
): Promise<FetchAllData<T>> {
  const route = useRoute();

  const items: Ref<T[]> = ref([]);
  const view: Ref<View | undefined> = ref(undefined);
  const hubUrl: Ref<URL | undefined> = ref(undefined);

  const page = ref(route.query.page);

  function setValues(values: PagedCollection<T>) {
    items.value = values?.["hydra:member"];
    view.value = values?.["hydra:view"];
  }

  const { data, pending, refresh, error } = await useApi<T>(resource, {
    query: { page },

    onResponse({ response }) {
      setValues(response._data);

      hubUrl.value = extractHubURL(response);
    },
  });

  setValues(data.value as PagedCollection<T>);

  watch(
    () => route.query.page,
    (newPage) => {
      page.value = newPage as string;
      refresh();
    }
  );

  return {
    items,
    view,
    isLoading: pending,
    error,
    hubUrl,
  };
}

export async function useFetchItem<T>(id: string): Promise<FetchItemData<T>> {
  const retrieved: Ref<T | undefined> = ref(undefined);
  const hubUrl: Ref<URL | undefined> = ref(undefined);

  const { data, pending, error } = await useApi<T>(id, {
    onResponse({ response }) {
      retrieved.value = response._data;
      hubUrl.value = extractHubURL(response);
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
  const created: Ref<T | undefined> = ref(undefined);
  const violations: Ref<SubmissionErrors | undefined> = ref(undefined);

  const { data, pending, error } = await useApi(resource, {
    method: "POST",
    body: payload,

    onResponseError({ response }) {
      const data = response._data;
      const error = data["hydra:description"] || response.statusText;

      if (!data.violations) throw new FetchError(error);

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
  const updated: Ref<T | undefined> = ref(undefined);
  const violations: Ref<SubmissionErrors | undefined> = ref(undefined);

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

      if (!data.violations) throw new FetchError(error);

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
  const error: Ref<string | undefined> = ref(undefined);

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
