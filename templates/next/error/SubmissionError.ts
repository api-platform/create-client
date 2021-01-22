export interface SubmissionErrorList {
  [key: string]: string;
}

export class SubmissionError extends Error {
  public errors: SubmissionErrorList;

  constructor(errors: SubmissionErrorList) {
    super("Submit Validation Failed");
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    return this;
  }
}
