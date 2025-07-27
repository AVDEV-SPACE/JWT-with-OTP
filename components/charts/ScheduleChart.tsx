"use client"

import * as React from "react"
import { ComposedChart, Bar, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Configul pentru temă/culoare
const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  scheduled: {
    label: "Scheduled",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// Tooltip custom
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="rounded-lg bg-black/90 p-3 shadow-md">
      <p className="mb-1 text-sm font-medium text-white">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-white">
            {entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function ScheduleChart({ appointments }) {
  const [timeRange, setTimeRange] = React.useState("90d")
  const scheduledCount = appointments?.scheduledCount ?? 0
  const totalCount = appointments?.totalCount ?? 0

  const generateChartData = React.useMemo(() => {
    const data = []
    const today = new Date()
    const dailyScheduled = Math.max(1, Math.round(scheduledCount / 90))
    const dailyTotal = Math.max(1, Math.round(totalCount / 90))

    for (let i = 90; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const baseScheduled = (dailyScheduled * (90 - i)) / 90
      const baseTotal = (dailyTotal * (90 - i)) / 90

      const open = baseScheduled + Math.random() * 10
      const close = baseTotal + Math.random() * 10
      const high = Math.max(open, close) + Math.random() * 5
      const low = Math.min(open, close) - Math.random() * 5

      data.push({
        date: date.toISOString().split("T")[0],
        open: Math.round(open),
        close: Math.round(close),
        high: Math.round(high),
        low: Math.round(low),
      })
    }

    return data
  }, [scheduledCount, totalCount])

  const filteredData = React.useMemo(() => {
    const days = timeRange === "90d" ? 90 : timeRange === "30d" ? 30 : 7
    return generateChartData.slice(-days)
  }, [generateChartData, timeRange])

  return (
    <Card className="charts relative bg-black/90 border_unv flex flex-col">
      <CardHeader className="flex items-center space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 text-center sm:text-left">
          <CardTitle>Scheduled Chart</CardTitle>
          <CardDescription className="-mt-2">
            Appointments overview (OHLC style)
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
            <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
            <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-0 mt-2 w-full -ml-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[230px] w-full">
          <ComposedChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />

            {/* Fitilul: high și low */}
            <Line type="monotone" dataKey="high" stroke="#a1a1aa" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="low" stroke="#a1a1aa" dot={false} strokeWidth={1} />

            {/* Corpul lumânării */}
            <Bar dataKey="close" fill="#4f46e5" barSize={6} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ScheduleChart
