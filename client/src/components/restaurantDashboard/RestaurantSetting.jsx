import React,{ useState } from "react";
import RestaurantInformation from "./settings/RestaurantInfo"
import RestaurantPhotos from "./settings/RestaurantPhotos"
import ResturantCoreDetails from "./settings/RestaurantCoreDetails"


const RestaurantSetting = () => {
  const [activeTab, setActiveTab] = React.useState("information");
   const Tabs = [
    { id: "information", label: "Information" },
    { id: "coreDetails", label: "Core Details" },
    { id: "photos", label: "Photos" },
  ];
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  return (
    <>
       <div className=" h-full flex flex-col p-4">
        <div className="border-b border-(--color-secondary)/50 flex justify-between mb-2 w-full">
          <div className="flex gap-3 ">
            {Tabs.map((tab, idx) => (
              <>
                <div
                  key={idx}
                  className={`p-1 px-2   mb-1 uppercase cursor-pointer transition-all duration-300 ease-in-out ${activeTab === tab.id ? "text-primary-content rounded-sm bg-primary " : "bg-transparent text-gray-600"}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </div>
              </>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="w-22 text-xs font-semibold">Currently Open</label>
            <input
              type="checkbox"
              name="isOpen"
              checked={isRestaurantOpen}
              onChange={() => setIsRestaurantOpen(!isRestaurantOpen)}
              className=" w-4 h-4 accent-(--color-primary)"
            />
          </div>
        </div>
        <div className="h-full rounded-lg bg-(--color-base-200) p-2">
          {activeTab === "information" && <RestaurantInformation />}
          {activeTab === "coreDetails" && <ResturantCoreDetails />}
          {activeTab === "photos" && <RestaurantPhotos />}
        </div>
      </div>
    </>
  );
};

export default RestaurantSetting;

