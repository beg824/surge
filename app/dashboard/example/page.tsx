import { ExampleChart } from "@/components/dashboard/ExampleChart"

export default function ExamplePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Example Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <ExampleChart />
        </div>
      </div>
    </div>
  )
}

