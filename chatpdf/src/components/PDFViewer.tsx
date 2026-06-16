"use client";

import React from "react";
import {
  AlertTriangle,
  Download,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";

type Props = {
  pdf_url: string;
  pdf_name?: string;
};

const PDFViewer = ({ pdf_url, pdf_name }: Props) => {
  const [loading, setLoading] = React.useState(true);
  const [errored, setErrored] = React.useState(false);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate text-sm font-medium" title={pdf_name}>
            {pdf_name || "Document"}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <a
            href={pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            title="Open in new tab"
            aria-label="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={pdf_url}
            download
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            title="Download"
            aria-label="Download PDF"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Viewer */}
      <div className="relative min-h-0 flex-1 bg-muted/40">
        {loading && !errored && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted/40">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading document…</p>
          </div>
        )}

        {errored ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">Couldn&apos;t preview this document</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The preview failed to load. You can still open it directly.
              </p>
            </div>
            <a
              href={pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              Open PDF
            </a>
          </div>
        ) : (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              pdf_url
            )}&embedded=true`}
            title={pdf_name || "PDF document"}
            className="h-full w-full border-0"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setErrored(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
