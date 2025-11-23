"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

  if (!account) {
    return <div className="min-h-screen p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{account.username}</h1>
          <p className="text-muted-foreground capitalize">{account.platform} Account</p>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Video ID</TableHead>
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
                        {post.surge_date
                          ? new Date(post.surge_date).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{post.video_id || '-'}</TableCell>
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

