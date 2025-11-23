"use client"

import { ChartCard } from "./ChartCard"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface PlatformData {
  platform: string
  count: number
  total_followers: number
  total_views: number
  total_likes: number
}

interface PlatformChartProps {
  data: PlatformData[]
}

export function PlatformChart({ data }: PlatformChartProps) {
  return (
    <ChartCard
      title="Platform Distribution"
      description="Accounts and metrics by platform"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Account Count" />
          <Bar dataKey="total_followers" fill="#82ca9d" name="Total Followers" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

