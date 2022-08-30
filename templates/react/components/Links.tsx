import { Link } from "react-router-dom";

interface LinksProps {
  items: string | string[] | { href: string; name: string } | { href: string; name: string }[];
}

const Links = ({ items }: LinksProps) => {
  if (Array.isArray(items)) {
    return (
      <>
        {items.map((item, index) => (
          <div key={index}>
            <Links items={item} />
          </div>
        ))}
      </>
    );
  }

  return (
    <Link to={typeof items === "string" ? items : items.href}>
      {typeof items === "string" ? items : items.name}
    </Link>
  );
}

export default Links;
