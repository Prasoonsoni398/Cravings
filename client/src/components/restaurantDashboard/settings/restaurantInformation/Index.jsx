import React from "react";
import PersonalInformation from "./PresonalInformation.";
import RestaurantInformation from "./RestaurantInformation";
import LeagalInformation from "./LegalInformation";

const Index = () => {
  return (
    <>
      <div className="overflow-y-auto h-full p-2 space-y-2">
        <PersonalInformation />
        <RestaurantInformation />
        <LeagalInformation />
      </div>
    </>
  );
};

export default Index;