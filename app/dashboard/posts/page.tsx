"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TikTokPostingWithAccountAndClient } from "@/lib/types/database"

type SortField = 'surge_date' | 'views' | 'likes' | 'comments' | 'shares'
type SortDirection = 'asc' | 'desc'

export default function PostsPage() {
  // Initialize minViews from URL params if available
  const getInitialMinViews = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('minViews') || ""
    }
    return ""
  }

  const [posts, setPosts] = useState<TikTokPostingWithAccountAndClient[]>([])
  const [filteredPosts, setFilteredPosts] = useState<TikTokPostingWithAccountAndClient[]>([])
  const [topPosts, setTopPosts] = useState<TikTokPostingWithAccountAndClient[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    accountId: "all",
    clientId: "all",
    videoCategory: "all",
    search: "",
    minViews: getInitialMinViews(),
  })
  const [sortField, setSortField] = useState<SortField>('surge_date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showZeroViews, setShowZeroViews] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  // Update filter when URL params change (e.g., when navigating from overview page)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const minViews = params.get('minViews') || ""
      setFilters(prev => {
        if (prev.minViews !== minViews) {
          return { ...prev, minViews }
        }
        return prev
      })
    }
  }, [])

  useEffect(() => {
    filterAndSortPosts()
  }, [posts, filters, sortField, sortDirection, showZeroViews])

  const fetchData = async () => {
    try {
      const [postsRes, accountsRes, clientsRes] = await Promise.all([
        fetch('/api/posts/all'),
        fetch('/api/accounts/all'),
        fetch('/api/clients/all'),
      ])
      const [postsData, accountsData, clientsData] = await Promise.all([
        postsRes.json(),
        accountsRes.json(),
        clientsRes.json(),
      ])
      setPosts(postsData)
      setAccounts(accountsData)
      setClients(clientsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const filterAndSortPosts = () => {
    let filtered = [...posts]

    // Hide posts with 0 views by default (unless toggle is enabled)
    if (!showZeroViews) {
      filtered = filtered.filter(post => {
        const views = typeof post.views === 'string' ? parseInt(post.views) : (post.views || 0)
        return views > 0
      })
    }

    if (filters.startDate) {
      filtered = filtered.filter(post =>
        post.surge_date && post.surge_date >= filters.startDate
      )
    }
    if (filters.endDate) {
      filtered = filtered.filter(post =>
        post.surge_date && post.surge_date <= filters.endDate
      )
    }
    if (filters.accountId && filters.accountId !== 'all') {
      filtered = filtered.filter(post => post.account_id === filters.accountId)
    }
    if (filters.clientId && filters.clientId !== 'all') {
      filtered = filtered.filter(post => post.client_id === parseInt(filters.clientId))
    }
    if (filters.videoCategory && filters.videoCategory !== 'all') {
      filtered = filtered.filter(post => post.video_category === filters.videoCategory)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(post =>
        post.video_id?.toLowerCase().includes(searchLower) ||
        post.post_caption?.toLowerCase().includes(searchLower)
      )
    }
    if (filters.minViews) {
      const minViews = parseInt(filters.minViews)
      if (!isNaN(minViews)) {
        filtered = filtered.filter(post => {
          const views = typeof post.views === 'string' ? parseInt(post.views) : (post.views || 0)
          return views >= minViews
        })
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (sortField === 'surge_date') {
        aVal = aVal ? new Date(aVal).getTime() : 0
        bVal = bVal ? new Date(bVal).getTime() : 0
      }

      if (sortDirection === 'asc') {
        return (aVal || 0) - (bVal || 0)
      } else {
        return (bVal || 0) - (aVal || 0)
      }
    })

    setFilteredPosts(filtered)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getVideoCategories = () => {
    const categories = new Set<string>()
    posts.forEach(post => {
      if (post.video_category) {
        categories.add(post.video_category)
      }
    })
    return Array.from(categories).sort()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">TikTok Posts</h1>
          <p className="text-muted-foreground">View and analyze all your TikTok posts</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
              <div>
                <label className="text-sm font-medium mb-2 block">Start Date</label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">End Date</label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Account</label>
                <Select value={filters.accountId} onValueChange={(v) => setFilters(prev => ({ ...prev, accountId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {accounts.map(acc => (
                      <SelectItem key={acc.account_id} value={acc.account_id}>
                        {acc.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Client</label>
                <Select value={filters.clientId} onValueChange={(v) => setFilters(prev => ({ ...prev, clientId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client.client_id} value={client.client_id.toString()}>
                        {client.campaign || `Client ${client.client_id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={filters.videoCategory} onValueChange={(v) => setFilters(prev => ({ ...prev, videoCategory: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {getVideoCategories().map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Video"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Min Views</label>
                <Input
                  type="number"
                  placeholder="Min views..."
                  value={filters.minViews}
                  onChange={(e) => setFilters(prev => ({ ...prev, minViews: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Posts</CardTitle>
                <CardDescription>Showing {filteredPosts.length} post(s)</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2.5 text-sm cursor-pointer group">
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={showZeroViews}
                      onChange={(e) => setShowZeroViews(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">Show No-View Posts</span>
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Video</TableHead>
                    <TableHead className="whitespace-nowrap">Posted Date</TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort('views')}>
                      Views {sortField === 'views' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort('likes')}>
                      Likes {sortField === 'likes' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort('comments')}>
                      Comments {sortField === 'comments' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort('shares')}>
                      Shares {sortField === 'shares' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
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
