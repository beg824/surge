"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"
import type { Account } from "@/lib/types/database"
import type { TikTokPostingWithAccountAndClient } from "@/lib/types/database"

export default function AccountDetailPage() {
  const params = useParams()
  const accountId = params.id as string
  const [account, setAccount] = useState<Account | null>(null)
  const [posts, setPosts] = useState<TikTokPostingWithAccountAndClient[]>([])

  useEffect(() => {
    if (accountId) {
      fetchAccount()
      fetchAccountPosts()
    }
  }, [accountId])

  const fetchAccount = async () => {
    try {
      const res = await fetch(`/api/accounts/${accountId}`)
      const data = await res.json()
      setAccount(data)
    } catch (error) {
      console.error('Error fetching account:', error)
    }
  }

  const fetchAccountPosts = async () => {
    try {
      const res = await fetch(`/api/posts/by-account/${accountId}`)
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getAccountUrl = (platform: string, username: string): string | null => {
    if (!username) return null
    
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return `https://www.tiktok.com/@${username}`
      case 'instagram':
        return `https://www.instagram.com/${username}/`
      case 'youtube':
        return `https://www.youtube.com/@${username}`
      default:
        return null
    }
  }

  if (!account) {
    return <div className="min-h-screen p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto space-y-8">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{account.username}</h1>
          <p className="text-muted-foreground capitalize">{account.platform} Account</p>
          </div>
          {getAccountUrl(account.platform, account.username) && (
            <Button
              variant="outline"
              onClick={() => {
                const url = getAccountUrl(account.platform, account.username)
                if (url) window.open(url, '_blank', 'noopener,noreferrer')
              }}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Profile
            </Button>
          )}
        </div>

        {/* Account Info */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.followers_count?.toLocaleString() || '0'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Media Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.media_count?.toLocaleString() || '0'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.views_count_total?.toLocaleString() || '0'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Likes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.likes_count_total?.toLocaleString() || '0'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Display Name</p>
                <p className="font-medium">{account.display_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="font-medium">{account.account_status || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posting Status</p>
                <p className="font-medium">{account.posting_status || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Niche</p>
                <p className="font-medium">{account.account_niche || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>{posts.length} post(s) for this account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Video</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Likes</TableHead>
                    <TableHead className="text-right">Comments</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.post_id}>
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

