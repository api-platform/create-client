import Link from "next/link";
import { Fragment, FunctionComponent } from "react";

interface Props {
  items: string | string[] | { href: string; name: string } | { href: string; name: string }[];
}

const ReferenceLinks: FunctionComponent<Props> = ({ items }) => {
  if (Array.isArray(items)) {
    return (
      <Fragment>
        {items.map((item, index) => (
          <div key={index}>
            <ReferenceLinks items={item} />
          </div>
        ))}
      </Fragment>
    );
  }

  return (
    <Link href={typeof items === "string" ? items : items.href}>
      <a>
        {typeof items === "string" ? items : items.name}
      </a>
    </Link>
  );
};
export default ReferenceLinks;
