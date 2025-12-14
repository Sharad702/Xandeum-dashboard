/**
 * Frontend Utility Functions
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number | null | undefined, decimals: number = 2): string {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatNumber(num: number | null | undefined, decimals: number = 2): string {
  if (num === null || num === undefined) return '0';
  if (num < 1000) return num.toFixed(decimals);
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
  if (tier === 0) return num.toFixed(decimals);
  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  return (num / scale).toFixed(decimals) + suffix;
}

export function formatPercentage(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
}

export function shortenPubkey(pubkey: string | null | undefined, chars: number = 4): string {
  if (!pubkey) return 'Unknown';
  if (pubkey.length <= chars * 2 + 3) return pubkey;
  return `${pubkey.slice(0, chars)}...${pubkey.slice(-chars)}`;
}

export function formatUptime(seconds: number | null | undefined): string {
  if (!seconds) return '0s';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function getStatusColor(status: 'online' | 'offline' | 'syncing'): string {
  switch (status) {
    case 'online': return 'text-aurora-500';
    case 'offline': return 'text-red-500';
    case 'syncing': return 'text-ember-500';
    default: return 'text-gray-500';
  }
}

export function getStatusBgColor(status: 'online' | 'offline' | 'syncing'): string {
  switch (status) {
    case 'online': return 'bg-aurora-500/20 border-aurora-500/30';
    case 'offline': return 'bg-red-500/20 border-red-500/30';
    case 'syncing': return 'bg-ember-500/20 border-ember-500/30';
    default: return 'bg-gray-500/20 border-gray-500/30';
  }
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

