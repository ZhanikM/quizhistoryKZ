import React from "react";
import ReactDOM from "react-dom/client";
import Quiz from "./quiz";
import "./style.css";
import { BrowserRouter } from "react-router-dom"; // если используешь роутер

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Указываем basename для корректной работы в поддиректории */}
    <BrowserRouter basename="/quizhistoryKZ/">
      <Quiz />
    </BrowserRouter>
  </React.StrictMode>
);
