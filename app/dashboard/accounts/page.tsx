"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Account } from "@/lib/types/database"

export default function AccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([])
  const [filters, setFilters] = useState({
    platform: "all",
    account_status: "all",
    posting_status: "all",
    username: "",
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  // Poll for updates every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAccounts()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterAccounts()
  }, [accounts, filters])

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts/all')
      const data = await res.json()
      setAccounts(data)
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  const filterAccounts = () => {
    let filtered = [...accounts]

    if (filters.platform && filters.platform !== 'all') {
      filtered = filtered.filter(acc => acc.platform === filters.platform)
    }
    if (filters.account_status && filters.account_status !== 'all') {
      filtered = filtered.filter(acc => acc.account_status === filters.account_status)
    }
    if (filters.posting_status && filters.posting_status !== 'all') {
      filtered = filtered.filter(acc => acc.posting_status === filters.posting_status)
    }
    if (filters.username) {
      filtered = filtered.filter(acc =>
        acc.username.toLowerCase().includes(filters.username.toLowerCase())
      )
    }

    setFilteredAccounts(filtered)
  }

  const handleRowClick = (accountId: string) => {
    router.push(`/dashboard/accounts/${accountId}`)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Accounts</h1>
          <p className="text-muted-foreground">View and manage all your social media accounts</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Platform</label>
                <Select value={filters.platform} onValueChange={(v) => setFilters(prev => ({ ...prev, platform: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="X">X</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Account Status</label>
                <Select value={filters.account_status} onValueChange={(v) => setFilters(prev => ({ ...prev, account_status: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Posting Status</label>
                <Select value={filters.posting_status} onValueChange={(v) => setFilters(prev => ({ ...prev, posting_status: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Search Username</label>
                <Input
                  placeholder="Search username..."
                  value={filters.username}
                  onChange={(e) => setFilters(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Accounts</CardTitle>
            <CardDescription>Showing {filteredAccounts.length} account(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Account Status</TableHead>
                    <TableHead>Posting Status</TableHead>
                    <TableHead className="text-right">Followers</TableHead>
                    <TableHead className="text-right">Media Count</TableHead>
                    <TableHead className="text-right">Total Views</TableHead>
                    <TableHead className="text-right">Total Likes</TableHead>
                    <TableHead className="text-right">Total Comments</TableHead>
                    <TableHead className="text-right">Total Shares</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow
                      key={account.account_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(account.account_id)}
                    >
                      <TableCell className="font-medium">{account.username}</TableCell>
                      <TableCell className="capitalize">{account.platform}</TableCell>
                      <TableCell>{account.account_status || '-'}</TableCell>
                      <TableCell>{account.posting_status || '-'}</TableCell>
                      <TableCell className="text-right">
                        {account.followers_count?.toLocaleString() || '0'}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.media_count?.toLocaleString() || '0'}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.views_count_total?.toLocaleString() || '0'}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.likes_count_total?.toLocaleString() || '0'}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.comments_count_total?.toLocaleString() || '0'}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.shares_count_total?.toLocaleString() || '0'}
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
