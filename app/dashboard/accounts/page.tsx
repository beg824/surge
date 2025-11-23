"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, ExternalLink } from "lucide-react"
import type { Account } from "@/lib/types/database"

// Platform Icon Component
const PlatformIcon = ({ platform, className = "w-5 h-5" }: { platform: string; className?: string }) => {
  const iconMap: Record<string, string> = {
    tiktok: "/icons/tiktok.svg",
    instagram: "/icons/instagram.svg",
    youtube: "/icons/youtube.svg",
  }

  const iconPath = iconMap[platform.toLowerCase()]
  
  if (!iconPath) return null

  return (
    <img 
      src={iconPath} 
      alt={platform} 
      className={className}
      onError={(e) => {
        // Hide icon if it doesn't exist
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}

export default function AccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [filters, setFilters] = useState({
    platform: ["tiktok", "instagram", "youtube"] as string[],
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
    setIsLoading(true)
    try {
      const res = await fetch('/api/accounts/all', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await res.json()
      setAccounts(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAccounts = () => {
    let filtered = [...accounts]

    if (filters.platform && filters.platform.length > 0 && filters.platform.length < 3) {
      filtered = filtered.filter(acc => filters.platform.includes(acc.platform))
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

    // Sort by media_count (highest first) by default
    filtered.sort((a, b) => {
      const aCount = a.media_count || 0
      const bCount = b.media_count || 0
      return bCount - aCount
    })

    setFilteredAccounts(filtered)
  }

  const handleRowClick = (accountId: string) => {
    router.push(`/dashboard/accounts/${accountId}`)
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

  const togglePlatform = (platform: string) => {
    setFilters(prev => {
      const currentPlatforms = prev.platform
      if (currentPlatforms.includes(platform)) {
        // Remove platform if it's already selected
        const newPlatforms = currentPlatforms.filter(p => p !== platform)
        // Ensure at least one platform is selected
        return { ...prev, platform: newPlatforms.length > 0 ? newPlatforms : [platform] }
      } else {
        // Add platform if it's not selected
        return { ...prev, platform: [...currentPlatforms, platform] }
      }
    })
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePlatform("tiktok")}
                    className={`h-9 w-9 p-0 bg-white hover:bg-white/90 ${
                      filters.platform.includes("tiktok") ? "!border-2 !border-purple-500" : ""
                    }`}
                    title="TikTok"
                  >
                    <PlatformIcon platform="tiktok" className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePlatform("instagram")}
                    className={`h-9 w-9 p-0 bg-white hover:bg-white/90 ${
                      filters.platform.includes("instagram") ? "!border-2 !border-purple-500" : ""
                    }`}
                    title="Instagram"
                  >
                    <PlatformIcon platform="instagram" className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePlatform("youtube")}
                    className={`h-9 w-9 p-0 bg-white hover:bg-white/90 ${
                      filters.platform.includes("youtube") ? "!border-2 !border-purple-500" : ""
                    }`}
                    title="YouTube"
                  >
                    <PlatformIcon platform="youtube" className="w-5 h-5" />
                  </Button>
                </div>
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Accounts</CardTitle>
                <CardDescription>
                  Showing {filteredAccounts.length} account(s)
                  {lastUpdated && (
                    <span className="ml-2 text-xs">
                      • Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAccounts}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Account Status</TableHead>
                    <TableHead className="text-right">Followers</TableHead>
                    <TableHead className="text-right">Total Views</TableHead>
                    <TableHead className="text-right">Total Likes</TableHead>
                    <TableHead className="text-right">Total Comments</TableHead>
                    <TableHead className="text-right">Media Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow
                      key={account.account_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(account.account_id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{account.username}</span>
                          {getAccountUrl(account.platform, account.username) && (
                            <a
                              href={getAccountUrl(account.platform, account.username) || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Open profile"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{account.account_status || '-'}</TableCell>
                      <TableCell className="text-right">
                        {account.followers_count?.toLocaleString() || '0'}
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
                        {account.media_count?.toLocaleString() || '0'}
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
