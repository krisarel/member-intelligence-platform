"use client";

import * as React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  MessageSquare, 
  UserCircle, 
  Settings, 
  LogOut,
  Calendar,
  ShieldCheck
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Members", url: "/members", icon: Users },
    { title: "Jobs", url: "/jobs", icon: Briefcase },
    { title: "Introductions", url: "/introductions", icon: MessageSquare },
    { title: "Events", url: "/events", icon: Calendar },
  ];

  const secondaryItems = [
    { title: "My Profile", url: "/profile", icon: UserCircle },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  if (!currentUser) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground overflow-hidden">
                 {/* Placeholder for WiW3CH Logo - Using a styled text representation for now */}
                 <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white font-bold text-[10px] leading-none">
                   W3
                 </div>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">WiW3CH Connect</span>
                <span className="truncate text-xs" title="The member intelligence & opportunity platform for Women in Web3 Switzerland">
                  Member Intelligence Platform
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    onClick={() => router.push(item.url)}
                  >
                    <button>
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Admin Link - Only visible for Admins */}
              {(currentUser.tier === 'Admin' || currentUser.tier === 'VIP') && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === '/admin'}
                    tooltip="Admin Dashboard"
                    onClick={() => router.push('/admin')}
                  >
                    <button>
                      <ShieldCheck />
                      <span>Admin</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    onClick={() => router.push(item.url)}
                  >
                    <button>
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.fullName} />
                    <AvatarFallback className="rounded-lg">{currentUser.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{currentUser.fullName}</span>
                    <span className="truncate text-xs">{currentUser.email}</span>
                  </div>
                  <LogOut className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
