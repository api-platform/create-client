import book from "./book";
import user from "./user";
import bookmark from "./bookmark";
import review from "./review";

export default {
  book,
  user,
  bookmark,
  review,
  {{#each labels}}
  {{@key}}: '{{this}}',
  {{/each }}
};
