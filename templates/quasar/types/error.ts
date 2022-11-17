export type TError = SubmissionError | Error;

export interface SubmissionErrors {
  [key: string]: string;
}

export class SubmissionError extends Error {
  private readonly _errors: SubmissionErrors;

  constructor(errors: SubmissionErrors) {
    super('Submit Validation Failed');
    this._errors = errors;
  }

  public get errors(): SubmissionErrors {
    return this._errors;
  }
}
