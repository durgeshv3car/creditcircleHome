"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { updateOffer } from "@/app/(protected)/services/offers/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import TextEditor from "./SunEditor";

import type { FileWithPreview } from "../../../components/ImageUpload";
import { fetchCategories } from "@/app/(protected)/services/categorys/api";

interface TableRow {
  id: string;
  name?: string;
  imageUrl?: string;
  [key: string]: any;
}

interface EditModalProps {
  id: string | null;
  onClose: () => void;
  tableData: TableRow[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
type Category = {
  id: string;
  title: string;
};

const EditModal: React.FC<EditModalProps> = ({
  id,
  onClose,
  tableData,
  setRefresh,
}) => {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Partial<TableRow>>({});
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [mobileFile, setMobileFile] = useState<FileWithPreview | null>(null);
  const [webFile, setWebFile] = useState<FileWithPreview | null>(null);
  const [bannerFile, setBannerFile] = useState<FileWithPreview | null>(null);
  const [brandLogoFile, setBrandLogoFile] = useState<FileWithPreview | null>(
    null
  );

  const [categories, setCategories] = useState<Category[]>([]);

  const Logo_DIMENSIONS = { width: 150, height: 150 };
  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Banner_DIMENSIONS = { width: 356, height: 180 };
  const Mobile_DIMENSIONS = { width: 150, height: 280 };
   const dimensions={
    brandLogo: Logo_DIMENSIONS,
    web: Web_DIMENSIONS,
    banner: Banner_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  }

  const buttonsType = [
    { id: "apply_now", name: "Apply Now" },
    { id: "book_now", name: "Book Now" },
    { id: "download_app", name: "Download App" },
    { id: "sign_up", name: "Sign Up" },
    { id: "get_offer", name: "Get Offer" },
    { id: "get_quote", name: "Get Quote" },
    { id: "learn_more", name: "Learn More" },
    { id: "know_more", name: "Know More" },
    { id: "shop_now", name: "Shop Now" },
  ];

    const fetchData = async () => {
      try {
        const result = await fetchCategories();
        console.log("result", result.status);
  
        setCategories(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } 
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  // Find the row data based on the id
  useEffect(() => {
    if (id && tableData) {
      const foundRow = tableData.find((row) => row.id === id) || null;
      setSelectedRow(foundRow);
      setEditedData(foundRow || {});
      const mobileUrl = foundRow?.offerImage?.mobile;
      console.log(mobileUrl, "mobileUrl");
      if (foundRow?.offerImage?.mobile) {
        setMobileFile({
          preview: foundRow.offerImage.mobile,
        } as FileWithPreview);
      }
      if (foundRow?.offerImage?.web) {
        setWebFile({ preview: foundRow.offerImage.web } as FileWithPreview);
      }
      if (foundRow?.brandLogo?.logo) {
        setBrandLogoFile({
          preview: foundRow.brandLogo.logo,
        } as FileWithPreview);
      }
      if (foundRow?.offerBanner?.banner) {
        setBannerFile({
          preview: foundRow.offerBanner.banner,
        } as FileWithPreview);
      }
    }
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/Advertisement/home-section/offer");
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
  const type = "offer";
  const handleUpdate = async () => {
    if (!id) return;

    const result = await updateOffer(
      id,
      type,
      dimensions,
      editedData,
      mobileFile?.file,
      webFile?.file,
      bannerFile?.file,
      brandLogoFile?.file,
      mobileFile?.preview,
      webFile?.preview,
      bannerFile?.preview,
      brandLogoFile?.preview
    );

    if (result.success) {
      refreshData();
      handleClose();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  if (!selectedRow) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Right-Side Modal */}
      <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 translate-x-0 z-50 p-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Edit Row</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black"
          >
            ✖
          </button>
        </div>

        <div className="space-y-3">
          {Object.keys(selectedRow).map((key) =>
            ![
              "id",
              "action",
              "createdAt",
              "updatedAt",
              "type",
              "thumbnail",
              "userId",
            ].includes(key) ? (
              <div key={key}>
                {(key === "offerBanner" ||
                  key === "offerImage" ||
                  key === "brandLogo") ? null : (
                  <div className="flex items-center">
                    <label className="block text-sm font-medium">{key}</label>
                    {key === "banner" && (
                      <span className="text-xs text-gray-500 ml-2">
                        ( {Banner_DIMENSIONS.width} x {Banner_DIMENSIONS.height} )
                      </span>
                    )}
                    {key === "web" && (
                      <span className="text-xs text-gray-500 ml-2">
                        ( {Web_DIMENSIONS.width} x {Web_DIMENSIONS.height} )
                      </span>
                    )}
                    {key === "mobile" && (
                      <span className="text-xs text-gray-500 ml-2">
                        ( {Mobile_DIMENSIONS.width} x {Mobile_DIMENSIONS.height} )
                      </span>
                    )}
                    {key === "brand logo" && (
                      <span className="text-xs text-gray-500 ml-2">
                        ( {Logo_DIMENSIONS.width} x {Logo_DIMENSIONS.height} )
                      </span>
                    )}
                  </div>
                )}

                {key === "offerBanner" && typeof selectedRow[key] === "object" ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center">
                        <label className="block text-sm font-medium">Banner</label>
                        <span className="text-xs text-gray-500 ml-2">
                          ( {Banner_DIMENSIONS.width} x {Banner_DIMENSIONS.height} )
                        </span>
                      </div>
                      <ImageUpload
                        files={bannerFile ? [bannerFile] : []}
                        setFiles={(files: FileWithPreview[]) =>
                          setBannerFile(files[0] || null)
                        }
                      
                        label="Banner"
                      />
                    </div>
                  </div>
                ) : key === "offerImage" && typeof selectedRow[key] === "object" ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center">
                        <label className="block text-sm font-medium">Web</label>
                        <span className="text-xs text-gray-500 ml-2">
                          ( {Web_DIMENSIONS.width} x {Web_DIMENSIONS.height} )
                        </span>
                      </div>
                      <ImageUpload
                        files={webFile ? [webFile] : []}
                        setFiles={(files: FileWithPreview[]) =>
                          setWebFile(files[0] || null)
                        }
       
                        label="Web"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <label className="block text-sm font-medium">Mobile</label>
                        <span className="text-xs text-gray-500 ml-2">
                          ( {Mobile_DIMENSIONS.width} x {Mobile_DIMENSIONS.height} )
                        </span>
                      </div>
                      <ImageUpload
                        files={mobileFile ? [mobileFile] : []}
                        setFiles={(files: FileWithPreview[]) =>
                          setMobileFile(files[0] || null)
                        }
   
                        label="Mobile"
                      />
                    </div>
                  </div>
                ) : key === "brandLogo" && typeof selectedRow[key] === "object" ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center">
                        <label className="block text-sm font-medium">
                          Brand Logo
                        </label>
                        <span className="text-xs text-gray-500 ml-2">
                          ( {Logo_DIMENSIONS.width} x {Logo_DIMENSIONS.height} )
                        </span>
                      </div>
                      <ImageUpload
                        files={brandLogoFile ? [brandLogoFile] : []}
                        setFiles={(files: FileWithPreview[]) =>
                          setBrandLogoFile(files[0] || null)
                        }
                        label="Logo"
                      />
                    </div>
                  </div>
                ) : key === "category" ? (
                  /* Category Selection */
                  <Select
                    value={editedData[key] || ""}
                    onValueChange={(value) =>
                      setEditedData((prev) => ({ ...prev, [key]: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category " />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.title}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : key === "buttonType" ? (
                  <Select
                    value={editedData[key] || ""}
                    onValueChange={(value) =>
                      setEditedData((prev) => ({ ...prev, [key]: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Button" />
                    </SelectTrigger>
                    <SelectContent>
                      {buttonsType.map((button) => (
                        <SelectItem key={button.id} value={button.name}>
                          {button.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : key === "isHome" ? (
                  <Switch
                    checked={Boolean(editedData[key])}
                    onCheckedChange={(value) =>
                      setEditedData((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                ) : key === "isActive" ? (
                  <Switch
                    checked={Boolean(editedData[key])}
                    onCheckedChange={(value) =>
                      setEditedData((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                ) : key === "detailDescription" ? (
                  <TextEditor
                    value={editedData.detailDescription || ""}
                    onChange={(value: string) =>
                      setEditedData((prev) => ({
                        ...prev,
                        detailDescription: value,
                      }))
                    }
                  />
                ) : (
                  <Input
                    name={key}
                    value={editedData[key] || ""}
                    onChange={onInputChange}
                    className="w-full"
                  />
                )}
              </div>
            ) : null
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </div>
      </div>
    </>
  );
};

export default EditModal;
