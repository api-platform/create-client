import { NextFunctionComponent } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { btoa } from '../../utils/dataAccess';

interface Props {
  items: string|string[];
  type: string;
  useIcon?: boolean
}
export const ReferenceLinks: NextFunctionComponent<Props> = ({items, type, useIcon = false}) => {
  if (Array.isArray(items)) {
    return (
      <Fragment>
        {items.map((item, index) => (
          <div key={index}><ReferenceLinks items={item} type={type}/></div>
        ))}
      </Fragment>
    );
  }

  // to avoid routes like "/book/books/d4s5s1-qd5sd5d-qsd5qsd4sd" we prefer enconding it
  const id = btoa(items);
  const resourceName = type.toLowerCase();

  return (
    <Link href={`/${resourceName}?id=${id}`} as={`/${resourceName}/${id}`}><a>
      {useIcon ? (
        <Fragment>
          <span className="fa fa-search" aria-hidden="true" />
          <span className="sr-only">Show</span>
        </Fragment>
      ) : items}
    </a></Link>
  )
};
