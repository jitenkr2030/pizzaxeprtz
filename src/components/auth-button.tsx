"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, ShoppingCart, ChefHat, LogOut, LogIn, Settings, Menu } from "lucide-react"
import Link from "next/link"

interface AuthButtonProps {
  cartItemCount?: number
}

export function AuthButton({ cartItemCount = 0 }: AuthButtonProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse hidden sm:block" />
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/cart">
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Cart ({cartItemCount})</span>
            <span className="sm:hidden">({cartItemCount})</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full sm:h-10 sm:w-10">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                <AvatarFallback>
                  {session.user?.name?.charAt(0).toUpperCase() || <User className="h-3 w-3 sm:h-4 sm:w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {session.user?.name && (
                  <p className="font-medium">{session.user.name}</p>
                )}
                {session.user?.email && (
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            {session.user?.role === "ADMIN" || session.user?.role === "MANAGER" ? (
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <Link href="/cart">
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Cart ({cartItemCount})</span>
          <span className="sm:hidden">({cartItemCount})</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="sm:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => signIn()}>
            <LogIn className="mr-2 h-4 w-4" />
            <span>Sign In</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/auth/signup">
              <ChefHat className="mr-2 h-4 w-4" />
              <span>Sign Up</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden sm:flex items-center space-x-2">
        <Button onClick={() => signIn()} variant="outline" size="sm">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
        
        <Link href="/auth/signup">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            <ChefHat className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  )
}