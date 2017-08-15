import React from 'react';
import {Link} from 'react-router-dom';
import {API_PATH} from '../api/_entrypoint';

export function itemToLinks(items) {
  return Array.isArray(items) ? items.map(item => createShortLink(item)) : createShortLink(items);
}

function createShortLink(item) {
  if (typeof(item) === 'string' && item.includes(API_PATH) > 0) {
    const label = item.split('/').splice(-1, 1);
    const route = item.replace(API_PATH, '').split('/')[1];
    return (
      <span key={item}>
        <Link to={`/${route}/show/${encodeURIComponent(item)}`}>
          {label}
        </Link>
        <br/>
      </span>
    );
  }
  return <span key={item}>{item}<br/></span>;
}
