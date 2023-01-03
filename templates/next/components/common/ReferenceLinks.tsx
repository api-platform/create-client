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
    <Link
      href={typeof items === "string" ? items : items.href}
      className="text-cyan-700 font-bold"
    >
      {typeof items === "string" ? items : items.name}
    </Link>
  );
};
export default ReferenceLinks;
