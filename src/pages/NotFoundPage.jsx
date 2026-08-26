import React from "react";
import { Link } from "react-router-dom";

// NotFoundPage — 404 fallback
// TODO: Style the 404 state.

const NotFoundPage = () => {
  return (
    <main className="notfoundpage">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Return Home</Link>
    </main>
  );
};

export default NotFoundPage;
