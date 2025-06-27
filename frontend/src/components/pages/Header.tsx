"use client"

import { useTheme } from "next-themes"
import { Sun, Moon, Clipboard, ArrowUpRight, Stethoscope, Venus, Mars } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import * as React from "react"
import { useHealthStore } from "@/store"
import handleSubmit from "@/api"
export function Header() {
  const { theme, setTheme } = useTheme()
  const { factors, setFactor } = useHealthStore()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  const submitForm = async () => {
    try {
      const data = await handleSubmit(factors) // ✅ Pass from component
      console.log("Response:", data)
    } catch (error) {
      console.error("Submit failed:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-950/80 dark:border-gray-800">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
            ProHealth
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Gender Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {factors["Gender"] === 1 ? (
                  <>
                    <Mars className="w-4 h-4 text-blue-500" />
                    <span className="capitalize">{"Male"}</span>
                  </>
                ) : (
                  <>
                    <Venus className="w-4 h-4 text-pink-500" />
                    <span className="capitalize">{"Female"}</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFactor('Gender', parseInt("1"))}>
                <Mars className="mr-2 h-4 w-4 text-blue-500" />
                <span>Male</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFactor('Gender', parseInt("2"))}>
                <Venus className="mr-2 h-4 w-4 text-pink-500" />
                <span>Female</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button onClick={toggleTheme} variant="ghost" size="sm" className="rounded-full">
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarImage src="https://avatars.githubusercontent.com/u/153743215?v=4" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>


      {/* Main Header */}
      <div className="px-6 py-6 border-t dark:border-gray-800">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Patient Overview</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Comprehensive health analytics dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
              onClick={submitForm}
            >
              Analyze
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}