"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function OverviewPage() {
  const [kpis, setKpis] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
  })
  const [dailyPosts, setDailyPosts] = useState<{ date: string; count: number }[]>([])
  const [topPosts, setTopPosts] = useState<any[]>([])
  const [timePeriod, setTimePeriod] = useState("Last 30 Days")
  const [viewsOverTime, setViewsOverTime] = useState<{ date: string; views: number }[]>([])
  const [engagementRate, setEngagementRate] = useState<{ date: string; engagementRate: number }[]>([])
  const [cumulativeViews, setCumulativeViews] = useState<{ date: string; views: number }[]>([])

  useEffect(() => {
    fetchData()
  }, [timePeriod])

  const fetchData = async () => {
    try {
      // Calculate date range based on selected time period
      const endDate = new Date()
      const startDate = new Date()
      const daysMap: Record<string, number> = {
        "Today": 1,
        "Last 3 Days": 3,
        "Last 7 Days": 7,
        "Last 14 Days": 14,
        "Last 30 Days": 30,
      }
      const days = daysMap[timePeriod] || 30
      startDate.setDate(startDate.getDate() - days)
      
      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]

      // Fetch KPIs with date range
      const kpiRes = await fetch(`/api/kpis?startDate=${startDateStr}&endDate=${endDateStr}`)
      const kpiData = await kpiRes.json()
      setKpis(kpiData)

      // Fetch daily posts breakdown
      const dailyRes = await fetch(`/api/posts/daily-breakdown?days=${days}`)
      const dailyData = await dailyRes.json()
      setDailyPosts(dailyData)

      // Fetch top posts
      const topPostsRes = await fetch(
        `/api/posts/top?limit=20&startDate=${startDateStr}&endDate=${endDateStr}`
      )
      const topPostsData = await topPostsRes.json()
      setTopPosts(topPostsData)

      // Fetch views over time
      const viewsRes = await fetch(`/api/posts/views-over-time?days=${days}`)
      const viewsData = await viewsRes.json()
      setViewsOverTime(viewsData)

      // Fetch engagement rate
      const engagementRes = await fetch(`/api/posts/engagement-rate?days=${days}`)
      const engagementData = await engagementRes.json()
      setEngagementRate(engagementData)

      // Calculate cumulative views
      let cumulative = 0
      const cumulativeData = viewsData.map((item: { date: string; views: number }) => {
        cumulative += item.views
        return { date: item.date, views: cumulative }
      })
      setCumulativeViews(cumulativeData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      const millions = value / 1000000
      return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
    } else if (value >= 1000) {
      const thousands = value / 1000
      return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
    }
    return value.toString()
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">Analytics and insights from your accounts</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Date Range:</label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Last 3 Days">Last 3 Days</SelectItem>
                <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                <SelectItem value="Last 14 Days">Last 14 Days</SelectItem>
                <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Total Views"
            value={kpis.totalViews.toLocaleString()}
            icon={Eye}
          />
          <StatsCard
            title="Total Likes"
            value={kpis.totalLikes.toLocaleString()}
            icon={Heart}
          />
          <StatsCard
            title="Total Comments"
            value={kpis.totalComments.toLocaleString()}
            icon={MessageCircle}
          />
          <StatsCard
            title="Total Shares"
            value={kpis.totalShares.toLocaleString()}
            icon={Share2}
          />
        </div>

        {/* Performance Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Left: Cumulative Views Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Views Over Time</CardTitle>
              <CardDescription>{timePeriod}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cumulativeViews}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                    formatter={(value: number) => formatNumber(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#8884d8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Right: Total Views by Day */}
          <Card>
            <CardHeader>
              <CardTitle>Total Views by Day</CardTitle>
              <CardDescription>{timePeriod}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                    formatter={(value: number) => formatNumber(value)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: "#8884d8", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bottom Left: Engagement Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate Over Time</CardTitle>
              <CardDescription>(Likes + comments + shares) / views</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
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
                    formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagementRate" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ fill: "#82ca9d", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bottom Right: Daily Posts Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Posts Breakdown</CardTitle>
              <CardDescription>Total posts count by date ({timePeriod.toLowerCase()})</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyPosts.map(item => ({ date: formatDate(item.date), count: item.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                    formatter={(value: number) => formatNumber(value)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#ff9500" 
                    strokeWidth={2}
                    dot={{ fill: "#ff9500", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top 20 Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top 20 Posts</CardTitle>
                <CardDescription>Top posts by views for {timePeriod.toLowerCase()}</CardDescription>
              </div>
              <Link href="/dashboard/posts?minViews=10000">
                <Button variant="outline">
                  View All Posts &gt; 10K
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Video</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Likes</TableHead>
                    <TableHead className="text-right">Comments</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPosts.map((post) => (
                    <TableRow key={post.post_id}>
                      <TableCell>{post.accounts?.username || 'Unknown'}</TableCell>
                      <TableCell>
                        {post.posted_link ? (
                          <a 
                            href={post.posted_link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:underline line-clamp-2 max-w-md"
                          >
                            {post.post_caption || post.video_id || '-'}
                          </a>
                        ) : (
                          <span className="line-clamp-2 max-w-md">{post.post_caption || post.video_id || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell>{post.surge_date ? formatDate(post.surge_date) : '-'}</TableCell>
                      <TableCell className="text-right">{post.views?.toLocaleString() || '0'}</TableCell>
                      <TableCell className="text-right">{post.likes?.toLocaleString() || '0'}</TableCell>
                      <TableCell className="text-right">{post.comments?.toLocaleString() || '0'}</TableCell>
                      <TableCell className="text-right">{post.shares?.toLocaleString() || '0'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
