import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Clock, Truck, CreditCard, HelpCircle } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our services and policies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Delivery Time</CardTitle>
              <CardDescription>Average 30 minutes</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Truck className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Delivery Area</CardTitle>
              <CardDescription>10 km radius</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Payment Options</CardTitle>
              <CardDescription>Multiple methods</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <HelpCircle className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">24/7 Support</CardTitle>
              <CardDescription>Always here to help</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>
              Browse through our most frequently asked questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="delivery">
                <AccordionTrigger>How long does delivery take?</AccordionTrigger>
                <AccordionContent>
                  Our average delivery time is 30 minutes from the time you place your order. 
                  However, delivery times may vary depending on your location, order size, 
                  and current demand. You can track your order in real-time using our tracking system.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="area">
                <AccordionTrigger>What areas do you deliver to?</AccordionTrigger>
                <AccordionContent>
                  We currently deliver within a 10 km radius of our main location. 
                  You can check if we deliver to your area by entering your postal code 
                  during the checkout process. We're constantly expanding our delivery zones!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment">
                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                <AccordionContent>
                  We accept various payment methods including:
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Credit Cards</Badge>
                    <Badge variant="secondary">Debit Cards</Badge>
                    <Badge variant="secondary">UPI</Badge>
                    <Badge variant="secondary">Net Banking</Badge>
                    <Badge variant="secondary">Digital Wallets</Badge>
                    <Badge variant="secondary">Cash on Delivery</Badge>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="minimum">
                <AccordionTrigger>Is there a minimum order value?</AccordionTrigger>
                <AccordionContent>
                  Yes, we have a minimum order value of $15 for delivery. 
                  For pickup orders, there's no minimum order value. 
                  Delivery fees may apply based on your location and order size.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cancel">
                <AccordionTrigger>Can I cancel my order?</AccordionTrigger>
                <AccordionContent>
                  You can cancel your order within 5 minutes of placing it. 
                  After that, cancellation depends on whether the order has 
                  already been prepared. Contact our customer support immediately 
                  if you need to cancel an order.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="allergies">
                <AccordionTrigger>Do you accommodate food allergies?</AccordionTrigger>
                <AccordionContent>
                  We take food allergies very seriously. While we cannot guarantee 
                  100% allergen-free environments due to shared kitchen spaces, 
                  we can prepare your order with special precautions. Please mention 
                  any allergies in the order notes, and our team will take extra care.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="returns">
                <AccordionTrigger>What is your return policy?</AccordionTrigger>
                <AccordionContent>
                  If you're not satisfied with your order, please contact us within 
                  30 minutes of delivery. We'll either replace the item or issue a 
                  refund, depending on the situation. Customer satisfaction is our top priority!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tracking">
                <AccordionTrigger>How can I track my order?</AccordionTrigger>
                <AccordionContent>
                  Once your order is confirmed, you'll receive a tracking link via SMS and email. 
                  You can also track your order by visiting our website and entering your 
                  order number and phone number in the tracking section.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Still have questions?</CardTitle>
            <CardDescription>
              Can't find the answer you're looking for? Our support team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="font-medium">📞 Call Us</p>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div className="flex-1">
                <p className="font-medium">📧 Email Us</p>
                <p className="text-muted-foreground">support@pizzaxperts.com</p>
              </div>
              <div className="flex-1">
                <p className="font-medium">💬 Live Chat</p>
                <p className="text-muted-foreground">Available on our website</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}