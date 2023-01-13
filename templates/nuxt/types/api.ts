import { FetchError } from "ofetch";
import { Ref } from "vue";
import { SubmissionErrors } from "./error";
import { View } from "./view";

export interface FetchAllData<T> {
  items: Ref<T[]>;
  view: Ref<View | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<FetchError<any> | null>;
  hubUrl: Ref<URL | undefined>;
}

export interface FetchItemData<T> {
  retrieved: Ref<T | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<FetchError<any> | null>;
  hubUrl: Ref<URL | undefined>;
}

export interface CreateItemData<T> {
  created: Ref<T | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<FetchError<any> | null>;
  violations: Ref<SubmissionErrors | undefined>;
}

export interface UpdateItemData<T> {
  updated: Ref<T | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<FetchError<any> | null>;
  violations: Ref<SubmissionErrors | undefined>;
}
