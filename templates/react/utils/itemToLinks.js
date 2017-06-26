import React from 'react';
import {Link} from 'react-router-dom';
import {API_PATH} from '../api/_entrypoint';

export default (items) => Array.isArray(items) ? items.map(item => createLink(item)) : createLink(items);

function createLink(item) {
  if (typeof item === 'string' && item.includes(API_PATH) > 0) {
    const route = item.replace(API_PATH, '').split('/')[1];
    return <Link to={`/${route}/show/${encodeURIComponent(item)}`} key={item}>{item}</Link>
  }

  return <div key={item}>{item}</div>;
}
