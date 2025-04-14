import React from "react";
import SidebarContent from "./sidebar-content";
import Logo from "@/components/logo";
import { Menu } from "./menu";
import { auth } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

const DashCodeSidebar = async () => {
  const session = await auth();
   let role = "";
  
    if (session?.user?.token) {
      const decoded = jwtDecode(session.user.token);
      role = decoded.role;
    }
  return (
    <SidebarContent>
      <Menu role={role} />
    </SidebarContent>
  );
};

export default DashCodeSidebar;
