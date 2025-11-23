"use client"

import { ChartCard } from "./ChartCard"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

interface EngagementData {
  date: string
  views: number
  likes: number
  comments: number
  shares: number
}

interface EngagementChartProps {
  data: EngagementData[]
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <ChartCard
      title="Engagement Over Time"
      description="Views, likes, comments, and shares by date"
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorViews)"
            name="Views"
          />
          <Area
            type="monotone"
            dataKey="likes"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorLikes)"
            name="Likes"
          />
          <Line
            type="monotone"
            dataKey="comments"
            stroke="#ffc658"
            strokeWidth={2}
            name="Comments"
          />
          <Line
            type="monotone"
            dataKey="shares"
            stroke="#ff7300"
            strokeWidth={2}
            name="Shares"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

