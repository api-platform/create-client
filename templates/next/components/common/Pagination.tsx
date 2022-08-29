import Link from "next/link";
import { PagedCollection } from "../../types/collection";

interface Props {
  collection: PagedCollection<unknown>;
}

const Pagination = ({ collection }: Props) => {
  const view = collection && collection['{{{hydraPrefix}}}view'];
  if (!view) return null;

  const {
    '{{{hydraPrefix}}}first': first,
    '{{{hydraPrefix}}}previous': previous,
    '{{{hydraPrefix}}}next': next,
    '{{{hydraPrefix}}}last': last
  } = view;

  return (
    <nav aria-label="Page navigation">
      <Link href={first ? first : '#'}>
        <a className={`btn btn-primary${previous ? '' : ' disabled'}`} aria-label="First page">
          <span aria-hidden="true">&lArr;</span> First
        </a>
      </Link>
      <Link href={previous ? previous : '#'}>
        <a className={`btn btn-primary${previous ? '' : ' disabled'}`} aria-label="Previous page">
          <span aria-hidden="true">&larr;</span> Previous
        </a>
      </Link>
      <Link href={next ? next : '#'}>
        <a className={`btn btn-primary${next ? '' : ' disabled'}`} aria-label="Next page">
          Next <span aria-hidden="true">&rarr;</span>
        </a>
      </Link>
      <Link href={last ? last : '#'}>
        <a className={`btn btn-primary${next ? '' : ' disabled'}`} aria-label="Last page">
          Last <span aria-hidden="true">&rArr;</span>
        </a>
      </Link>
    </nav>
  );
};

export default Pagination;
