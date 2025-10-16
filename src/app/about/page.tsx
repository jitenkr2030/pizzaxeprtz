import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Award, Clock } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About BoGoPizza</h1>
          <p className="text-xl text-muted-foreground">
            Bringing authentic flavors to your doorstep since 2020
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                BoGoPizza started with a simple mission: to deliver the most authentic and delicious 
                pizzas to food lovers everywhere. What began as a small family business has grown into 
                a beloved destination for pizza enthusiasts seeking quality, taste, and convenience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Our Promise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We promise to use only the finest ingredients, maintain the highest standards of 
                food safety, and deliver exceptional customer service. Every pizza is crafted with 
                love and attention to detail, ensuring a memorable dining experience every time.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>50,000+</CardTitle>
              <CardDescription>Happy Customers</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>30 min</CardTitle>
              <CardDescription>Average Delivery Time</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Star className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>4.8/5</CardTitle>
              <CardDescription>Customer Rating</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="secondary">Quality First</Badge>
                <p className="text-sm text-muted-foreground">
                  We never compromise on ingredient quality or taste
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary">Customer Focus</Badge>
                <p className="text-sm text-muted-foreground">
                  Your satisfaction is our top priority
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary">Innovation</Badge>
                <p className="text-sm text-muted-foreground">
                  Constantly creating new flavors and experiences
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary">Community</Badge>
                <p className="text-sm text-muted-foreground">
                  Supporting local communities and sustainable practices
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}