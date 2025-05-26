import { useEffect, useState } from "react";
import { FactoryData } from "../Types/factoryTypes";

export const useFactoryData = () => {
  const [factoryData, setFactoryData] = useState<FactoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/demo/data/dataProblemSix.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FactoryData = await response.json();
        setFactoryData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch factory data"
        );
        console.error("Error fetching factory data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { factoryData, loading, error };
};
