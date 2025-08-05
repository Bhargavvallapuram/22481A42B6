import React, { useState } from "react";
import axios from "axios";
import Result from "./Result";

const ShortenForm = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/shorturls", { originalUrl });
      setShortCode(res.data.shortCode);
    } catch (err) {
      console.error("Error shortening URL:", err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter URL"
          required
        />
        <button type="submit">Shorten</button>
      </form>
      {shortCode && <Result shortCode={shortCode} />}
    </div>
  );
};

export default ShortenForm;