import React, { useState, useEffect } from "react";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { RiLoader4Fill } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import Information from "./settings/restaurantInformation/Index";
import ResturantCoreDetails from "./settings/coreDetails/Index";
import RestaurantPhotos from "./settings/restaurantPhotos/Index";
import Loader from "../../assets/runningLoader.gif";
import { IoMdHammer } from "react-icons/io";

const RestaurantSetting = () => {
  const { user } = useAuth();
  const Tabs = [
    { id: "information", label: "Information" },
    { id: "coreDetails", label: "Core Details" },
    { id: "photos", label: "Photos" },
  ];
  const [activeTab, setActiveTab] = useState("information");

  const [isLoadingResturantOpen, setIsLoadingResturantOpen] = useState(true);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(
    sessionStorage.getItem("RestaurantOpen") === "true" || false,
  );

  //Load Restaurant Data
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [loadingRestaurantError, setLoadingRestaurantError] = useState(null);
  const [restaurantData, setRestaurantData] = useState();

  const fetchRestaurantData = async () => {
    try {
      setIsLoadingRestaurant(true);
      setIsLoadingResturantOpen(true);

      const res = await api.get(
        `/restaurant/get-restaurant-data?id=${user._id}`,
      );
      setRestaurantData(res.data.data);
      sessionStorage.setItem(
        "cravingRestaurant",
        JSON.stringify(res.data.data),
      );
      sessionStorage.setItem("RestaurantOpen", res.data.data.isOpen);

      setIsRestaurantOpen(res.data.data.isOpen);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred fetching restaurant. Please try again.",
      );
      setLoadingRestaurantError(
        error.response?.data?.message ||
          "Unknown error occurred fetching restaurant. Please try again.",
      );
    } finally {
      setIsLoadingRestaurant(false);
      setIsLoadingResturantOpen(false);
    }
  };

  const handleRestaurantOpen = async () => {
    try {
      setIsLoadingResturantOpen(true);

      const res = await api.patch(
        `/restaurant/change-open-status/${!isRestaurantOpen}?id=${user._id}`,
      );
      setIsRestaurantOpen(res.data.data.isOpen);
      setRestaurantData(res.data.data);
      sessionStorage.setItem(
        "cravingRestaurant",
        JSON.stringify(res.data.data),
      );

      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred while Opening the Restaurant. Please try again.",
      );
    } finally {
      setIsLoadingResturantOpen(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [user]);

  console.log(isRestaurantOpen);

  return (
    <>
      <div className=" h-full flex flex-col">
        <div className="border-b border-(--color-secondary)/50 flex justify-between w-full">
          <div className="flex p-2">
            <div className="relative flex bg-(--color-base-200) rounded-lg p-1 border border-(--color-secondary)/30 shadow-inner">
              <div
                className="absolute top-1 bottom-1 w-32 bg-(--color-primary) rounded-md shadow-sm transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(${Tabs.findIndex((t) => t.id === activeTab) * 100}%)`,
                }}
              />
              {Tabs.map((tab, idx) => (
                <div
                  key={idx}
                  className={`relative z-10 w-32 text-center py-2 px-3 uppercase text-xs font-semibold cursor-pointer transition-colors duration-300 flex items-center justify-center ${activeTab === tab.id ? "text-(--color-primary-content)" : "text-(--color-secondary) hover:text-(--color-primary)"}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 w-44">
            <label
              className={`w-24 text-right text-xs font-semibold ${isRestaurantOpen ? "text-(--color-primary)" : "text-(--color-secondary)"}`}
            >
              {isRestaurantOpen ? "Currently Open" : "Currently Offline"}
            </label>
            <div className="flex items-center relative mr-6">
              <input
                type="checkbox"
                name="isOpen"
                checked={isRestaurantOpen}
                onChange={handleRestaurantOpen}
                disabled={isLoadingResturantOpen || isLoadingRestaurant}
                className="switch switch-primary"
              />
             
            </div>
          </div>
        </div>

        {isLoadingRestaurant ? (
          <img src={Loader} alt="" className="w-50 h-10" />
        ) : (
          <div className="h-full rounded-lg bg-(--color-base-200) p-2">
            {activeTab === "information" && <Information />}
            {activeTab === "coreDetails" && <ResturantCoreDetails />}
            {activeTab === "photos" && <RestaurantPhotos />}
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantSetting;
