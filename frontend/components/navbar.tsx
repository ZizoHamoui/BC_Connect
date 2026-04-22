"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, LogOut, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Wordmark } from "./wordmark";
import { SearchBar } from "./search-bar";
import { BcAvatar } from "./bc-avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const publicNavLinks = [
  { label: "Home", href: "/", desc: "Home page" },
  { label: "Jobs", href: "/#jobs", desc: "Open roles across BC" },
];

const authNavLinks = [
  { label: "Directory", href: "/directory", desc: "Browse all BC startups" },
];

const adminNavLinks = [
  { label: "Admin", href: "/admin", desc: "Admin dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-[1200px] mx-auto flex items-center justify-between px-12 h-16 max-[960px]:px-6">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            aria-label="BC Connect Home"
            className="group lattice-hover focus-ring rounded-sm"
          >
            <Wordmark size="nav" />
          </Link>

          <NavigationMenu viewport={false} className="max-[960px]:hidden">
            <NavigationMenuList className="gap-0.5">
              {[
                ...publicNavLinks,
                ...(user ? authNavLinks : []),
                ...(user?.role === "admin" ? adminNavLinks : []),
              ].map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <NavigationMenuItem key={link.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            data-active={isActive}
                            className={cn(
                              "nav-underline focus-ring relative inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-[var(--r-sm)] bg-transparent",
                              "transition-colors duration-150",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        {link.desc}
                      </TooltipContent>
                    </Tooltip>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-3">
          <div className="max-[960px]:hidden">
            <SearchBar variant="nav" placeholder="Search..." />
          </div>
          {user && (
            <Link
              href="/directory?list=true"
              className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[13px] font-medium px-4 py-2 rounded-full bg-foreground text-background hover:bg-ink-700 shadow-[var(--shadow-xs)] max-[960px]:hidden"
            >
              {user.role === "admin" ? "Add a Listing" : "List Your Startup"}
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="focus-ring rounded-full"
                  aria-label="Account menu"
                >
                  <BcAvatar
                    initials={user.username.slice(0, 2).toUpperCase()}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  {user.email && (
                    <p className="text-xs text-muted-foreground mt-0.5 pl-[22px]">
                      {user.email}
                    </p>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5 mr-2" />
                    Saved & Recommendations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth"
              className={cn(
                "btn-press focus-ring inline-flex items-center justify-center",
                "font-sans text-[13px] font-medium px-4 py-2 rounded-full",
                "border border-[var(--mist)] bg-white text-foreground",
                "hover:bg-[var(--off-white)] hover:border-[var(--fog)]",
                "transition-all duration-150",
              )}
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
