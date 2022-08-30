export type TError = SubmissionError | Error | null;

export interface ApiResource {
  "@id": string;
}

export interface SubmissionErrors {
  [p: string]: string;
}

export class SubmissionError extends Error {
  private readonly _errors: SubmissionErrors

  constructor(message: string, errors: SubmissionErrors) {
    super(message);
    this._errors = errors;
  }

  public get errors(): SubmissionErrors {
    return this._errors;
  }
}
