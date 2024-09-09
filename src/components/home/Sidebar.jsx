import React, { useState, forwardRef } from "react";
// components
import TopSidebar from "./TopSidebar";
import BotSidebar from "./BotSidebar";
import Search from "../Search";
import UserLists from "./UserLists";
import AddUser from "./AddUser";

import { useUserStore } from "../../lib/userStore";

// Use forwardRef to pass the ref from the parent component
const Sidebar = forwardRef((props, ref) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <div
        ref={ref}
        className={`w-full ${
          darkmode ? "bg-[#0b0b0b]" : "bg-white"
        } h-screen relative`}
      >
        <div className="w-full h-full flex flex-col px-4 gap-6">
          <TopSidebar />
          <Search
            value={searchTerm}
            setValue={setSearchTerm}
            onSubmit={() => {}}
          />
          <UserLists searchTerm={searchTerm} />
        </div>
        <div className="w-full absolute bottom-0">
          <BotSidebar />
        </div>
      </div>

      {showAddUser && <AddUser onCancel={() => setShowAddUser(false)} />}
    </>
  );
});

// Export the Sidebar component
export default Sidebar;
