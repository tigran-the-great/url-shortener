import { useEffect, useState } from "react";
import axios from "axios";

type Url = {
  slug: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
};

export default function Dashboard() {
  const [urls, setUrls] = useState<Url[]>([]);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await axios.get("http://localhost:5001/urls");
        setUrls(res.data);
      } catch (err) {
        console.error("Request error:", err);
      }
    };

    fetchUrls();
  }, []);

  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Shortened URLs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Slug</th>
              <th className="px-4 py-2 border">Original URL</th>
              <th className="px-4 py-2 border">Visits</th>
              <th className="px-4 py-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {urls.length &&
              urls?.map((url) => (
                <tr key={url.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    <a
                      className="text-blue-600 hover:underline"
                      href={`http://localhost:5001/${url.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {url.slug}
                    </a>
                  </td>
                  <td className="px-4 py-2 border">{url.originalUrl}</td>
                  <td className="px-4 py-2 border text-center">
                    {url.visitCount}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(url.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {urls.length === 0 && (
          <p className="text-gray-500 mt-4">No URLs created yet.</p>
        )}
      </div>
    </div>
  );
}
