"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { updateMoney } from "@/app/(protected)/services/moneySmart/api";
import TextEditor from "./SunEditor";

import { FileWithPreview } from "../../../components/ImageUpload";
interface TableRow {
  id: string;
  imageUrl?: string;
  [key: string]: any;
}

interface EditModalProps {
  id: string | null;
  onClose: () => void;
  tableData: TableRow[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

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

  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 356, height: 180 };
  const dimensions = {
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  };

  // Find the row data based on the id
  useEffect(() => {
    if (id && tableData) {
      const foundRow = tableData.find((row) => row.id === id) || null;
      setSelectedRow(foundRow);
      setEditedData(foundRow || {});

      if (foundRow?.offerImage?.mobile) {
        setMobileFile({
          preview: foundRow.offerImage.mobile,
        } as FileWithPreview);
      }
      if (foundRow?.offerImage?.web) {
        setWebFile({ preview: foundRow.offerImage.web } as FileWithPreview);
      }
    }
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/Others/home-section/money-smart");
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
  const type = "money";
  const handleUpdate = async () => {
    if (!id) return;

    const result = await updateMoney(
      id,
      type,
      dimensions,
      editedData,
      mobileFile?.file,
      webFile?.file,
      mobileFile?.preview,
      webFile?.preview
    );

    if (result?.success) {
      refreshData();
      handleClose();
      toast.success("MoneySmart updated successfully!");
    } else {
      toast.error(result?.message || "An error occurred.");
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
              "isHome",
              "brandLogo",
              "brandName",
              "category",
              "offerBanner",
              "deletionDate",
              "buttonType",
            ].includes(key) ? (
              <div key={key}>
                <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    {key === "offerImage" ? "" : key}
                  </label>
              
                </div>

                {/* Handle Nested `offerImage` Object */}
                {key === "offerImage" &&
                typeof selectedRow[key] === "object" ? (
                  <div className="space-y-3">
                    {/* Web Image */}
                    <div>
                      <label className="block text-sm font-medium">Web  ( {Web_DIMENSIONS.width} x {Web_DIMENSIONS.height} )</label>
                      <ImageUpload
                        files={webFile ? [webFile] : []}
                        setFiles={(files: FileWithPreview[]) =>
                          setWebFile(files[0] || null)
                        }
                        label="Web"
                      />
                    </div>

                    {/* Mobile Image */}
                    <div>
                      <label className="block text-sm font-medium">
                        Mobile ( {Mobile_DIMENSIONS.width} x {Mobile_DIMENSIONS.height} )
                      </label>
                      <ImageUpload
                        files={mobileFile ? [mobileFile] : []}
                        setFiles={(files: FileWithPreview[]) =>
                          setMobileFile(files[0] || null)
                        }
                        label="Mobile"
                      />
                    </div>
                  </div>
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
