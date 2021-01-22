import Link from "next/link";
import { Fragment, FunctionComponent } from "react";

interface Props {
  items: string | string[];
  type: string;
  useIcon?: boolean;
}
const ReferenceLinks: FunctionComponent<Props> = ({
  items,
  type,
  useIcon = false,
}) => {
  if (Array.isArray(items)) {
    return (
      <Fragment>
        {items.map((item, index) => (
          <div key={index}>
            <ReferenceLinks items={item} type={type} />
          </div>
        ))}
      </Fragment>
    );
  }

  return (
    <Link href={items}>
      <a>
        {useIcon ? (
          <Fragment>
            <i className="bi bi-search" aria-hidden="true"></i>
            <span className="sr-only">Show</span>
          </Fragment>
        ) : (
          items
        )}
      </a>
    </Link>
  );
};
export default ReferenceLinks;
