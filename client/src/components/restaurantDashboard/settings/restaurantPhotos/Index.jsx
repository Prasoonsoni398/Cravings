import React from "react";
import CoverImage from "./CoverImage";
import GalleryImages from "./GalleryImages";

const RestaurantPhotosIndex = () => {
  return (
    <div className="p-2">
      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-3 items-start">
        <CoverImage />
        <GalleryImages />
      </div>
    </div>
  );
};

export default RestaurantPhotosIndex;
