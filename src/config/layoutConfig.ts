// src/config/layoutConfig.ts

import { Users, Settings, HomeIcon } from "lucide-react";
import { NavItem, UserMenuItem, LayoutConfig } from "@/types/genericView"; // 

export const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: HomeIcon },
    { label: "Users", href: "/users", icon: Users },
    { label: "Settings", href: "/settings", icon: Settings },
    // Add more navigation items as needed
];

export const userMenuItems: UserMenuItem[] = [
    { label: "Profile", onClick: () => console.log("Profile clicked") },
    { label: "Logout", onClick: () => console.log("Logout clicked") },
    // Add more user menu items as needed
];

export const layoutConfig: LayoutConfig = {
    siteName: "MySingle",
    logo: "/logo.svg", // Path to your logo image
    navItems,
    userMenuItems,
    // font: inter, // Optional: Add custom font if needed
};

export default layoutConfig;
