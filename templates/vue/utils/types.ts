interface Book {
  "@id"?: string;
  isbn?: string;
  title: string;
  description: string;
  author: string;
  publicationDate: string | null;
  reviews?: Review[] | (string | undefined)[];
}

interface Review {
  "@id"?: string;
  body: string;
  rating: string;
  book: Book | string | null;
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
  "hydra:first": string;
  "hydra:last": string;
  "hydra:next": string;
  "hydra:previous": string;
}

interface SubmissionErrors {
  [key: string]: string;
  _error: string;
}

export type { Book, Review, Topbook, View, SubmissionErrors };