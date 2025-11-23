"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AccountWithStats } from "@/lib/types/database"

interface AccountsTableProps {
  accounts: AccountWithStats[]
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <CardDescription>All accounts across platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Platform</th>
                <th className="text-left p-2">Username</th>
                <th className="text-left p-2">Display Name</th>
                <th className="text-right p-2">Followers</th>
                <th className="text-right p-2">Posts</th>
                <th className="text-right p-2">Total Views</th>
                <th className="text-right p-2">Total Likes</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.account_id} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <span className="capitalize">{account.platform}</span>
                  </td>
                  <td className="p-2 font-medium">{account.username}</td>
                  <td className="p-2">{account.display_name || '-'}</td>
                  <td className="p-2 text-right">
                    {account.followers_count?.toLocaleString() || '0'}
                  </td>
                  <td className="p-2 text-right">{account.post_count || 0}</td>
                  <td className="p-2 text-right">
                    {account.total_views?.toLocaleString() || '0'}
                  </td>
                  <td className="p-2 text-right">
                    {account.total_likes?.toLocaleString() || '0'}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      account.account_status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {account.account_status || 'unknown'}
                    </span>
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

