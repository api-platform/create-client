import { Link } from "react-router-dom";
import { PagedCollection } from "../interfaces/Collection";

interface PaginationProps {
  retrieved: PagedCollection<any> | null;
}

const Pagination = ({retrieved}: PaginationProps) => {
  const view = retrieved && retrieved["hydra:view"];
  if (!view) {
    return null;
  }

  const {
    "hydra:first": first,
    "hydra:previous": previous,
    "hydra:next": next,
    "hydra:last": last,
  } = view;

  return (
    <nav aria-label="Page navigation">
      <Link
        to="."
        className={`btn btn-primary${previous ? "" : " disabled"}`}
        aria-label="First page"
      >
        <span aria-hidden="true">&lArr;</span> First
      </Link>
      <Link
        to={
          !previous || previous === first ? "." : encodeURIComponent(previous)
        }
        className={`btn btn-primary${previous ? "" : " disabled"}`}
        aria-label="Previous page"
      >
        <span aria-hidden="true">&larr;</span> Previous
      </Link>
      <Link
        to={next ? encodeURIComponent(next) : "#"}
        className={`btn btn-primary${next ? "" : " disabled"}`}
        aria-label="Next page"
      >
        Next <span aria-hidden="true">&rarr;</span>
      </Link>
      <Link
        to={last ? encodeURIComponent(last) : "#"}
        className={`btn btn-primary${next ? "" : " disabled"}`}
        aria-label="Last page"
      >
        Last <span aria-hidden="true">&rArr;</span>
      </Link>
    </nav>
  );
}

export default Pagination;
