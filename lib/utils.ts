import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function transformStringToNumber(str: string) {
  const output = parseInt(str, 10)
  return isNaN(output) ? 0 : output
}
