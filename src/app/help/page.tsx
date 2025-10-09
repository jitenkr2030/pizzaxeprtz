import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Phone, Mail, MessageCircle, BookOpen, Users, Clock, Truck } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground">
            How can we help you today?
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for help articles..." 
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Help Categories */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Popular Help Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <h4 className="font-medium mb-2">Ordering & Payment</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn how to place orders and manage payments
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Payment</Badge>
                      <Badge variant="secondary">Orders</Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <h4 className="font-medium mb-2">Delivery & Tracking</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Track your order and understand delivery options
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Delivery</Badge>
                      <Badge variant="secondary">Tracking</Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <h4 className="font-medium mb-2">Account & Profile</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage your account and personal information
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Account</Badge>
                      <Badge variant="secondary">Profile</Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <h4 className="font-medium mb-2">Menu & Items</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Explore our menu and customize your orders
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Menu</Badge>
                      <Badge variant="secondary">Customization</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">How do I track my order?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can track your order by visiting the Track Order page and entering your order number. 
                    You'll also receive tracking updates via SMS and email.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
                  <p className="text-sm text-muted-foreground">
                    We accept credit cards, debit cards, UPI, net banking, digital wallets, and cash on delivery.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">How can I cancel my order?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can cancel your order within 5 minutes of placing it. After that, please contact our customer support.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Do you offer vegetarian options?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! We offer a wide variety of vegetarian and vegan options. Look for the vegetarian and vegan badges on our menu items.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Get personalized help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                  <Badge variant="secondary">24/7</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@pizzaxperts.com</p>
                  </div>
                  <Badge variant="secondary">Quick</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Chat with us now</p>
                  </div>
                  <Badge variant="secondary">Online</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">24/7 Available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">9 AM - 11 PM Daily</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Response</p>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Quick Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Start Live Chat
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Average response time: 2 minutes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}