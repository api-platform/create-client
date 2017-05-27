import React from 'react';
import {Link} from 'react-router-dom';
import {API_PATH} from '../api/_entrypoint';

export default function (itemArray) {
  if (Array.isArray(itemArray)) {
    return (
      itemArray.map(item => {
          return createLink(item)
        }
      )
    );
  } else {
    return createLink(itemArray);
  }
}

function createLink(item) {
  const route = findRoute(item);
  return (
    item.includes(API_PATH) ?
      <span key={item}>
          <Link to={`/${route}/show/${encodeURIComponent(item)}`}>
            {item}
          </Link>
          <br/>
        </span> :
      <span key={item}>{item}<br/></span>
  )
}

function findRoute(item) {
  if (item.includes(API_PATH)) {
    return item.replace(API_PATH, '').split('/')[1].slice(0, -1);;
  }
}
