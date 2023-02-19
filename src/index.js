import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { StateProvider } from "./components/context/StateProvider";
import reducer, { inicialState } from "./components/context/reducer";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StateProvider inicialState={inicialState} reducer={reducer}>
      <App />
    </StateProvider>
);

reportWebVitals();
