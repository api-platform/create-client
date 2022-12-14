import type { SubmissionErrors } from "../types/error";

export class SubmissionError extends Error {
  private readonly _errors: SubmissionErrors;

  constructor(errors: SubmissionErrors) {
    super("Submit Validation Failed");
    this._errors = errors;
  }

  public get errors(): SubmissionErrors {
    return this._errors;
  }
}
