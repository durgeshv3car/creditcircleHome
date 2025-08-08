"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usePathname } from "@/components/navigation";
import { getMenuList } from "@/lib/menus";

export default function PermissionPage({
  role,
  permissions,
  data,
  setIsOpen,
  selectedPermissions,
  setSelectedPermissions,
}: {
  role: string;
  permissions: string[];
  data?: { permissions: string[] } | null;
  setIsOpen: (value: boolean) => void;
  selectedPermissions: string[];
  setSelectedPermissions: (value: string[]) => void;
}) {
  const [allPermissions, setAllPermissions] = useState<string[]>([]);


  const pathname = usePathname();

  // Memoize the menu list to prevent infinite loops
  const menuList = useMemo(() => {
    return getMenuList(pathname, role, permissions);
  }, [pathname, role, permissions]);

  // Extract all submenu labels once
useEffect(() => {
  const allSubmenus: string[] = [];
  menuList.forEach((menuGroup) => {
    menuGroup.menus.forEach((menu) => {
      menu.submenus.forEach((submenu) => {
        allSubmenus.push(submenu.label);
      });
    });
  });
  setAllPermissions(allSubmenus);
}, [menuList]);


  // Initialize selected permissions from data if available
  useEffect(() => {
  if (data && data.permissions && Array.isArray(data.permissions)) {
    setSelectedPermissions(data.permissions);
  }
}, []); 


  const handleCheckboxChange = (perm: string) => {
    setSelectedPermissions(
      selectedPermissions.includes(perm)
        ? selectedPermissions.filter((p) => p !== perm)
        : [...selectedPermissions, perm]
    );
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelectAll = () => {
    if (selectedPermissions.length === allPermissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(allPermissions);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {selectedPermissions.length === allPermissions.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleClose}>
          Close
        </Button>
      </div>

      {menuList.map((menuGroup) => (
        <div key={menuGroup.id} className="mt-4">
          {menuGroup.menus.map((menu) => {
            if (menu.submenus.length === 0) return null;

            return (
              <div key={menu.id} className="mb-4">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  {menu.label}
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  {menu.submenus.map((submenu) => (
                    <div
                      key={submenu.label}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={submenu.label}
                        checked={selectedPermissions.includes(submenu.label)}
                        onCheckedChange={() =>
                          handleCheckboxChange(submenu.label)
                        }
                      />
                      <Label htmlFor={submenu.label}>{submenu.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}