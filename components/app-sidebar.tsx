"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import LanguageTranslationComponent from "./language";
import { ThemeSwitcher } from "./themeswitch";
import { DyslexiaFontToggle } from "./dyslexia-font-toggle";
import { useUser } from "@/lib/UserContext"; // 🔥 import the hook

const data = {
  teams: [
    {
      name: "Synapse",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "🦜 Chat Buddy", url: "/dashboard/voice" },
        { title: "🧩 Fun World", url: "/dashboard/games" },
        { title: "🏆 Rewards", url: "/dashboard/reward" },
        { title: "🧘 Meditation Hall", url: "/dashboard/panchayat" },
        { title: "📑 Resource", url: "/dashboard/resource" },


        { title: "😺 My Corner", url: "profile" },
        // { title: "Files", url: "files" },
        // { title: "Feedback", url: "feedback" },
      ],
    },
    {
      title: "Parent",
      url: "",
      icon: User,
      items: [
        { title: "Monitor", url: "/dashboard/parent" },
        
        
      ],
    },
    {
      title: "Therapist",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Monitor EEG", url: "/dashboard/theraphist" },
        
        { title: "MentorShip", url: "/dashboard/panchayat" },
        { title: "Appoint", url: "/dashboard/appoinments" },

        // { title: "Changelog", url: "#" },
      ],
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     { title: "General", url: "#" },
    //     { title: "Team", url: "#" },
    //     { title: "Billing", url: "#" },
    //     { title: "Limits", url: "#" },
    //   ],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser(); // 🔥 get logged in user
  console.log(user)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <ThemeSwitcher />
        <DyslexiaFontToggle />
      </SidebarContent>
      <SidebarFooter>
        <LanguageTranslationComponent />
        <NavUser
          user={{
            name: user?.user_metadata?.full_name || user?.email || "Guest",
            email: user?.email || "",
            avatar: user?.user_metadata.avatar_url,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
