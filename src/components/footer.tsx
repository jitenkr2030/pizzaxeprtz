"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Menu
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/careers" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
            </div>
          </div>

          {/* Customer Service Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Customer Service</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link href="/track" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Track Order
              </Link>
              <Link href="/returns" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Returns
              </Link>
              <Link href="/faq" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📞 +1 (555) 123-4567</p>
              <p>📧 info@pizzaxpertz.com</p>
              <p>📍 123 Pizza Street, Food City, FC 12345</p>
              <p>🕒 Open: 11:00 AM - 11:00 PM</p>
            </div>
          </div>

          {/* Social Media & Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Follow Us</h3>
            <div className="space-y-2">
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Facebook</span>
                  📘
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Twitter</span>
                  🐦
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Instagram</span>
                  📷
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">YouTube</span>
                  📺
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Stay connected for latest offers and updates!
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 PizzaXpertz. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}