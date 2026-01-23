import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { logOutUser } from "../redux/auth/authThunk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Switch } from "@mui/material";
import { useState } from "react";
import { FormControlLabel } from "@mui/material";
import { punchOut } from "../services/attendanceService";
import { punchIn } from "../services/attendanceService";

export default function Topbar({ userName }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [punch, setPunch] = useState(false);

  const label = { inputProps: { "aria-label": "Color switch demo" } };
  const handleLogOut = async () => {
    try {
      const result = await dispatch(logOutUser()).unwrap();

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error || "Logout failed");
    }
  };
  const handlePunch = async () => {
    if (punch) {
      let response = await punchOut();

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } else {
      let response = await punchIn();
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <h1>Welcome {userName}</h1>

      <FormControlLabel
        control={
          <Switch
            checked={punch}
            onChange={(e) => setPunch(e.target.checked)}
            onClick={handlePunch}
          />
        }
        label="Punch"
      />

      <Button onClick={handleLogOut}>LogOut</Button>
    </div>
  );
}
