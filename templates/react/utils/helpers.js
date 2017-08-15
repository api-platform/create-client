import React from 'react';
import { Link } from 'react-router-dom';
import { API_PATH } from '../api/_entrypoint';

export function itemToLinks(items) {
  return Array.isArray(items) ? items.map(item => createLink(item)) : createLink(items);
}

function createLink(item) {
  if (typeof(item) === 'string' && item.includes(API_PATH) > 0) {
    const route = item.replace(API_PATH, '').split('/')[0];
    return (
      <span key={item}>
        <Link to={`/${route}/show/${encodeURIComponent(item)}`}>
          {item}
        </Link>
        <br/>
      </span>
    );
  }
  return <span key={item}>{item}<br/></span>;
}
