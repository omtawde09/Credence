"use client"

import React, { useState } from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Mock Data for different periods
const data7D = [
  { day: "Mon", amount: 12500 },
  { day: "Tue", amount: 18000 },
  { day: "Wed", amount: 15200 },
  { day: "Thu", amount: 21000 },
  { day: "Fri", amount: 19000 },
  { day: "Sat", amount: 32000 },
  { day: "Sun", amount: 28000 },
]

const data30D = [
  { day: "Week 1", amount: 45000 },
  { day: "Week 2", amount: 52000 },
  { day: "Week 3", amount: 48000 },
  { day: "Week 4", amount: 61000 },
]

const data90D = [
  { day: "Oct", amount: 180000 },
  { day: "Nov", amount: 210000 },
  { day: "Dec", amount: 195000 },
]

const chartConfig = {
  amount: {
    label: "Forecasted Cash",
    color: "#0d9488", // Teal-600
  },
}

export function ForecastChart() {
  const [activeTab, setActiveTab] = useState("7D")

  const getData = () => {
    if (activeTab === "7D") return data7D
    if (activeTab === "30D") return data30D
    return data90D
  }

  return (
    <Card className="w-full bg-white border-slate-200 rounded-[32px] overflow-hidden shadow-xl shadow-slate-900/5 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-slate-800">Liquidity Forecast</CardTitle>
          <CardDescription className="text-slate-500 text-xs">Probabilistic cashflow projection</CardDescription>
        </div>

        {/* TOP RIGHT TABS */}
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
          {["7D", "30D", "90D"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-[9px] font-bold rounded-lg transition-all ${activeTab === tab
                ? "bg-slate-800 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 px-4 pb-2">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={getData()}
            margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-[10px] font-medium text-slate-500"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
              className="text-[10px] font-medium text-slate-500"
            />
            <ChartTooltip
              cursor={{ stroke: '#0d9488', strokeWidth: 1 }}
              content={<ChartTooltipContent
                className="bg-slate-800 text-white border-none rounded-xl"
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />}
            />
            <Line
              dataKey="amount"
              type="monotone"
              stroke="#0d9488"
              strokeWidth={3}
              dot={{ fill: '#0d9488', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-1 pb-6 px-6 pt-2 text-sm border-t border-slate-200/30">
        <div className="flex gap-2 leading-none font-bold text-slate-800">
          Solvency increased by 12% <TrendingUp className="h-4 w-4 text-teal-600" />
        </div>
        <div className="text-slate-500 text-[10px] leading-none">
          ML engine simulating 10k scenarios for {activeTab} period.
        </div>
      </CardFooter>
    </Card>
  )
}