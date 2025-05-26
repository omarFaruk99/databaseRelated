import { usePortfolioData } from "./hooks/usePortfolioData";
import PortfolioTable from "./PortfolioTable";

const PortfolioPage = () => {
  const { portfolioData, loading, error } = usePortfolioData();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!portfolioData) return <div className="p-4">No data found</div>;

  return <PortfolioTable portfolioData={portfolioData} />;
};

export default PortfolioPage;
