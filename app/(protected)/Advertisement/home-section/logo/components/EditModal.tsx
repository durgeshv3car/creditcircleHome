"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { updateLogoImage } from "@/app/(protected)/services/logos/api";
import type { FileWithPreview } from "../../../components/ImageUpload";



interface TableRow {
  id: string;
  title?: string;
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

const Logo_DIMENSIONS = { width: 150*2, height: 150*2 };
  const WEB_DIMENSIONS = { width: 1920, height: 970 };
  const MOBILE_DIMENSIONS = { width: 150*2, height: 150*2 };
    const dimensions ={
    web: WEB_DIMENSIONS,
    mobile: MOBILE_DIMENSIONS,
  }

  // Find the row data based on the id
  useEffect(() => {
    if (id && tableData) {
      const foundRow = tableData.find((row) => row.id === id) || null;
      setSelectedRow(foundRow);
      setEditedData(foundRow || {});
     
    if (foundRow?.mobileUrl) {
      setMobileFile({ preview: foundRow.mobileUrl } as FileWithPreview);
    }
    if (foundRow?.webUrl) {
      setWebFile({ preview: foundRow.webUrl } as FileWithPreview);
    }
    }
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/Advertisement/home-section/logo", { scroll: false });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
  const type = "logo";
  const handleUpdate = async () => {
    if (!id) return;

    const result = await updateLogoImage(
      id,
      type,
      dimensions,
      editedData,
      mobileFile?.file,
      webFile?.file,
      mobileFile?.preview,
      webFile?.preview
    );

    if (result.success) {
      refreshData();
      handleClose();
      toast.success("Slider data updated");
    } else {
      toast.error("Slider data not updated");
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
              "webUrl",
              "createdAt",
              "updatedAt",
              "type",
              "thumbnail",
              "deletionDate"
            ].includes(key) ? (
              <div key={key}>
                   <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    {key === "mobileUrl" ? "Logo" : key}
                  </label>
                  {key.toLowerCase() === "mobileurl" && (
                    <span className="text-xs text-gray-500 ml-2">
                     ( {Logo_DIMENSIONS.width} x {Logo_DIMENSIONS.height} )
                    </span>
                  )}
                </div>
                {key.toLowerCase() === "mobileurl" ? (
                  <ImageUpload
                    files={mobileFile ? [mobileFile] : []}
                    setFiles={(files: FileWithPreview[]) =>
                      setMobileFile(files[0] || null)
                    }
                    label="Logo"
                  />
                )  : key.toLowerCase() === "active" ? (
                  <Switch
                    checked={Boolean(editedData[key])}
                    onCheckedChange={(value) =>
                      setEditedData((prev) => ({ ...prev, [key]: value }))
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
