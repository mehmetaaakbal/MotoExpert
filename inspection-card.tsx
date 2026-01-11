import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, Gauge, DollarSign } from "lucide-react"
import Link from "next/link"

interface InspectionCardProps {
  inspection: {
    id: string
    motorcycle_name: string
    motorcycle_year: number | null
    motorcycle_make: string | null
    motorcycle_model: string | null
    overall_score: number | null
    asking_price: number | null
    estimated_value: number | null
    created_at: string
  }
}

export function InspectionCard({ inspection }: InspectionCardProps) {
  const date = new Date(inspection.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const getScoreColor = (score: number | null) => {
    if (!score) return "secondary"
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
      price,
    )
  }

  return (
    <Card className="glass hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{inspection.motorcycle_name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {inspection.motorcycle_year && `${inspection.motorcycle_year} `}
              {inspection.motorcycle_make} {inspection.motorcycle_model}
            </p>
          </div>
          {inspection.overall_score !== null && (
            <Badge variant={getScoreColor(inspection.overall_score)} className="shrink-0">
              {inspection.overall_score}/100
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <span>{date}</span>
          </div>
          {inspection.overall_score !== null && (
            <div className="flex items-center gap-1.5">
              <Gauge className="size-4" />
              <span>Score: {inspection.overall_score}</span>
            </div>
          )}
        </div>
        {(inspection.asking_price || inspection.estimated_value) && (
          <div className="flex items-center gap-4 text-sm">
            {inspection.asking_price && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-4 text-muted-foreground" />
                <span>Asking: {formatPrice(inspection.asking_price)}</span>
              </div>
            )}
            {inspection.estimated_value && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-4 text-primary" />
                <span className="font-medium">Value: {formatPrice(inspection.estimated_value)}</span>
              </div>
            )}
          </div>
        )}
        <Button asChild variant="outline" size="sm" className="w-full glass-strong hover:bg-primary/10 bg-transparent">
          <Link href={`/dashboard/inspection/${inspection.id}`}>
            <Eye className="size-4 mr-2" />
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
