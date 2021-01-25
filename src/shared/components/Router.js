import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';

export default function Router(props) {
  if (process.env.REACT_APP_CLIENT === 'browser') {
    return <BrowserRouter>{props.children}</BrowserRouter>;
  } else {
    return <HashRouter>{props.children}</HashRouter>;
  }
}
