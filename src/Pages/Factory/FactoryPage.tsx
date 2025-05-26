import FactoryTable from "./FactoryTable";
import { useFactoryData } from "./hooks/useFactoryData";

export default function FactoryPage() {
  const { factoryData, loading, error } = useFactoryData();
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!factoryData) return <div>No data found</div>;

  return <FactoryTable factoryData={factoryData} />;
}
