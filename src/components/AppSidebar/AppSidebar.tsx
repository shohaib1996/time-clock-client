"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useUser from "@/hooks/use-user";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { useRouter } from "next/navigation";

// ✅ Example menu sets for roles
const adminItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Employees", url: "/admin/employees", icon: Users },
  { title: "Payment", url: "/admin/payment", icon: DollarSign },
];

const userItems = [
  { title: "Dashboard", url: "/employee", icon: Home },
  // { title: "My Payments", url: "/user/payments", icon: DollarSign },
];

export function AppSidebar() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  const isAdmin = user?.role === "admin";
  const items = isAdmin ? adminItems : userItems;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "US";
  const handleLogout = () => {
  try {
 
    localStorage.removeItem("user");
    router.push("/login")
  } catch (error) {
    console.error("Error during logout:", error);
  }
};


  return (
    <Sidebar>
      {/* HEADER */}
      <SidebarHeader>
        <Link href="/" className="text-2xl p-3 font-semibold">
          StevenClock
        </Link>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="flex items-center justify-between p-3 border-t">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground font-semibold">
            {initials}
          </div>
          {/* Name */}
          <div className="text-sm font-medium">{user?.name || "User"}</div>
          {/* Settings Popover */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-56 p-4 shadow-lg border rounded-xl"
            >
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">{user?.name || "User Name"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || "user@email.com"}
                  </p>
                </div>

                {/* Theme toggler */}
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm font-medium">Theme</span>
                 <AnimatedThemeToggler className="text-sm cursor-pointer"/>
                </div>

                {/* Logout */}
                <Button
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    handleLogout()
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
