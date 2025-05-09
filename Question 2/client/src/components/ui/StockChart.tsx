import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { calculateAveragePrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StockPrice {
  price: number;
  lastUpdatedAt: string;
}

interface StockChartProps {
  stockSymbol: string;
  timeInterval: number;
  data: StockPrice[] | StockPrice | null;
  height?: number;
}

interface FormattedDataPoint {
  price: number;
  time: string;
  formattedTime: string;
  timestamp: number;
}

const StockChart = ({ stockSymbol, timeInterval, data, height = 300 }: StockChartProps) => {
  const [chartData, setChartData] = useState<FormattedDataPoint[]>([]);
  const [averagePrice, setAveragePrice] = useState<number | null>(null);

  useEffect(() => {
    if (!data) return;

    // Format the data for the chart
    let formattedData: FormattedDataPoint[] = [];
    
    if (Array.isArray(data)) {
      formattedData = data.map((item) => {
        const date = parseISO(item.lastUpdatedAt);
        return {
          price: item.price,
          time: item.lastUpdatedAt,
          formattedTime: format(date, "HH:mm"),
          timestamp: date.getTime(),
        };
      }).sort((a, b) => a.timestamp - b.timestamp);
      
      setAveragePrice(calculateAveragePrice(data));
    } else if (data.price && data.lastUpdatedAt) {
      const date = parseISO(data.lastUpdatedAt);
      formattedData = [{
        price: data.price,
        time: data.lastUpdatedAt,
        formattedTime: format(date, "HH:mm"),
        timestamp: date.getTime()
      }];
      setAveragePrice(data.price);
    }

    setChartData(formattedData);
  }, [data]);

  if (!data || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
        <p className="text-muted-foreground">No data available for {stockSymbol}</p>
      </div>
    );
  }

  const formatPrice = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="formattedTime"
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            tickFormatter={formatPrice}
          />
          <Tooltip
            formatter={(value: number) => [`${formatPrice(value)}`, 'Price']}
            labelFormatter={(label) => `Time: ${label}`}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--chart-1))"
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={500}
            activeDot={{ r: 6 }}
          />
          {averagePrice !== null && (
            <ReferenceLine
              y={averagePrice}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label={{ 
                value: `Avg: ${formatPrice(averagePrice)}`,
                position: 'insideTopRight',
                fill: 'hsl(var(--primary))',
                fontSize: 12
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
