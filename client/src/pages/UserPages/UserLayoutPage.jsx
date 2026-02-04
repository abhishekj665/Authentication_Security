import Topbar from "../../components/TopBar";
import UserSidebar from "./UserSideBar";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState } from "react";

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  if (!user) {
    setTimeout(() => {
      navigate("/login");
      toast.error("Please login to access this page");
    }, 800);

    return;
  }

  return (
    <div className="flex h-[96vh] bg-gray-100 relative">
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      <UserSidebar open={open} setOpen={setOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar open={open} setOpen={setOpen} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
