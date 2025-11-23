"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CampaignStats {
  clientId: number
  campaign: string
  status: string
  postCount: number
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  avgEngagement: number
  topPost: {
    post_id: string
    views: number
    posted_link: string | null
  } | null
  dateRange: {
    earliest: Date
    latest: Date
  } | null
}

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<CampaignStats[]>([])

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns/stats')
      const data = await res.json()
      setCampaigns(data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    }
  }

  const handleCampaignClick = (clientId: number) => {
    router.push(`/dashboard/campaigns/${clientId}`)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Campaigns</h1>
          <p className="text-muted-foreground">View performance metrics by campaign/client</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>Grouped by client with aggregated metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Posts</TableHead>
                    <TableHead className="text-right">Total Views</TableHead>
                    <TableHead className="text-right">Total Likes</TableHead>
                    <TableHead className="text-right">Total Comments</TableHead>
                    <TableHead className="text-right">Total Shares</TableHead>
                    <TableHead className="text-right">Highest View Post</TableHead>
                    <TableHead className="whitespace-nowrap">Date Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow
                      key={campaign.clientId}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleCampaignClick(campaign.clientId)}
                    >
                      <TableCell className="font-medium">{campaign.campaign}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          campaign.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status || 'unknown'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{campaign.postCount}</TableCell>
                      <TableCell className="text-right">{campaign.totalViews.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{campaign.totalLikes.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{campaign.totalComments.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{campaign.totalShares.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {campaign.topPost ? (
                          campaign.topPost.posted_link ? (
                            <a
                              href={campaign.topPost.posted_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {campaign.topPost.views.toLocaleString()}
                            </a>
                          ) : (
                            <span>{campaign.topPost.views.toLocaleString()}</span>
                          )
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {campaign.dateRange
                          ? `${new Date(campaign.dateRange.earliest).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(campaign.dateRange.latest).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          : '-'}
                      </TableCell>
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

