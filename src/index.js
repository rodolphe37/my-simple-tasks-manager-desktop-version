import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./index.css";
import App from "./App";
import { RecoilRoot } from "recoil";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/antd.css";

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorkerRegistration.register();
