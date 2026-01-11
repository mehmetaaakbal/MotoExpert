"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Bike, LogOut, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass-strong">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg hover:text-primary transition-colors"
        >
          <Bike className="size-6 text-primary" />
          <span>MotoExpert</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild className="shadow-md shadow-primary/20">
            <Link href="/dashboard/inspect">
              <Plus className="size-4 mr-2" />
              New Inspection
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="hover:bg-accent/50">
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
