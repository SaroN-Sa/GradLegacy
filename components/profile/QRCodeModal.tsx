"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { X, Download, Copy, Check } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  url: string;
}

export default function QRCodeModal({ open, onClose, url }: Props) {
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const overlayRef        = useRef<HTMLDivElement>(null);
  const [copied, setCopied]   = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  // Generate QR code whenever modal opens or URL changes
  // NOTE: colors are intentionally fixed (not theme-aware) — QR codes need
  // strong, reliable contrast to scan correctly regardless of site theme.
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    setQrError(null);

    QRCode.toCanvas(canvasRef.current, url, {
      width: 220,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    }).catch((err) => {
      console.error("QR generation failed:", err);
      setQrError("Failed to generate QR code.");
    });
  }, [open, url]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Close on backdrop click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "gradlegacy-qr.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard without HTTPS
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      {/* Card — consistent with dashboard design system.
          w-full + max-w keeps it from overflowing very narrow phones (<340px),
          while capping out at the original 340px on larger screens. */}
      <div className="relative w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">

        {/* Card top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0f172a] to-[#1e3a5f]" />

        <div className="px-5 py-5 sm:px-7 sm:py-6">

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-white transition-colors sm:top-5 sm:right-5"
          >
            <X size={16} />
          </button>

          {/* Heading */}
          <div className="mb-4 pr-8 sm:mb-5">
            <div className="inline-flex items-center gap-1.5 bg-[#0f172a] px-3 py-1 rounded-full text-[10px] font-bold text-yellow-400 mb-3 tracking-[0.15em] uppercase">
              QR Code
            </div>
            <h2
              id="qr-modal-title"
              className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-xl"
            >
              Scan to Visit
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
              Share your graduation page with a scan.
            </p>
          </div>

          {/* QR canvas — centered in a padded navy container (fixed, not themed).
              The canvas itself renders at a fixed 220px (set in QRCode.toCanvas)
              for scan reliability; on very narrow screens it can scroll within
              the card rather than overflow the viewport. */}
          <div className="flex items-center justify-center overflow-x-auto rounded-2xl bg-[#0f172a] p-3 mb-4 sm:p-4">
            {qrError ? (
              <div className="w-[220px] h-[220px] flex items-center justify-center text-red-400 text-xs text-center px-4">
                {qrError}
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="rounded-xl"
                aria-label="QR code for your graduation page"
              />
            )}
          </div>

          {/* URL display */}
          <div className="bg-gray-50 dark:bg-slate-800/60 rounded-xl px-3 py-2 mb-5 border border-gray-100 dark:border-slate-700">
            <p className="text-[11px] text-gray-500 dark:text-slate-400 font-mono break-all leading-relaxed text-center">
              {url}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                copied
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-400 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
            >
              {copied ? (
                <>
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={15} />
                  Copy Link
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={!!qrError}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] hover:from-[#1a2a4a] hover:to-[#0f172a] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={15} />
              Save PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}