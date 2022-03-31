import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import * as serviceWorker from "./serviceWorker";
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd'; //css framwork
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import Reducer from "./_reducers";

const createStoreWithMiddlewear = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);


ReactDOM.render(
  //보여주고싶은 컴포넌트를 넣으면됨
  //<React.StrictMode>
  //  <App />
  //</React.StrictMode>
  <Provider
    store={createStoreWithMiddlewear(Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__&& //redux_extension 설치
        window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
  >
   
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
