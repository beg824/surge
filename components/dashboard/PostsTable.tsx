"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TikTokPostingWithAccountAndClient } from "@/lib/types/database"

interface PostsTableProps {
  posts: TikTokPostingWithAccountAndClient[]
}

export function PostsTable({ posts }: PostsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TikTok Posts</CardTitle>
        <CardDescription>All posts with account information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Account</th>
                <th className="text-left p-2">Caption</th>
                <th className="text-right p-2">Views</th>
                <th className="text-right p-2">Likes</th>
                <th className="text-right p-2">Comments</th>
                <th className="text-right p-2">Shares</th>
                <th className="text-left p-2">Client</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.post_id} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    {post.surge_date 
                      ? new Date(post.surge_date).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="p-2 font-medium">
                    {post.accounts?.username || 'Unknown'}
                  </td>
                  <td className="p-2 max-w-xs truncate">
                    {post.post_caption || '-'}
                  </td>
                  <td className="p-2 text-right">
                    {post.views?.toLocaleString() || '0'}
                  </td>
                  <td className="p-2 text-right">
                    {post.likes?.toLocaleString() || '0'}
                  </td>
                  <td className="p-2 text-right">
                    {post.comments?.toLocaleString() || '0'}
                  </td>
                  <td className="p-2 text-right">
                    {post.shares?.toLocaleString() || '0'}
                  </td>
                  <td className="p-2">
                    {post.clients?.campaign || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

