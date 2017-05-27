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
  let component = null;
  if(item.includes(API_PATH)) {
    const route = item.replace(API_PATH, '').split('/')[1].slice(0, -1);
    component =
      <span key={item}>
        <Link to={`/${route}/show/${encodeURIComponent(item)}`}>
          {item}
        </Link>
        <br/>
      </span>;
  } else {
    component = <span key={item}>{item}<br/></span>;
  }
  return component;
}
