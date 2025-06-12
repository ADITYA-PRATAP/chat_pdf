// utils.ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}


export function convertToAscii(str: string): string {
  const asciiString = str.replace(/[^\x00-\x7F]+/g, ""); 
  return  asciiString;
}