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
  }
  return createLink(itemArray);
}

function createLink(item) {
  if(item.includes(API_PATH)) {
    const route = item.replace(API_PATH, '').split('/')[1].slice(0, -1);
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
