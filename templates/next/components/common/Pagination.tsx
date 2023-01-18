import Link from "next/link";
import { PagedCollection } from "../../types/collection";

interface Props {
  collection: PagedCollection<unknown>;
  // eslint-disable-next-line no-unused-vars
  getPagePath: (path: string) => string;
}

const Pagination = ({ collection, getPagePath }: Props) => {
  const view = collection && collection['{{{hydraPrefix}}}view'];
  if (!view) return null;

  const {
    '{{{hydraPrefix}}}first': first,
    '{{{hydraPrefix}}}previous': previous,
    '{{{hydraPrefix}}}next': next,
    '{{{hydraPrefix}}}last': last
  } = view;

  return (
    <div className="text-center">
      <nav
        className="text-xs font-bold inline-flex mx-auto divide-x-2 divide-gray-200 flex-row flex-wrap items-center justify-center mb-4 border-2 border-gray-200 rounded-2xl overflow-hidden"
        aria-label="Page navigation"
      >
        <Link
          href={first ? getPagePath(first) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            previous ? "" : " text-gray-500 pointer-events-none"
          }`}
          aria-label="First page"
        >
          <span aria-hidden="true">&lArr;</span> First
        </Link>
        <Link
          href={previous ? getPagePath(previous) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            previous ? "" : " text-gray-500 pointer-events-none"
          }`}
          aria-label="Previous page"
        >
          <span aria-hidden="true">&larr;</span> Previous
        </Link>
        <Link
          href={next ? getPagePath(next) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            next ? "" : " text-gray-500 pointer-events-none"
          }`}
          aria-label="Next page"
        >
          Next <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          href={last ? getPagePath(last) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            next ? "" : "text-gray-500 pointer-events-none"
          }`}
          aria-label="Last page"
        >
          Last <span aria-hidden="true">&rArr;</span>
        </Link>
      </nav>
    </div>
  );
};

export default Pagination;
