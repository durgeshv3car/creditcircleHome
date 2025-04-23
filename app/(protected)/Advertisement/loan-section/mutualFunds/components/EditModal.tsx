"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { updateService } from "@/app/(protected)/services/ourServices/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import TextEditor from "../components/SunEditor";

interface FileWithPreview extends File {
  preview: string;
  file?: File; // Added file property
}

interface TableRow {
  id: string;
  name?: string;
  imageUrl?: string;
  [key: string]: any;
  type?:string
}

interface EditModalProps {
  id: string | null;
  onClose: () => void;
  tableData: TableRow[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  type: string |null;
}

const EditModal: React.FC<EditModalProps> = ({
  id,
  onClose,
  tableData,
  setRefresh,
  type
}) => {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Partial<TableRow>>({});
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [mobileFile, setMobileFile] = useState<FileWithPreview | null>(null);
  const [webFile, setWebFile] = useState<FileWithPreview | null>(null);
  const [brandWebFile, setBrandWebFile] = useState<FileWithPreview | null>(
    null
  );
  const [brandMobileFile, setBrandMobileFile] =
    useState<FileWithPreview | null>(null);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category")
      .then((response) => {
        console.log(response, "category");
        setCategories(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setCategories([]);
        } else {
          console.error("Error fetching categories:", error);
        }
      });
  }, []); // Fixed dependency array to avoid infinite re-fetching

  // Find the row data based on the id
  useEffect(() => {
    if (id && tableData) {
      const foundRow = tableData.find((row) => row.id === id) || null;
      setSelectedRow(foundRow);
      setEditedData(foundRow || {});
    }
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/service/loan-section/mutulalFunds");
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
 
  const handleUpdate = async () => {
    if (!id) return;

    const result = await updateService(
      id,
      type,
      editedData,
      mobileFile?.file,
      webFile?.file
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
                <label className="block text-sm font-medium">
                  {key === "offerImage" || key === "brandLogo" ? "" : key}
                </label>

                {key.toLowerCase() === "mobileurl" ? (
                  <ImageUpload
                    files={mobileFile ? [mobileFile] : []}
                    setFiles={(files) => setMobileFile(files[0] || null)}
                  />
                ) : key.toLowerCase() === "weburl" ? (
                  <ImageUpload
                    files={webFile ? [webFile] : []}
                    setFiles={(files) => setWebFile(files[0] || null)}
                  />
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
                ) : key === "active" ? (
                  <Switch
                    checked={Boolean(editedData[key])}
                    onCheckedChange={(value) =>
                      setEditedData((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                ) : key === "description" ? (
                  <TextEditor
                    value={editedData.description || ""}
                    onChange={(value: string) =>
                      setEditedData((prev) => ({
                        ...prev,
                        description: value,
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
