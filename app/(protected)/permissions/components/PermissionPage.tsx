"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usePathname } from "@/components/navigation";
import { getMenuList } from "@/lib/menus";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { updateUser } from "../../services/adminUsers/api";

export default function PermissionPage({
  role,
  permissions,
}: {
  role: string;
  permissions: string[];
}) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams?.get("id") || "";
  const update = searchParams?.get("update") || "";

  // ✅ Memoize the menu list to prevent infinite loops
  const menuList = useMemo(() => {
    return getMenuList(pathname, role, permissions);
  }, [pathname, role, permissions]);

  // ✅ Extract all submenu labels once
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

  const handleCheckboxChange = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleClose = () => {
    
    if (update) {
      router.push("/Admin/admin-section/user-management", { scroll: false });
    } else {
      router.push("/dashboard", { scroll: false });
    }
  };


  const handleSubmit = async () => {
  const res = await updateUser(leadId, undefined, undefined, undefined, selectedPermissions);
  if (res.success) {
    toast.success("Permission updated successfully");
    router.push("/dashboard", { scroll: false });
  } else {
    console.error("Failed to update permissions", res.data);
  }
};


  const handleSelectAll = () => {
    if (selectedPermissions.length === allPermissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(allPermissions);
    }
  };

  if (!leadId) {
    router.push("/dashboard");
  }

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
                <div className="grid grid-cols-6 gap-3">
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

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={selectedPermissions.length === 0}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
