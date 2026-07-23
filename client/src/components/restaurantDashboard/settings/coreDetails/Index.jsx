import React from "react";
import AddressInformation from "./AddressInformation";
import BankingAndDocuments from "./BankingAndDocuments";
import SocialMediaLinks from "./SocialMediaLinks";

const CoreDetailsIndex = () => {
  return (
    <div className="overflow-y-auto h-full p-2 space-y-2">
      <div className="flex flex-col gap-2 h-full">
        <AddressInformation />
        <BankingAndDocuments />
        <SocialMediaLinks />
      </div>
    </div>
  );
};

export default CoreDetailsIndex;
