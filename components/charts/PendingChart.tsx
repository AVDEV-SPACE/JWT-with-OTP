import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function getCurrentMonth() {
  return new Date().toLocaleString("default", { month: "long" });
}

// Funcție pentru a genera o culoare gradient
const getGradientColor = (ratio, color1, color2) => {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
};

export function PendingChart({ appointments }) {
  const pendingCount = appointments?.pendingCount ?? 0;
  const totalCount = appointments?.totalCount ?? 0;

  const hasData = totalCount > 0;

  const colorStart = "#4f46e5";
  const colorEnd = "#5a16d8";

  const chartData = hasData
    ? [
        {
          name: "Pending",
          value: pendingCount,
          fill: getGradientColor(0.7, colorStart, colorEnd), // Ajustează ratio pentru nuanța dorită
        },
        {
          name: "Other",
          value: totalCount - pendingCount,
          fill: getGradientColor(0.3, colorStart, colorEnd), // Ajustează ratio pentru nuanța dorită
        },
      ]
    : [];

  return (
    <Card className="charts bg-black/90 border_unv flex flex-col">
      <CardHeader className="flex flex-col space-y-2 items-center pb-0">
        <CardTitle>Pending Appointments</CardTitle>
        <CardDescription>{getCurrentMonth()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 mt-2">
        {hasData ? (
          <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const { name, value } = payload[0];
                  return (
                    <ChartTooltipContent>
                      <span className="font-medium">{name}</span>: {value}
                    </ChartTooltipContent>
                  );
                }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox?.cx && viewBox?.cy) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-neutral-300 text-3xl font-bold">
                            {pendingCount}
                          </tspan>
                          <tspan x={viewBox.cx} y={viewBox.cy + 24} className="fill-neutral-300 text-sm">
                            Pending
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <p className="text-gray-500 text-center">No appointments available</p>
        )}
      </CardContent>
      {/* <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing pending vs total appointments
        </div>
        <div className="flex items-center gap-2 font-medium leading-none">
          {pendingCount} / {totalCount} <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter> */}
    </Card>
  );
}