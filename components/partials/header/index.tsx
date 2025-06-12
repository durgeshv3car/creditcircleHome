

import React from "react";
import HeaderContent from "./header-content";
import ProfileInfo from "./profile-info";
import ThemeSwitcher from "./theme-switcher";
import { SidebarToggle } from "@/components/partials/sidebar/sidebar-toggle";
import { SheetMenu } from "@/components/partials/sidebar/menu/sheet-menu";
import HeaderLogo from "./header-logo";
import { auth } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import HeaderGreet from "./header-greet";
interface DecodedToken {
  name: string;
  
}


const DashCodeHeader = async() => {

   const session = await auth();
    let name = "";
  
    if (session?.user && 'token' in session.user) {
      const decoded = jwtDecode<DecodedToken>((session.user as { token: string }).token);
      
      name = decoded.name;
    }

  return (
    <HeaderContent>
      <div className="flex gap-3 items-center">
        <HeaderLogo />
        <SidebarToggle />
        <HeaderGreet admin={name} />
       
      </div>
      <div className="nav-tools flex items-center md:gap-4 gap-3">
        <ThemeSwitcher />
        <ProfileInfo />
        <SheetMenu />
      </div>
    </HeaderContent>
  );
};

export default DashCodeHeader;
