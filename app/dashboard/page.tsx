import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Users, Video } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-muted-foreground">
            Select a section to view your data
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Overview</CardTitle>
              <CardDescription>Analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/overview">
                <Button className="w-full">
                  View Overview <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Accounts</CardTitle>
              <CardDescription>Manage your accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/accounts">
                <Button className="w-full">
                  View Accounts <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Video className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Posts</CardTitle>
              <CardDescription>TikTok posts analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/posts">
                <Button className="w-full">
                  View Posts <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

