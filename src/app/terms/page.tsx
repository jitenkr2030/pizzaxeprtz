import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, AlertTriangle, Clock, Shield } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Please read these terms and conditions carefully before using our services
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: November 2024
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Welcome to Pizzaxperts! These Terms of Service ("Terms") govern your use of our website, 
              mobile application, and services (collectively, the "Service"). By accessing or using 
              our Service, you agree to be bound by these Terms.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Important Notice</h4>
              <p className="text-sm text-yellow-700">
                If you do not agree to these Terms, please do not use our Service. Your continued 
                use of the Service after any changes to these Terms constitutes your acceptance 
                of such changes.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Pizzaxperts provides an online food ordering and delivery platform that connects 
                customers with local restaurants. Our Service allows you to:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Browse menus and place food orders online</li>
                <li>• Track order status and delivery progress</li>
                <li>• Make secure payments through our platform</li>
                <li>• Access customer support and service features</li>
                <li>• Participate in loyalty programs and promotions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Account Registration</h4>
                <p className="text-sm text-muted-foreground">
                  To use certain features of our Service, you must register for an account. You agree to:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                  <li>• Provide accurate, current, and complete information</li>
                  <li>• Maintain the security of your account credentials</li>
                  <li>• Update your information promptly when it changes</li>
                  <li>• Be responsible for all activities under your account</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Account Security</h4>
                <p className="text-sm text-muted-foreground">
                  You are responsible for maintaining the confidentiality of your account information 
                  and for all activities that occur under your account. You agree to notify us 
                  immediately of any unauthorized use of your account.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Ordering and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Order Placement</h4>
                <p className="text-sm text-muted-foreground">
                  When you place an order through our Service, you agree to:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                  <li>• Provide accurate delivery information</li>
                  <li>• Pay all applicable fees and taxes</li>
                  <li>• Be available to receive your order</li>
                  <li>• Inspect your order upon delivery</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Payment Terms</h4>
                <p className="text-sm text-muted-foreground">
                  We accept various payment methods as specified on our platform. All payments are 
                  processed securely through third-party payment processors. You agree to:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                  <li>• Provide valid payment information</li>
                  <li>• Pay for all orders placed through your account</li>
                  <li>• Not use fraudulent payment methods</li>
                  <li>• Respect chargeback policies and procedures</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Delivery Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Delivery Area and Time</h4>
                <p className="text-sm text-muted-foreground">
                  We deliver to specified areas within our service radius. Delivery times are estimates 
                  and may vary due to weather, traffic, order volume, or other factors beyond our control.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Delivery Responsibility</h4>
                <p className="text-sm text-muted-foreground">
                  Our delivery partners are responsible for delivering orders in good condition. 
                  You agree to:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                  <li>• Be available at the delivery address</li>
                  <li>• Inspect orders upon receipt</li>
                  <li>• Report issues within 30 minutes of delivery</li>
                  <li>• Treat delivery personnel with respect</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. User Conduct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You agree to use our Service in a manner consistent with all applicable laws and regulations. 
                You shall not:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Use the Service for illegal purposes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Harass or abuse other users</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Place fraudulent orders</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Interfere with Service operation</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Reverse engineer or hack the Service</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Use automated systems to place orders</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Impersonate others or misrepresent yourself</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Violate intellectual property rights</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Returns and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Return Policy</h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Issues must be reported within 30 minutes of delivery</li>
                  <li>• Full refund for quality issues or wrong orders</li>
                  <li>• Free replacement for defective items</li>
                  <li>• No returns for change of mind or taste preferences</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Refund Process</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Refunds processed within 24-48 hours of approval</li>
                  <li>• Refunds issued to original payment method</li>
                  <li>• Processing time depends on payment provider</li>
                  <li>• Customer support available for refund inquiries</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                All content, features, and functionality of our Service are owned by Pizzaxperts 
                and are protected by copyright, trademark, and other intellectual property laws. 
                You may not:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Copy, modify, or distribute our content without permission</li>
                <li>• Use our trademarks or service marks without authorization</li>
                <li>• Reverse engineer or decompile our software</li>
                <li>• Create derivative works based on our Service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by law, Pizzaxperts shall not be liable for:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Indirect, incidental, special, or consequential damages</li>
                <li>• Loss of profits, data, or business opportunities</li>
                <li>• Service interruptions or delivery delays</li>
                <li>• Third-party actions or content</li>
                <li>• Unauthorized access to your account</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Our total liability for any claim related to these Terms shall not exceed the amount 
                you paid to us in the six months preceding the claim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We reserve the right to terminate or suspend your account and access to our Service 
                immediately, without prior notice, for conduct that we believe violates these Terms 
                or is harmful to other users, us, or third parties, or for any other reason at our 
                sole discretion.
              </p>
              <p className="text-muted-foreground">
                Upon termination, your right to use the Service will cease immediately. All provisions 
                of these Terms which by their nature should survive termination shall survive, 
                including without limitation, ownership provisions, warranty disclaimers, 
                indemnity, and limitations of liability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the 
                jurisdiction in which Pizzaxperts operates, without regard to its conflict of law 
                provisions. Any disputes arising under these Terms shall be subject to the exclusive 
                jurisdiction of the courts in that jurisdiction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will provide notice of 
                material changes by posting the revised Terms on our website and updating the 
                "Last Updated" date. Your continued use of the Service after any changes constitutes 
                your acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@pizzaxperts.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Pizza Street, Food City, FC 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}