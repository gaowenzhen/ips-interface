// import React from "react";
// import ReactDOM from "react-dom";

import { createRoot } from 'react-dom/client'
import { BASE_THEME_KEYWORD, BASE_THEME_LIGHT } from "./constants";
import Root from "./Root";

const theme = localStorage.getItem(BASE_THEME_KEYWORD);
document.documentElement.setAttribute('data-theme', theme || BASE_THEME_LIGHT)
if (!theme) {
	localStorage.setItem(BASE_THEME_KEYWORD, BASE_THEME_LIGHT)
}

createRoot(document.getElementById('root') as HTMLElement).render(<Root />);

// ReactDOM.render(<Root />, document.getElementById("root"));



