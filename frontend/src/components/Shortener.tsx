import { useState } from "react";
import axios from "axios";

export default function Shortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    try {
      const res = await axios.post("http://localhost:5001/shorten", {
        originalUrl,
      });
      setShortUrl(res.data.shortUrl);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Enter a URL (e.g. https://facebook.com)"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Shorten
        </button>
      </form>

      {error && <p className="text-red-500 font-medium">{error}</p>}

      {shortUrl && (
        <p className="text-green-600 font-semibold">
          Shortened URL:{" "}
          <a className="underline" href={shortUrl} target="_blank">
            {shortUrl}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Copy
          </button>
        </p>
      )}
    </div>
  );
}
