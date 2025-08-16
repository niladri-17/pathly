import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  House,
  CalendarCheck,
  Wrench,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Niladri Basak",
    email: "niladri.basak.007@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Seeker Dashboard",
      logo: GalleryVerticalEnd,
      plan: "niladri.basak.007@gmail.com",
    },
    {
      name: "Creator Dashboard",
      logo: GalleryVerticalEnd,
      plan: "niladribasak",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "home",
      icon: House,
      isActive: true,
    },
    {
      title: "Bookings",
      url: "bookings",
      icon: CalendarCheck,
      isActive: true,
      items: [
        {
          title: "Pending",
          url: "bookings/pending",
        },
        {
          title: "Completed",
          url: "bookings/completed",
        },
      ],
    },
    {
      title: "services",
      url: "services",
      icon: Wrench,
      isActive: true,
      items: [
        {
          title: "1:1 call",
          url: "services/1-1-call",
        },
        {
          title: "Priority DM",
          url: "services/priority-dm",
        },
        {
          title: "Webinar",
          url: "services/webinar",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Customize Page",
      url: "#",
      icon: Map,
    },
    {
      name: "Analytics",
      url: "#",
      icon: Frame,
    },
    {
      name: "Testimonials",
      url: "#",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
