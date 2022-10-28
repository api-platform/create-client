import type { View } from "@/types/view";
import type { SubmissionErrors } from "./error";

export interface CreateState<T> {
  created?: T;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export interface DeleteState<T> {
  deleted?: T;
  mercureDeleted?: T;
  isLoading: boolean;
  error?: string;
}

export interface ListState<T> {
  items: T[];
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
  view?: View;
}

export interface ShowState<T> {
  retrieved?: T;
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
}

export interface UpdateState<T> {
  updated?: T;
  retrieved?: T;
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
  violations?: SubmissionErrors;
}
