import { Button } from "@/components/ui/button"
import { Bike, ClipboardCheck, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen hex-pattern">
      <div className="container flex flex-col items-center justify-center min-h-screen py-12">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl">
          <div className="flex items-center gap-3">
            <Bike className="size-12 text-primary drop-shadow-[0_0_8px_rgba(255,102,0,0.5)]" />
            <h1 className="text-balance text-5xl font-bold tracking-tight">MotoExpert</h1>
          </div>
          <p className="text-pretty text-xl text-muted-foreground">
            Professional motorcycle inspection tracking system for buyers and enthusiasts
          </p>

          <div className="grid md:grid-cols-3 gap-6 w-full pt-8">
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg glass hover:glass-strong transition-all duration-300">
              <ClipboardCheck className="size-10 text-primary" />
              <h3 className="font-semibold">Detailed Assessments</h3>
              <p className="text-pretty text-sm text-muted-foreground text-center">
                Grade 8 key components with precision sliders
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg glass hover:glass-strong transition-all duration-300">
              <TrendingUp className="size-10 text-primary" />
              <h3 className="font-semibold">Value Calculation</h3>
              <p className="text-pretty text-sm text-muted-foreground text-center">
                Get estimated values based on condition
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg glass hover:glass-strong transition-all duration-300">
              <Shield className="size-10 text-primary" />
              <h3 className="font-semibold">Expert Guidance</h3>
              <p className="text-pretty text-sm text-muted-foreground text-center">
                Access professional inspection tips
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-8">
            <Button asChild size="lg" className="shadow-lg shadow-primary/30">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="glass-strong hover:border-primary/50 bg-transparent">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
