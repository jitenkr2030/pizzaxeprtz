import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cookie, Settings, Eye, Shield, CheckCircle, AlertTriangle } from "lucide-react"

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl text-muted-foreground">
            How we use cookies and similar technologies on our website
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: November 2024
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files that are placed on your computer or mobile device when 
              you visit a website. They are widely used to make websites work more efficiently and 
              to provide information to website owners.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">How We Use Cookies</h4>
              <p className="text-sm text-blue-700">
                At Pizzaxperts, we use cookies to enhance your browsing experience, analyze site 
                traffic, personalize content, and provide targeted advertisements. This policy 
                explains the different types of cookies we use and why.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Essential Cookies</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Required for basic website functionality and security features
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• User authentication and session management</p>
                    <p>• Shopping cart functionality</p>
                    <p>• Security and fraud prevention</p>
                    <p>• Load balancing</p>
                  </div>
                  <Badge variant="secondary" className="mt-2">Always Active</Badge>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Analytics Cookies</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Help us understand how visitors interact with our website
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• Website traffic analysis</p>
                    <p>• User behavior tracking</p>
                    <p>• Performance monitoring</p>
                    <p>• Error detection</p>
                  </div>
                  <Badge variant="outline" className="mt-2">Optional</Badge>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Functional Cookies</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enhance functionality and remember user preferences
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• Language preferences</p>
                    <p>• Location settings</p>
                    <p>• Customization options</p>
                    <p>• User interface preferences</p>
                  </div>
                  <Badge variant="outline" className="mt-2">Optional</Badge>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-orange-600" />
                    <h4 className="font-medium">Marketing Cookies</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Used for advertising and tracking user interests
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• Targeted advertising</p>
                    <p>• Campaign tracking</p>
                    <p>• Cross-site tracking</p>
                    <p>• Retargeting</p>
                  </div>
                  <Badge variant="outline" className="mt-2">Optional</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specific Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-medium">Session Cookies</h4>
                      <p className="text-sm text-muted-foreground">Temporary cookies for session management</p>
                    </div>
                    <Badge variant="secondary">Essential</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These cookies are essential for maintaining your session and shopping cart. 
                    They are deleted when you close your browser.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-medium">Google Analytics</h4>
                      <p className="text-sm text-muted-foreground">Website analytics and user behavior tracking</p>
                    </div>
                    <Badge variant="outline">Analytics</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We use Google Analytics to understand how visitors interact with our website, 
                    which helps us improve our services and user experience.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-medium">Facebook Pixel</h4>
                      <p className="text-sm text-muted-foreground">Advertising conversion tracking</p>
                    </div>
                    <Badge variant="outline">Marketing</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This helps us measure the effectiveness of our advertising campaigns and show 
                    relevant ads to users who have visited our site.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-medium">Preference Cookies</h4>
                      <p className="text-sm text-muted-foreground">Remember user settings and preferences</p>
                    </div>
                    <Badge variant="outline">Functional</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These cookies remember your preferences, such as language, location, and 
                    customization settings, to provide a personalized experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Cookie Consent Banner</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  When you first visit our website, you'll see a cookie consent banner that allows 
                  you to choose which types of cookies you want to accept:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-sm mb-2">Accept All</h5>
                    <p className="text-xs text-muted-foreground">
                      Enable all cookies for the best experience
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-sm mb-2">Customize</h5>
                    <p className="text-xs text-muted-foreground">
                      Choose which cookie types to enable
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Browser Settings</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You can also manage cookies through your browser settings. Most browsers allow 
                  you to:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• View the cookies stored on your device</li>
                  <li>• Delete existing cookies</li>
                  <li>• Block cookies from specific websites</li>
                  <li>• Block third-party cookies</li>
                  <li>• Enable private browsing mode</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Important Note
                </h4>
                <p className="text-sm text-yellow-700">
                  Blocking essential cookies may affect the functionality of our website, 
                  including your ability to place orders and use certain features.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We work with third-party service providers who may set cookies on your device 
                when you interact with our website. These third parties include:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Payment Processors</h4>
                    <p className="text-xs text-muted-foreground">
                      Secure payment processing and fraud prevention
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Analytics Providers</h4>
                    <p className="text-xs text-muted-foreground">
                      Website performance and user behavior analysis
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Advertising Partners</h4>
                    <p className="text-xs text-muted-foreground">
                      Targeted advertising and campaign tracking
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Social Media Platforms</h4>
                    <p className="text-xs text-muted-foreground">
                      Social sharing and integration features
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Delivery Partners</h4>
                    <p className="text-xs text-muted-foreground">
                      Order tracking and delivery management
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Customer Support</h4>
                    <p className="text-xs text-muted-foreground">
                      Live chat and support services
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                These third parties have their own privacy policies and cookie policies. 
                We encourage you to review their policies to understand how they collect 
                and use your information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookie Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Session Cookies</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Temporary cookies that expire when you close your browser
                    </p>
                    <Badge variant="secondary">Duration: Session</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Persistent Cookies</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Cookies that remain on your device for a set period
                    </p>
                    <Badge variant="secondary">Duration: 30 days - 2 years</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  The specific duration of each cookie depends on its purpose and type. 
                  You can check the expiration date of cookies in your browser settings.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                As a global service, we may transfer cookie data to countries outside your 
                jurisdiction. We ensure that such transfers comply with applicable data 
                protection laws and that appropriate safeguards are in place.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Data Protection Measures</h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Standard contractual clauses with third-party providers</li>
                  <li>• Compliance with GDPR and other privacy regulations</li>
                  <li>• Regular security audits and assessments</li>
                  <li>• Data encryption and secure storage practices</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in 
                our use of cookies or in response to legal requirements. The updated version 
                will be indicated by a revised "Last Updated" date and will be effective 
                immediately upon posting.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Cookie Policy, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@pizzaxperts.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Pizza Street, Food City, FC 12345</p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button>Manage Cookie Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}