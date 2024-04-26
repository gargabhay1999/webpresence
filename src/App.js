import React from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Notes from "./components/Notes";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<NavBar />} />
        <Route path="notes" element={<Notes/>} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
};

export default App;