import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, Award, MapPin } from "lucide-react"

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground">
            Be part of something amazing. Build your career with Pizzaxperts!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>50+ Employees</CardTitle>
              <CardDescription>Growing team</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>Open Positions</CardTitle>
              <CardDescription>Multiple roles available</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Award className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>Great Benefits</CardTitle>
              <CardDescription>Competitive package</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Work With Us?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">Growth</Badge>
                  <div>
                    <h4 className="font-medium">Career Development</h4>
                    <p className="text-sm text-muted-foreground">
                      Continuous learning opportunities and career advancement paths
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">Culture</Badge>
                  <div>
                    <h4 className="font-medium">Amazing Culture</h4>
                    <p className="text-sm text-muted-foreground">
                      Friendly, inclusive, and collaborative work environment
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">Benefits</Badge>
                  <div>
                    <h4 className="font-medium">Great Benefits</h4>
                    <p className="text-sm text-muted-foreground">
                      Health insurance, paid time off, and employee discounts
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">Impact</Badge>
                  <div>
                    <h4 className="font-medium">Make a Difference</h4>
                    <p className="text-sm text-muted-foreground">
                      Be part of a team that brings joy to customers every day
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Openings</CardTitle>
            <CardDescription>
              Explore our current job opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-medium">Pizza Chef</h4>
                  <p className="text-sm text-muted-foreground">Full-time • Kitchen</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Main Location</span>
                  </div>
                </div>
                <Button>Apply Now</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-medium">Delivery Driver</h4>
                  <p className="text-sm text-muted-foreground">Part-time • Operations</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Multiple Locations</span>
                  </div>
                </div>
                <Button>Apply Now</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-medium">Customer Service Representative</h4>
                  <p className="text-sm text-muted-foreground">Full-time • Support</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Remote/Hybrid</span>
                  </div>
                </div>
                <Button>Apply Now</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-medium">Restaurant Manager</h4>
                  <p className="text-sm text-muted-foreground">Full-time • Management</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Main Location</span>
                  </div>
                </div>
                <Button>Apply Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Apply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Send Your Resume</h4>
                  <p className="text-sm text-muted-foreground">
                    Email your resume and cover letter to careers@pizzaxperts.com
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Initial Screening</h4>
                  <p className="text-sm text-muted-foreground">
                    Our HR team will review your application and contact you if you're a good fit
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Interview Process</h4>
                  <p className="text-sm text-muted-foreground">
                    Meet with our team and showcase your skills and experience
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Join Our Team</h4>
                  <p className="text-sm text-muted-foreground">
                    Welcome to Pizzaxperts! Start your amazing journey with us
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}