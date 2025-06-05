import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  cancelled: {
    label: "Cancelled",
    color: "hsl(210, 60%, 40%)", // Va fi înlocuit de gradient
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CancelChart({ appointments }) {
  const [timeRange, setTimeRange] = React.useState("30d");
  const cancelledCount = appointments?.cancelledCount ?? 0;
  const totalCount = appointments?.totalCount ?? 0;

  const generateChartData = React.useMemo(() => {
    const data = [];
    const today = new Date();
    const dailyCancelled = Math.max(1, Math.round(cancelledCount / 30));
    const dailyTotal = Math.max(1, Math.round(totalCount / 30));
    let runningCancelled = 0;
    let runningTotal = 0;

    const generateVariation = (baseValue) => {
      return baseValue * (0.7 + Math.random() * 0.6);
    };

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dailyCancelledVariation = generateVariation(dailyCancelled);
      const dailyTotalVariation = generateVariation(dailyTotal);

      runningCancelled += dailyCancelledVariation;
      runningTotal += dailyTotalVariation;

      runningCancelled = Math.min(runningCancelled, cancelledCount);
      runningTotal = Math.min(runningTotal, totalCount);

      data.push({
        date: date.toISOString().split('T')[0],
        cancelled: Math.round(runningCancelled),
        total: Math.round(runningTotal),
      });
    }
    return data;
  }, [cancelledCount, totalCount]);

  const filteredData = React.useMemo(() => {
    const days = timeRange === "30d" ? 30 : 7;
    return generateChartData.slice(-days);
  }, [generateChartData, timeRange]);

  if (!appointments) return null;

  return (
    <Card className="charts bg-black/90 border_unv w-full flex flex-col">
      <CardHeader className="flex items-center space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 text-center sm:text-left">
          <CardTitle>Cancelled Appointments</CardTitle>
          <CardDescription className="-mt-2">
            {chartConfig.cancelled.label}: {cancelledCount} | {chartConfig.total.label}: {totalCount}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
            <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2  mt-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[230px] w-full"
        >
          <BarChart
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillCancelledGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="6%" stopColor="#4f46e5" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#5a16d8" stopOpacity={0.8} /> {/* Opacitate mai mare pentru bară */}
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className=" bg-black/90 border-none text-white text-left p-4 rounded-lg shadow-md w-auto"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <div
                          className="h-2 w-2 rounded-full mr-2"
                          style={{
                            background: "url(#fillCancelledGradient)", // Folosim gradientul aici
                          }}
                        />
                        <span className="text-sm font-medium">{chartConfig.cancelled.label}:</span>
                        <span className="text-lg font-bold">
                          {filteredData[filteredData.length - 1]?.cancelled || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </ChartTooltipContent>
              }
            />
            <Bar
              dataKey="cancelled"
              fill="url(#fillCancelledGradient)" // Aplicăm gradientul pentru fill
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default CancelChart;