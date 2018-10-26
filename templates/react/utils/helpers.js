import React from 'react';
import { Link } from 'react-router-dom';
import { API_ENTRYPOINT } from '../config/_entrypoint';

export function itemToLinks(items) {
  return Array.isArray(items) ? items.map(item => createLink(item)) : createLink(items);
}

function createLink(item) {
  const apiPathname = (new URL(API_ENTRYPOINT).pathname);
  if ('string' !== typeof(item) || !item.includes(apiPathname)) {
    return <div key={item}>{item}</div>;
  }

  const routeWithoutPrefix = item.replace(apiPathname, '');
  const splittedRoute = routeWithoutPrefix.split('/');
  const route = '/' === routeWithoutPrefix[0] ? splittedRoute[1] : splittedRoute[0];

  return <div key={item}><Link to={`/${route}/show/${encodeURIComponent(item)}`}>{item}</Link></div>;
}
