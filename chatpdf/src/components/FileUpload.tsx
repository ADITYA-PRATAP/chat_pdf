"use client";

import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { uploadToS3 } from "../lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UploadData {
  file_key: string;
  file_name: string;
}

const FileUpload = () => {
  const [uploading, setUploading] = React.useState(false);
  const [processing, setProcessing] = React.useState(false); // <-- API loader
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: UploadData) => {
      const response = await axios.post("/api/create-chat", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("File uploaded successfully!");
      router.push(`/chat/${data.chat_id}`);
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
      toast.error("Failed to process file. Please try again.");
    },
    onSettled: () => {
      setProcessing(false);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: uploading || processing,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10 MB limit. Please upload a smaller file.");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        console.log("File uploaded to S3:", data);

        if (!data.file_key || !data.file_name) {
          toast.error("Failed to upload file. Please try again.");
          return;
        }

        setProcessing(true);
        mutation.mutate(data);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file. Please try again.");
      } finally {
        setUploading(false);
      }
    },
  });

  const isLoading = uploading || processing;

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "p-8 border-dashed border-2 rounded-xl flex items-center justify-center cursor-pointer bg-gray-50 py-8 flex-col" +
            (isLoading ? " opacity-50 pointer-events-none" : ""),
        })}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <>
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-500">
              {uploading
                ? "Uploading file to S3..."
                : "Spilling Tea to GPT..."}
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="text-sm text-gray-500">
              Drag and drop your files here, or click to select files
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
