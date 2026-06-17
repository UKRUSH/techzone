"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Check, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

/**
 * Admin-only image upload button that sits inside a product card's image area.
 * Visible on hover (requires parent to have `group` class).
 *
 * Props:
 *   productId  – DB product ID (cuid string). Required to persist to DB.
 *   onUploaded – callback(url: string) called after successful upload.
 *   className  – extra classes for the button wrapper.
 */
export function ProductImageUpload({ productId, onUploaded, className = "" }) {
  const { data: session } = useSession();
  const fileRef = useRef(null);
  const [state, setState] = useState("idle"); // idle | uploading | done | error
  const [errMsg, setErrMsg] = useState("");

  // Only render for admin users
  if (session?.user?.role !== "ADMIN") return null;

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState("uploading");
    setErrMsg("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      if (productId) fd.append("productId", productId);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (res.ok && data.success) {
        setState("done");
        onUploaded?.(data.url);
        setTimeout(() => setState("idle"), 2500);
      } else {
        setErrMsg(data.error || "Upload failed");
        setState("error");
        setTimeout(() => setState("idle"), 3000);
      }
    } catch (err) {
      setErrMsg("Network error");
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    } finally {
      // Reset input so the same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fileRef.current?.click();
        }}
        disabled={state === "uploading"}
        title={state === "error" ? errMsg : "Upload product image"}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-lg
          transition-all duration-200 select-none
          ${state === "done"
            ? "bg-green-500 text-white"
            : state === "error"
            ? "bg-red-500 text-white"
            : "bg-yellow-400 hover:bg-yellow-300 text-black"}
          ${className}
        `}
      >
        {state === "uploading" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {state === "done" && <Check className="w-3.5 h-3.5" />}
        {state === "error" && <AlertCircle className="w-3.5 h-3.5" />}
        {state === "idle" && <Camera className="w-3.5 h-3.5" />}

        <span>
          {state === "uploading" ? "Uploading…"
            : state === "done" ? "Saved!"
            : state === "error" ? (errMsg.length > 20 ? "Error" : errMsg)
            : "Upload Image"}
        </span>
      </button>
    </>
  );
}
