import React, { useState, useEffect, useMemo } from "react";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const GalleryImages = () => {
  const MAX_FILE_SIZE = 1024 * 1024; // 1MB
  const MAX_GALLERY_IMAGES = 8;
  const [galleryImages, setGalleryImages] = useState([]);
  const [error, setError] = useState("");

  const galleryPreviews = useMemo(() => {
    return galleryImages.map((image) => ({
      file: image,
      url: URL.createObjectURL(image),
      key: `${image.name}-${image.lastModified}`,
    }));
  }, [galleryImages]);

  useEffect(() => {
    return () => {
      galleryPreviews.forEach((imagePreview) => {
        URL.revokeObjectURL(imagePreview.url);
      });
    };
  }, [galleryPreviews]);

  const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    const oversizedFiles = files.filter((file) => file.size >= MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setError("Each restaurant image must be less than 1MB.");
      event.target.value = "";
      return;
    }

    setGalleryImages((prevImages) => {
      const merged = [...prevImages, ...files];
      if (merged.length > MAX_GALLERY_IMAGES) {
        setError(`You can upload up to ${MAX_GALLERY_IMAGES} restaurant images only.`);
        return merged.slice(0, MAX_GALLERY_IMAGES);
      }

      setError("");
      return merged;
    });

    event.target.value = "";
  };

  const removeGalleryImage = (indexToRemove) => {
    setGalleryImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setError("");
  };

  return (
    <div className="bg-(--color-base-100) rounded-xl border border-primary/40 shadow-sm p-4 h-full">
      <div className="flex items-start justify-between gap-3 border-b border-(--color-secondary) mb-3 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-(--color-primary)">
              Other Restaurant Images
            </h3>
            <span className="text-[11px] px-2 py-1 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium">
              {galleryImages.length}/{MAX_GALLERY_IMAGES}
            </span>
          </div>
          <p className="text-xs text-(--color-secondary) mt-0.5">
            Upload up to {MAX_GALLERY_IMAGES} images, each less than 1MB.
          </p>
        </div>

        <div className="shrink-0">
          <label
            htmlFor="galleryImages"
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs shadow-sm transition ${galleryImages.length >= MAX_GALLERY_IMAGES ? "bg-(--color-secondary) text-(--color-secondary-content) cursor-not-allowed" : "bg-(--color-primary) text-(--color-primary-content) cursor-pointer hover:opacity-95"}`}
          >
            <MdOutlineAddAPhoto className="text-sm" />
            Upload Restaurant Images
          </label>
          <input
            id="galleryImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryImagesChange}
            disabled={galleryImages.length >= MAX_GALLERY_IMAGES}
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-(--color-error)/30 bg-(--color-error)/5 px-3 py-2">
          <p className="text-xs text-(--color-error)">{error}</p>
        </div>
      )}

      {galleryPreviews.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {galleryPreviews.map((imagePreview, index) => (
            <div
              key={imagePreview.key}
              className="group overflow-hidden rounded-xl border border-(--color-secondary) bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative">
                <img
                  src={imagePreview.url}
                  alt={`Restaurant ${index + 1}`}
                  className="h-36 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-(--color-error) shadow-sm ring-1 ring-(--color-error)/20 transition hover:bg-(--color-error) hover:text-(--color-error-content)"
                  aria-label={`Remove ${imagePreview.file.name}`}
                >
                  <IoMdClose className="text-lg" />
                </button>
              </div>

              <div className="px-3 py-2">
                <p className="truncate text-xs font-medium text-(--color-primary)">
                  {imagePreview.file.name}
                </p>
                <p className="mt-0.5 text-[11px] text-(--color-secondary-content)">
                  {(imagePreview.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-(--color-secondary) bg-linear-to-br from-white to-(--color-base-100) px-4 py-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
            <label
              htmlFor="galleryImages"
              className={`cursor-pointer ${galleryImages.length >= MAX_GALLERY_IMAGES ? "" : ""}`}
            >
              <MdOutlineAddAPhoto className="text-2xl" />
            </label>
          </div>
          <p className="text-sm font-semibold text-(--color-primary)">
            No restaurant images yet
          </p>
          <p className="mt-1 text-xs text-(--color-secondary)">
            Add up to 10 supporting photos to show the dining space, food,
            and kitchen.
          </p>
        </div>
      )}
    </div>
  );
};

export default GalleryImages;
