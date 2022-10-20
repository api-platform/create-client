import type { SubmissionErrors } from "@/utils/types";

export default class SubmissionError extends Error {
  errors: SubmissionErrors;

  constructor(errors: SubmissionErrors) {
    super("Submit Validation Failed");
    this.errors = errors;

    // captureStackTrace only supported in V8
    // @ts-ignore
    if (Error.captureStackTrace) {
      // @ts-ignore
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;

    return this;
  }
}
