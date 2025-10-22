import React from "react";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <i className="fas fa-link"></i>
        <h1>URL Shortener</h1>
      </div>
      <p className="tagline">Transform long URLs into short, shareable links</p>
    </header>
  );
};

export default Header;
