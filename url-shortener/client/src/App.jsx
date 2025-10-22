import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import UrlShortener from "./components/UrlShortener";
import Analytics from "./components/Analytics";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<UrlShortener />} />
              <Route path="/analytics/:shortCode" element={<Analytics />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
