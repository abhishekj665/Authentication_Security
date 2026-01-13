import AdminUserPage from "./AdminUserPage";
import ManagerSidebar from "./ManagerSideBar";
import Sidebar from "./SideBar";
import Topbar from "./TopBar";
import { Outlet } from "react-router-dom";

export default function ManagerLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <ManagerSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="p-6 overflow-y-auto">
          <Outlet></Outlet>
        </main>
      </div>
    </div>
  );
}
