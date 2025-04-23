"use client";

import { useDropzone } from "react-dropzone";
import { CloudUpload } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";

interface FileWithPreview {
  file: File;
  preview: string;
}

interface ImageUploadProps {
  files: FileWithPreview[];
  setFiles: (files: FileWithPreview[]) => void;
}

const ImageUpload = ({ files, setFiles }: ImageUploadProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      const mappedFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setFiles(mappedFiles);
    },
  });

  // Cleanup Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      files?.forEach((fileObj) => URL.revokeObjectURL(fileObj.preview));
    };
  }, [files]);

  const closeTheFile = () => {
    files?.forEach((fileObj) => URL.revokeObjectURL(fileObj.preview));
    setFiles([]);
  };

  return (
    <div className={files.length ? "h-[150px] w-full" : ""}>
      {files.length ? (
        <div className="w-full h-full relative">
          <Button
            type="button"
            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-default-900 hover:bg-background hover:text-default-900 z-20"
            onClick={closeTheFile}
          >
            <span className="text-xs">
              <Icon icon="fa6-solid:xmark" />
            </span>
          </Button>
          <Image
            key={files[0].file.name}
            alt={files[0].file.name}
            width={250}
            height={150}
            className="w-full h-full object-cover rounded-md"
            src={files[0].preview}
            priority={false}
          />
        </div>
      ) : (
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className="w-full text-center border-dashed border border-default-200 dark:border-default-300 rounded-md py-[20px] flex items-center flex-col">
            <CloudUpload className="text-default-300 w-6 h-6" />
            <h4 className="text-sm font-medium mb-1 mt-1 text-card-foreground/80">
              Drop or click to upload.
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;