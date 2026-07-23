import React, { useState } from "react";
import toast from "react-hot-toast";

const SocialMediaLinks = () => {
  const [editingSocialMedia, setEditingSocialMedia] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const initialData = JSON.parse(sessionStorage.getItem("cravingRestaurant")) || {};

  const [socialMediaLinks, setSocialMediaLinks] = useState(
    initialData?.socialMediaLinks || []
  );

  const handleSocialMediaChange = (index, field, value) => {
    const updated = socialMediaLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setSocialMediaLinks(updated);
  };

  const addSocialMediaLink = () => {
    setSocialMediaLinks([...socialMediaLinks, { platform: "", url: "" }]);
    setEditingSocialMedia(true);
  };

  const removeSocialMediaLink = (index) => {
    setSocialMediaLinks(socialMediaLinks.filter((_, i) => i !== index));
    setEditingSocialMedia(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Mock save
      console.log("socialMediaLinks", socialMediaLinks);
      toast.success("Social media links updated successfully");
      setEditingSocialMedia(false);
    } catch (error) {
      toast.error("Failed to update social media links");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSocialMediaLinks(initialData?.socialMediaLinks || []);
    setEditingSocialMedia(false);
  };

  return (
    <div className="bg-(--color-base-100) rounded-lg p-3 h-full flex flex-col border border-primary/40">
      <div className="flex justify-between items-center mb-2 border-b border-(--color-secondary) pb-2">
        <label className="text-sm font-semibold text-(--color-primary)">
          Social Media Links
        </label>
        
        {!editingSocialMedia ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addSocialMediaLink}
              className="text-xs bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded"
            >
              + Add Link
            </button>
            <button
              onClick={() => setEditingSocialMedia(true)}
              className="text-xs bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
             <button
              type="button"
              onClick={addSocialMediaLink}
              className="text-xs bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded"
            >
              + Add Link
            </button>
            <button
              onClick={handleSave}
              className="text-xs bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded"
              disabled={isLoading}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="text-xs bg-(--color-secondary) text-(--color-secondary-content) px-2 py-0.5 rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 h-30 overflow-y-auto pr-1">
        {socialMediaLinks.map((link, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Platform (e.g. Instagram)"
              value={link.platform}
              onChange={(e) =>
                handleSocialMediaChange(index, "platform", e.target.value)
              }
              className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingSocialMedia ? "bg-white" : "bg-(--color-base-100)"} rounded text-sm`}
              disabled={!editingSocialMedia}
            />
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={(e) =>
                  handleSocialMediaChange(index, "url", e.target.value)
                }
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingSocialMedia ? "bg-white" : "bg-(--color-base-100)"} rounded text-sm`}
                disabled={!editingSocialMedia}
              />

              {editingSocialMedia && (
                <button
                  type="button"
                  onClick={() => removeSocialMediaLink(index)}
                  className="text-red-500 text-sm px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
        {socialMediaLinks.length === 0 && (
          <p className="text-xs text-(--color-secondary)">
            No social media links added.
          </p>
        )}
      </div>
    </div>
  );
};

export default SocialMediaLinks;
