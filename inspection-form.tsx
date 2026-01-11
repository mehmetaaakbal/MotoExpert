"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react"

interface InspectionData {
  motorcycleName: string
  year: string
  make: string
  model: string
  mileage: string
  askingPrice: string
  location: string
  engineScore: number
  transmissionScore: number
  brakesScore: number
  suspensionScore: number
  tiresScore: number
  electricalScore: number
  bodyScore: number
  frameScore: number
  notes: string
}

const STEPS = [
  { id: 1, title: "Basic Info", description: "Motorcycle details" },
  { id: 2, title: "Assessment", description: "Technical evaluation" },
  { id: 3, title: "Notes", description: "Additional observations" },
]

const ASSESSMENT_CATEGORIES = [
  { key: "engineScore", label: "Engine", description: "Overall engine condition and performance" },
  { key: "transmissionScore", label: "Transmission", description: "Gear shifting and clutch operation" },
  { key: "brakesScore", label: "Brakes", description: "Brake pads, rotors, and stopping power" },
  { key: "suspensionScore", label: "Suspension", description: "Forks, shocks, and handling" },
  { key: "tiresScore", label: "Tires", description: "Tread depth and tire condition" },
  { key: "electricalScore", label: "Electrical", description: "Lights, battery, and electronics" },
  { key: "bodyScore", label: "Body/Fairings", description: "Paint, plastics, and cosmetic condition" },
  { key: "frameScore", label: "Frame/Chassis", description: "Structural integrity and alignment" },
]

export function InspectionForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<InspectionData>({
    motorcycleName: "",
    year: "",
    make: "",
    model: "",
    mileage: "",
    askingPrice: "",
    location: "",
    engineScore: 50,
    transmissionScore: 50,
    brakesScore: 50,
    suspensionScore: 50,
    tiresScore: 50,
    electricalScore: 50,
    bodyScore: 50,
    frameScore: 50,
    notes: "",
  })

  const updateField = (field: keyof InspectionData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateOverallScore = () => {
    const scores = [
      formData.engineScore,
      formData.transmissionScore,
      formData.brakesScore,
      formData.suspensionScore,
      formData.tiresScore,
      formData.electricalScore,
      formData.bodyScore,
      formData.frameScore,
    ]
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  const calculateEstimatedValue = () => {
    const overallScore = calculateOverallScore()
    const askingPrice = Number.parseFloat(formData.askingPrice) || 0
    if (askingPrice === 0) return null

    // Simple value calculation: 80-100 = 100%, 60-79 = 85%, 40-59 = 70%, below 40 = 50%
    let multiplier = 1.0
    if (overallScore >= 80) multiplier = 1.0
    else if (overallScore >= 60) multiplier = 0.85
    else if (overallScore >= 40) multiplier = 0.7
    else multiplier = 0.5

    return askingPrice * multiplier
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const overallScore = calculateOverallScore()
      const estimatedValue = calculateEstimatedValue()

      const { error } = await supabase.from("inspections").insert({
        user_id: user.id,
        motorcycle_name: formData.motorcycleName,
        motorcycle_year: formData.year ? Number.parseInt(formData.year) : null,
        motorcycle_make: formData.make || null,
        motorcycle_model: formData.model || null,
        mileage: formData.mileage ? Number.parseInt(formData.mileage) : null,
        asking_price: formData.askingPrice ? Number.parseFloat(formData.askingPrice) : null,
        inspection_location: formData.location || null,
        engine_score: formData.engineScore,
        transmission_score: formData.transmissionScore,
        brakes_score: formData.brakesScore,
        suspension_score: formData.suspensionScore,
        tires_score: formData.tiresScore,
        electrical_score: formData.electricalScore,
        body_score: formData.bodyScore,
        frame_score: formData.frameScore,
        overall_score: overallScore,
        estimated_value: estimatedValue,
        notes: formData.notes || null,
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving inspection:", error)
      alert("Failed to save inspection. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.motorcycleName.trim() !== ""
    }
    return true
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
        <div className="flex gap-2 pt-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex-1 text-center p-2 rounded-lg border ${
                currentStep === step.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : currentStep > step.id
                    ? "bg-primary/10 border-primary/30"
                    : "bg-muted/30 border-border"
              }`}
            >
              <div className="text-xs font-medium">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the motorcycle details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Motorcycle Name / Nickname <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Red Ducati, John's Honda"
                value={formData.motorcycleName}
                onChange={(e) => updateField("motorcycleName", e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2020"
                  value={formData.year}
                  onChange={(e) => updateField("year", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="15000"
                  value={formData.mileage}
                  onChange={(e) => updateField("mileage", e.target.value)}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  placeholder="Honda, Yamaha, etc."
                  value={formData.make}
                  onChange={(e) => updateField("make", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="CBR600RR, R1, etc."
                  value={formData.model}
                  onChange={(e) => updateField("model", e.target.value)}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Asking Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="8000"
                  value={formData.askingPrice}
                  onChange={(e) => updateField("askingPrice", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Inspection Location</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Assessment */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Assessment</CardTitle>
              <CardDescription>Rate each component from 0 (poor) to 100 (excellent)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ASSESSMENT_CATEGORIES.map((category) => {
                const score = formData[category.key as keyof InspectionData] as number
                return (
                  <div key={category.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold">{category.label}</Label>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
                    </div>
                    <Slider
                      value={[score]}
                      onValueChange={(value) => updateField(category.key as keyof InspectionData, value[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="cursor-pointer"
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Overall Score</div>
                  <div className={`text-4xl font-bold ${getScoreColor(calculateOverallScore())}`}>
                    {calculateOverallScore()}/100
                  </div>
                </div>
                {formData.askingPrice && calculateEstimatedValue() && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-muted-foreground">Estimated Value</div>
                    <div className="text-2xl font-bold text-primary">
                      ${calculateEstimatedValue()?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Asking: ${Number.parseFloat(formData.askingPrice).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Notes */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Record any observations or concerns</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Example: Small dent on left side panel. Front tire needs replacement soon. Owner has all service records..."
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={10}
              className="resize-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1 || isSubmitting}
        >
          <ChevronLeft className="size-4 mr-2" />
          Back
        </Button>

        {currentStep < STEPS.length ? (
          <Button onClick={() => setCurrentStep((prev) => prev + 1)} disabled={!canProceed()}>
            Next
            <ChevronRight className="size-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting || !canProceed()}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="size-4 mr-2" />
                Complete Inspection
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
