"use client";

import { FileText, Loader2, UploadCloud } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { uploadToS3 } from "../lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "../lib/utils";

interface UploadData {
  file_key: string;
  file_name: string;
}

const FileUpload = () => {
  const [uploading, setUploading] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: UploadData) => {
      const response = await axios.post("/api/create-chat", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Your document is ready to chat!");
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
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File exceeds the 10 MB limit. Please upload a smaller file.");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);

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
    <div
      {...getRootProps({
        className: cn(
          "group relative flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/40 px-6 py-10 text-center transition-colors",
          isDragActive && "border-primary bg-accent",
          !isLoading && "hover:border-primary/60 hover:bg-accent/60",
          isLoading && "pointer-events-none opacity-80"
        ),
      })}
      aria-busy={isLoading}
    >
      <input {...getInputProps()} aria-label="Upload a PDF" />

      {isLoading ? (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card shadow-sm">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </span>
          <div>
            <p className="font-medium text-foreground">
              {uploading ? "Uploading your document…" : "Reading & indexing…"}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {uploading
                ? "Securely transferring your file."
                : "Teaching the AI about your PDF — almost there."}
            </p>
          </div>
          <div className="mt-1 h-1 w-40 overflow-hidden rounded-full bg-border">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </div>
        </>
      ) : (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card text-primary shadow-sm transition-transform group-hover:scale-105">
            {isDragActive ? (
              <FileText className="h-7 w-7" />
            ) : (
              <UploadCloud className="h-7 w-7" />
            )}
          </span>
          <div>
            <p className="font-medium text-foreground">
              {isDragActive ? "Drop to upload" : "Drag & drop your PDF here"}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              or{" "}
              <span className="font-medium text-primary underline-offset-4 group-hover:underline">
                browse your files
              </span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">PDF only · up to 10 MB</p>
        </>
      )}
    </div>
  );
};

export default FileUpload;
