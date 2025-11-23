"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp } from "lucide-react"
import { StatsCard } from "@/components/dashboard/StatsCard"
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
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react"

interface CampaignData {
  clientId: number
  campaign: string
  status: string
  postCount: number
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  avgEngagement: number
  dateRange: {
    earliest: Date
    latest: Date
  } | null
  posts: any[]
}

export default function CampaignDetailPage() {
  const params = useParams()
  const clientId = params.id as string
  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [dailyViews, setDailyViews] = useState<any[]>([])
  const [engagementRate, setEngagementRate] = useState<any[]>([])
  const [dailyPostsBreakdown, setDailyPostsBreakdown] = useState<any[]>([])
  const [showAllPosts, setShowAllPosts] = useState(false)

  useEffect(() => {
    if (clientId) {
      fetchCampaign()
    }
  }, [clientId])

  const fetchCampaign = async () => {
    try {
      const res = await fetch(`/api/campaigns/${clientId}`)
      const data = await res.json()
      setCampaign(data)

      // Prepare performance chart data - cumulative views
      const dateMap = new Map<string, number>()
      data.posts?.forEach((post: any) => {
        if (post.surge_date && post.views) {
          // Normalize date to YYYY-MM-DD format for consistent sorting
          const dateStr = post.surge_date.includes('T') 
            ? post.surge_date.split('T')[0] 
            : post.surge_date
          const existing = dateMap.get(dateStr) || 0
          const views = Number(post.views) || 0
          dateMap.set(dateStr, existing + views)
        }
      })

      // Convert to array and sort by date string (YYYY-MM-DD format sorts correctly)
      const sortedDates = Array.from(dateMap.entries())
        .map(([dateStr, views]) => ({
          dateStr,
          views: Number(views)
        }))
        .sort((a, b) => a.dateStr.localeCompare(b.dateStr)) // Sort by date string (YYYY-MM-DD)

      // Calculate cumulative views - each point should be >= previous
      let cumulative = 0
      const chartData = sortedDates.map(({ dateStr, views }) => {
        cumulative += views
        const date = new Date(dateStr + 'T00:00:00')
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: cumulative
        }
      })

      setPerformanceData(chartData)

      // Calculate daily views (non-cumulative)
      const dailyViewsData = sortedDates.map(({ dateStr, views }) => {
        const date = new Date(dateStr + 'T00:00:00')
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: views
        }
      })
      setDailyViews(dailyViewsData)

      // Calculate engagement rate over time (average of per-post rates)
      const engagementMap = new Map<string, { rates: number[] }>()
      data.posts?.forEach((post: any) => {
        if (post.surge_date && post.views && post.views > 0) {
          const dateStr = post.surge_date.includes('T') 
            ? post.surge_date.split('T')[0] 
            : post.surge_date
          const existing = engagementMap.get(dateStr) || { rates: [] }
          const engagement = (post.likes || 0) + (post.comments || 0) + (post.shares || 0)
          const views = post.views || 0
          const rate = views > 0 ? engagement / views : 0
          existing.rates.push(rate)
          engagementMap.set(dateStr, existing)
        }
      })

      const engagementData = Array.from(engagementMap.entries())
        .map(([dateStr, { rates }]) => {
          const avgRate = rates.length > 0 
            ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length 
            : 0
          return {
            dateStr,
            engagementRate: avgRate
          }
        })
        .sort((a, b) => a.dateStr.localeCompare(b.dateStr))
        .map(({ dateStr, engagementRate }) => {
          const date = new Date(dateStr + 'T00:00:00')
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            engagementRate: Number(engagementRate.toFixed(4)) // Keep as decimal (e.g., 0.10 for 10%)
          }
        })
      setEngagementRate(engagementData)

      // Calculate daily posts breakdown
      const postsCountMap = new Map<string, number>()
      data.posts?.forEach((post: any) => {
        if (post.surge_date) {
          const dateStr = post.surge_date.includes('T') 
            ? post.surge_date.split('T')[0] 
            : post.surge_date
          const existing = postsCountMap.get(dateStr) || 0
          postsCountMap.set(dateStr, existing + 1)
        }
      })

      const postsBreakdownData = Array.from(postsCountMap.entries())
        .map(([dateStr, count]) => ({
          dateStr,
          count
        }))
        .sort((a, b) => a.dateStr.localeCompare(b.dateStr))
        .map(({ dateStr, count }) => {
          const date = new Date(dateStr + 'T00:00:00')
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count
          }
        })
      setDailyPostsBreakdown(postsBreakdownData)
    } catch (error) {
      console.error('Error fetching campaign:', error)
    }
  }

  if (!campaign) {
    return <div className="min-h-screen p-8">Loading...</div>
  }

  // Get top performing posts
  const topPosts = [...(campaign.posts || [])]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10)

  // Sort all posts by views (highest to lowest)
  const sortedAllPosts = [...(campaign.posts || [])]
    .sort((a, b) => (b.views || 0) - (a.views || 0))

  // Show first 20 posts by default, or all if expanded
  const displayedPosts = showAllPosts ? sortedAllPosts : sortedAllPosts.slice(0, 20)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      const formatted = (value / 1000000).toFixed(1)
      return formatted.endsWith('.0') ? `${parseInt(formatted)}M` : `${formatted}M`
    } else if (value >= 1000) {
      const formatted = (value / 1000).toFixed(1)
      return formatted.endsWith('.0') ? `${parseInt(formatted)}K` : `${formatted}K`
    }
    return value.toLocaleString()
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{campaign.campaign}</h1>
          <p className="text-muted-foreground">Campaign Performance Details</p>
        </div>

        {/* Campaign Metrics */}
        <div className="grid gap-4 md:grid-cols-5">
          <StatsCard
            title="Total Posts"
            value={campaign.postCount}
          />
          <StatsCard
            title="Total Views"
            value={campaign.totalViews.toLocaleString()}
            icon={Eye}
          />
          <StatsCard
            title="Total Likes"
            value={campaign.totalLikes.toLocaleString()}
            icon={Heart}
          />
          <StatsCard
            title="Total Comments"
            value={campaign.totalComments.toLocaleString()}
            icon={MessageCircle}
          />
          <StatsCard
            title="Total Shares"
            value={campaign.totalShares.toLocaleString()}
            icon={Share2}
          />
        </div>

        {/* Campaign Info */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{campaign.status || 'unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Range</p>
                <p className="font-medium whitespace-nowrap">
                  {campaign.dateRange
                    ? `${new Date(campaign.dateRange.earliest).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(campaign.dateRange.latest).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid - 2x2 layout */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Left: Cumulative Views */}
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Views Over Time</CardTitle>
              <CardDescription>Total views accumulated by date</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
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
              <CardDescription>Daily views for this campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyViews}>
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
              <CardDescription>Total posts count by date</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyPostsBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                    dot={{ fill: "#ffc658", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Top 10 posts by views</CardDescription>
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
                  {topPosts.map((post: any) => (
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

        {/* All Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Posts in Campaign</CardTitle>
                <CardDescription>
                  {showAllPosts 
                    ? `Showing all ${campaign.posts?.length || 0} post(s)` 
                    : `Showing ${Math.min(20, campaign.posts?.length || 0)} of ${campaign.posts?.length || 0} post(s)`}
                </CardDescription>
              </div>
              {sortedAllPosts.length > 20 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllPosts(!showAllPosts)}
                  className="flex items-center gap-2"
                >
                  {showAllPosts ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show All ({sortedAllPosts.length})
                    </>
                  )}
                </Button>
              )}
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
                  {displayedPosts.map((post: any) => (
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

