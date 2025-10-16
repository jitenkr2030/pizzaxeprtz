import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
          <p className="text-xl text-muted-foreground">
            Our return policy and how to process returns
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">30-Minute Window</h4>
                  <p className="text-sm text-muted-foreground">
                    Report issues within 30 minutes of delivery
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Full Refund</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete refund for quality issues or wrong orders
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Free Replacement</h4>
                  <p className="text-sm text-muted-foreground">
                    Get a free replacement for defective items
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">No Returns</h4>
                  <p className="text-sm text-muted-foreground">
                    No returns for change of mind or taste preferences
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Refund Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Report Issue</h4>
                    <p className="text-sm text-muted-foreground">Contact us within 30 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Review Process</h4>
                    <p className="text-sm text-muted-foreground">We review within 1 hour</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Refund Processed</h4>
                    <p className="text-sm text-muted-foreground">Refund within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Eligible Return Reasons</CardTitle>
            <CardDescription>
              Find out if your order qualifies for a return or refund
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-green-600">✓ Eligible for Return/Refund</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Wrong items delivered
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Food quality issues (spoilage, undercooked)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Missing items from order
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Damaged packaging affecting food quality
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Allergen contamination (if specified)
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-red-600">✗ Not Eligible for Return</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Change of mind or taste preference
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Ordered wrong items by mistake
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Late delivery (unless excessive)
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Food not hot enough (reheatable items)
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Reported after 30-minute window
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Request a Return</CardTitle>
            <CardDescription>
              Fill out the form below to initiate your return request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input id="orderNumber" placeholder="Enter your order number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Return Reason</Label>
              <select id="reason" className="w-full p-2 border rounded-md">
                <option value="">Select a reason</option>
                <option value="wrong-items">Wrong items delivered</option>
                <option value="quality-issue">Food quality issue</option>
                <option value="missing-items">Missing items</option>
                <option value="damaged-packaging">Damaged packaging</option>
                <option value="allergen">Allergen contamination</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                placeholder="Please describe the issue in detail..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photos">Upload Photos (Optional)</Label>
              <Input id="photos" type="file" multiple accept="image/*" />
              <p className="text-xs text-muted-foreground">
                Upload photos of the issue to help us process your request faster
              </p>
            </div>
            <div className="flex gap-4">
              <Button>Submit Return Request</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Time-Sensitive</h4>
              <p className="text-sm text-yellow-700">
                All return requests must be made within 30 minutes of delivery. 
                After this window, we cannot process returns or refunds.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Documentation</h4>
              <p className="text-sm text-blue-700">
                Keep your order confirmation and take photos of any issues. 
                This helps us process your request quickly and efficiently.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Customer Satisfaction</h4>
              <p className="text-sm text-green-700">
                We're committed to your satisfaction. If you have any concerns, 
                please contact our customer support team immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}