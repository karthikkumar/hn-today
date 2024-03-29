import { render } from "react-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

// styles
import "./styles.scss";

const root = document.getElementById("root");
render(<App />, root);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
