import { SubmissionError } from "@/utils/error";

export type TError = SubmissionError | Error;

export interface SubmissionErrors {
  [key: string]: string;
}
