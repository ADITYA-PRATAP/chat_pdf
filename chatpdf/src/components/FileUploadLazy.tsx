"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

/**
 * Code-splits FileUpload (and the heavy aws-sdk it pulls in) into its own
 * async chunk, keeping it out of the landing page's initial JS bundle.
 */
const FileUpload = dynamic(() => import("./FileUpload"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-52 items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

const FileUploadLazy = () => <FileUpload />;

export default FileUploadLazy;
