import React, { useState, useEffect, useMemo } from "react";
import { MdOutlineAddAPhoto } from "react-icons/md";

const CoverImage = () => {
  const MAX_FILE_SIZE = 1024 * 1024; // 1MB
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");

  const coverPreview = useMemo(() => {
    return coverImage ? URL.createObjectURL(coverImage) : "";
  }, [coverImage]);

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const handleCoverImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setCoverImage(null);
      setError("");
      return;
    }

    if (file.size >= MAX_FILE_SIZE) {
      setCoverImage(null);
      setError("Cover image must be less than 1MB.");
      event.target.value = "";
      return;
    }

    setCoverImage(file);
    setError("");
  };

  return (
    <div className="bg-(--color-base-100) rounded-xl border border-primary/40 shadow-sm p-4 h-full">
      <div className="flex items-center justify-between border-b border-(--color-secondary) pb-2 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-(--color-primary)">
            Cover Image
          </h3>
          <p className="text-xs text-(--color-secondary)">
            Upload one hero image under 1MB.
          </p>
        </div>
        <div className="text-[11px] px-2 py-1 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium">
          1 file
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-dashed border-(--color-secondary) bg-(--color-base-100) p-3">
          <label
            htmlFor="coverImage"
            className="inline-flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-3 py-1.5 rounded-md text-xs cursor-pointer shadow-sm hover:opacity-95 transition"
          >
            <MdOutlineAddAPhoto className="text-sm" />
            Upload Cover Image
          </label>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="hidden"
          />
          <p className="mt-2 text-xs text-(--color-secondary)">
            Best for banner-style photos. JPG, PNG, AVIF, WEBP all work.
          </p>
          {error && (
            <p className="text-xs text-(--color-error) mt-2">{error}</p>
          )}
        </div>

        {coverImage && coverPreview ? (
          <div className="overflow-hidden rounded-xl border border-(--color-secondary) bg-white shadow-sm">
            <div className="relative">
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
              <p className="truncate font-medium">{coverImage.name}</p>
              <span className="shrink-0 rounded-full bg-(--color-secondary)/20 px-2 py-1 text-[11px]">
                {(coverImage.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-(--color-secondary) bg-linear-to-br from-white to-(--color-base-100) px-4 py-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
              <label htmlFor="coverImage" className="cursor-pointer">
                <MdOutlineAddAPhoto className="text-2xl" />
              </label>
            </div>
            <p className="text-sm font-semibold text-(--color-primary)">
              No cover selected
            </p>
            <p className="mt-1 text-xs text-(--color-secondary)">
              Add a clean hero image to make this restaurant stand out.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverImage;
