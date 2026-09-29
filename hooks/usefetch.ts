import { useState } from "react";

export function useFetch<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (url: string, options?: RequestInit) => {
    try {
      setLoading(true);

      const res = await fetch(url, options);
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorBody.message || `HTTP error! status: ${res.status}`);
      }
      const result = await res.json();

      setData(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}