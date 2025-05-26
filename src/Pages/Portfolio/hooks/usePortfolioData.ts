import { useEffect, useState } from "react";
import { Portfolio } from "../types/portfolio";

export const usePortfolioData = () => {
  const [portfolioData, setPortfolioData] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/demo/data/dataProblemFour.json");
        const data = await response.json();
        setPortfolioData(data.portfolio);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { portfolioData, loading, error };
};
