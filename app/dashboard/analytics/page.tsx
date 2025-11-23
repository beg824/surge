"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042']

export default function AnalyticsPage() {
  const [dailyTrends, setDailyTrends] = useState<any[]>([])
  const [topAccounts, setTopAccounts] = useState<any[]>([])
  const [categoryPerformance, setCategoryPerformance] = useState<any[]>([])
  const [platformDistribution, setPlatformDistribution] = useState<any[]>([])
  const [campaignComparison, setCampaignComparison] = useState<any[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [trendsRes, accountsRes, categoryRes, platformRes, campaignRes] = await Promise.all([
        fetch('/api/analytics/daily-trends?days=30'),
        fetch('/api/analytics/top-accounts?limit=10'),
        fetch('/api/analytics/category-performance'),
        fetch('/api/analytics/platform-distribution'),
        fetch('/api/analytics/campaign-comparison'),
      ])

      const [trends, accounts, category, platform, campaign] = await Promise.all([
        trendsRes.json(),
        accountsRes.json(),
        categoryRes.json(),
        platformRes.json(),
        campaignRes.json(),
      ])

      setDailyTrends(trends)
      setTopAccounts(accounts)
      setCategoryPerformance(category)
      setPlatformDistribution(platform)
      setCampaignComparison(campaign)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights</p>
        </div>

        {/* Daily Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Cumulative Views/Engagement Trends</CardTitle>
            <CardDescription>30-day view</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value: number) => {
                    if (value >= 1000000) {
                      const millions = value / 1000000
                      return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
                    } else if (value >= 1000) {
                      const thousands = value / 1000
                      return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
                    }
                    return value.toString()
                  }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--popover))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "Cumulative Views") {
                      if (value >= 1000000) {
                        const millions = value / 1000000
                        return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
                      } else if (value >= 1000) {
                        const thousands = value / 1000
                        return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
                      }
                      return value.toLocaleString()
                    } else if (name === "Engagement") {
                      return `${(value * 100).toFixed(2)}%`
                    }
                    return value
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="views"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: "#8884d8", r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Cumulative Views"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagement"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ fill: "#82ca9d", r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Engagement"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Accounts by Total Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topAccounts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="username" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value: number) => {
                      if (value >= 1000000) {
                        const millions = value / 1000000
                        return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
                      } else if (value >= 1000) {
                        const thousands = value / 1000
                        return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
                      }
                      return value.toString()
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                    formatter={(value: number) => {
                      if (value >= 1000000) {
                        const millions = value / 1000000
                        return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
                      } else if (value >= 1000) {
                        const thousands = value / 1000
                        return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
                      }
                      return value.toLocaleString()
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="engagement" fill="#8884d8" name="Total Engagement" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Video Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="category" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value: number) => {
                      if (value >= 1000000) {
                        const millions = value / 1000000
                        return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
                      } else if (value >= 1000) {
                        const thousands = value / 1000
                        return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
                      }
                      return value.toString()
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                    formatter={(value: number) => {
                      if (value >= 1000000) {
                        const millions = value / 1000000
                        return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
                      } else if (value >= 1000) {
                        const thousands = value / 1000
                        return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
                      }
                      return value.toLocaleString()
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="views" fill="#82ca9d" name="Total Views" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Post Distribution by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campaign Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Comparison</CardTitle>
              <CardDescription>Total views per client</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="campaign" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value: number) => {
                      if (value >= 1000000) {
                        const millions = value / 1000000
                        return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
                      } else if (value >= 1000) {
                        const thousands = value / 1000
                        return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
                      }
                      return value.toString()
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                    formatter={(value: number) => {
                      if (value >= 1000000) {
                        const millions = value / 1000000
                        return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
                      } else if (value >= 1000) {
                        const thousands = value / 1000
                        return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
                      }
                      return value.toLocaleString()
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="views" fill="#ffc658" name="Total Views" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

