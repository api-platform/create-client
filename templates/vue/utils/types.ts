interface Book {
  "@id"?: string;
  isbn?: string;
  title: string;
  description: string;
  author: string;
  publicationDate: string | null;
  reviews?: Review[];
}

interface Review {
  "@id"?: string;
  body: string;
  rating: string;
  book: Book;
  author: string;
  publicationDate: string | null;
}

interface Topbook {
  "@id"?: string;
  id: number;
  title: string;
  author: string;
  part: string;
  place: string;
  borrowCount: number;
}

interface View {
  "@id": string;
  "{{hydraPrefix}}first": string;
  "{{hydraPrefix}}last": string;
  "{{hydraPrefix}}next": string;
  "{{hydraPrefix}}previous": string;
}

interface SubmissionErrors {
  [key: string]: string;
  _error: string;
}

export type { Book, Review, Topbook, View, SubmissionErrors };