import React from 'react';
import { Link } from 'react-router-dom';
import { API_PATH } from '../api/_entrypoint';

export function itemToLinks(items) {
  return Array.isArray(items) ? items.map(item => createLink(item)) : createLink(items);
}

function createLink(item) {
  if ('string' !== typeof(item) || !item.includes(API_PATH)) {
    return <span key={item}>{item}<br/></span>;
  }

  const routeWithoutPrefix = item.replace(API_PATH, '');
  const splittedRoute = routeWithoutPrefix.split('/');
  const route = '/' === routeWithoutPrefix[0] ? splittedRoute[1] : splittedRoute[0];

  return <span><Link key={item} to={`/${route}/show/${encodeURIComponent(item)}`}>{item}</Link><br/></span>;
}
