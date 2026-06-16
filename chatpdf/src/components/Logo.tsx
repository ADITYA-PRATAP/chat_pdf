import { FileText } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = ({ href = "/" }: { href?: string }) => {
  return (
    <Link href={href} className="group inline-flex items-center gap-2">
      <span className="bg-brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <FileText className="h-[1.1rem] w-[1.1rem]" />
      </span>
      <span className="font-display text-xl leading-none tracking-tight">
        PaperChat
      </span>
    </Link>
  );
};

export default Logo;
