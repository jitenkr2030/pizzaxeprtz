import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, Database, Globe, Cookie } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            How we collect, use, and protect your personal information
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: November 2024
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Our Commitment to Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              At Pizzaxperts, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your personal information when you use our website, mobile app, 
              and services. We are committed to protecting your privacy and ensuring your personal 
              information is handled in a safe and responsible manner.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Personal Information</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Name and contact information (email, phone number, address)</li>
                  <li>• Payment information (processed securely through third-party providers)</li>
                  <li>• Order history and preferences</li>
                  <li>• Account credentials and profile information</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Automatically Collected Information</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• IP address and device information</li>
                  <li>• Browser type and version</li>
                  <li>• Pages visited and time spent on our site</li>
                  <li>• Location data (with your consent)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Cookies and Tracking Technologies</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  We use cookies and similar tracking technologies to enhance your experience and analyze site usage:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Essential Cookies</Badge>
                  <Badge variant="secondary">Analytics Cookies</Badge>
                  <Badge variant="secondary">Marketing Cookies</Badge>
                  <Badge variant="secondary">Personalization Cookies</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium">Service Delivery</h4>
                    <p className="text-sm text-muted-foreground">
                      Process orders, manage deliveries, and provide customer support
                    </p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium">Personalization</h4>
                    <p className="text-sm text-muted-foreground">
                      Customize your experience and provide relevant recommendations
                    </p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium">Communication</h4>
                    <p className="text-sm text-muted-foreground">
                      Send order updates, promotional offers, and service announcements
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium">Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Analyze usage patterns to improve our services and user experience
                    </p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium">Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Prevent fraud and protect our platform from security threats
                    </p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium">Legal Compliance</h4>
                    <p className="text-sm text-muted-foreground">
                      Comply with legal obligations and regulatory requirements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Security and Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Security Measures</h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• SSL/TLS encryption for all data transmissions</li>
                  <li>• Secure payment processing through PCI-DSS compliant providers</li>
                  <li>• Regular security audits and vulnerability assessments</li>
                  <li>• Employee training on data protection best practices</li>
                  <li>• Access controls and authentication mechanisms</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Data Retention</h4>
                <p className="text-sm text-blue-700">
                  We retain your personal information only as long as necessary to fulfill the purposes 
                  outlined in this policy, unless a longer retention period is required or permitted by law.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Access and Correction</h4>
                  <p className="text-sm text-muted-foreground">
                    Request access to or correction of your personal information
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Data Deletion</h4>
                  <p className="text-sm text-muted-foreground">
                    Request deletion of your personal information (subject to legal requirements)
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Opt-out</h4>
                  <p className="text-sm text-muted-foreground">
                    Opt-out of marketing communications and certain data collection
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Complaint</h4>
                  <p className="text-sm text-muted-foreground">
                    File complaints with relevant data protection authorities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Cookie Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Essential Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Required for basic website functionality and security features
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Marketing Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Used to track visitors across websites to display relevant ads
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Managing Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    You can manage cookie preferences through your browser settings or our cookie consent banner
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. The updated version will be indicated 
                by a revised "Last Updated" date and the updated version will be effective as soon as it 
                is accessible. We encourage you to review this Privacy Policy frequently to stay informed 
                about how we are protecting your personal information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@pizzaxperts.com</p>
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