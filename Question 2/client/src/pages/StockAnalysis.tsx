import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import StockSelector from "@/components/ui/StockSelector";
import TimeIntervalSelector from "@/components/ui/TimeIntervalSelector";
import StockChart from "@/components/ui/StockChart";
import CorrelationHeatmap from "@/components/ui/CorrelationHeatmap";
import { format } from "date-fns";
import { formatCurrency, calculatePriceChange, calculateAveragePrice } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

const StockAnalysis = () => {
  const [selectedStock, setSelectedStock] = useState<string>("NVDA");
  const [timeInterval, setTimeInterval] = useState<number>(50);

  const { data: stockData, isLoading } = useQuery({
    queryKey: [`/api/stocks/${selectedStock}?minutes=${timeInterval}`],
  });

  const { data: stocksList } = useQuery({
    queryKey: ['/api/stocks'],
  });

  const handleStockChange = (stock: string) => {
    setSelectedStock(stock);
  };

  const handleTimeIntervalChange = (interval: number) => {
    setTimeInterval(interval);
  };
  const priceChange = stockData ? calculatePriceChange(stockData) : null;
  const averagePrice = stockData ? calculateAveragePrice(stockData) : null;
  const currentPrice = stockData && Array.isArray(stockData) ? stockData[stockData.length - 1]?.price : (stockData?.price || 0);

  return (
    <div className="container mx-auto px-4 py-6">
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Stock Analysis</CardTitle>
          <div className="flex space-x-2">
            <StockSelector 
              selectedStock={selectedStock} 
              onStockChange={handleStockChange}
              stocksList={stocksList?.stocks}
            />
            <TimeIntervalSelector 
              selectedInterval={timeInterval} 
              onIntervalChange={handleTimeIntervalChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-2xl font-medium">
                {formatCurrency(currentPrice)}
              </div>
              {priceChange && (
                <div className={`flex items-center ${priceChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange.isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  <span>{`${formatCurrency(priceChange.amount)} (${priceChange.percentage.toFixed(2)}%)`}</span>
                </div>
              )}
            </div>
            {averagePrice && (
              <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
                Avg. Price: {formatCurrency(averagePrice)}
              </div>
            )}
          </div>
          
          <StockChart 
            stockSymbol={selectedStock}
            timeInterval={timeInterval}
            data={stockData}
            height={400}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Stock Correlation Heatmap</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">Correlation Strength:</div>
            <div className="correlation-gradient w-32"></div>
            <div className="flex text-xs justify-between w-32">
              <span className="text-destructive">Negative</span>
              <span>Neutral</span>
              <span className="text-green-600">Positive</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CorrelationHeatmap selectedStock={selectedStock} />
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Hover over cells to see detailed statistics. Strong positive correlations (closer to 1.0) appear in green, while negative correlations appear in red.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockAnalysis;
