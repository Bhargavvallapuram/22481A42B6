import React from "react";

const Result = ({ shortCode }) => {
  const shortUrl = `http://localhost:8080/shorturls/${shortCode}`;

  return (
    <div>
      <center>
      <p>Shortened URL:</p>
      <a href={shortUrl} target="_blank" rel="noopener noreferrer">
        {shortUrl}
      </a>
      </center>
    </div>
  );
};

export default Result;