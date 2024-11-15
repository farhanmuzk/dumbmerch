import { Outlet } from "react-router-dom";

const RootLayouts = () => {
  return (
    <div className="root-layout">
      <Outlet />
    </div>
  );
};

export default RootLayouts;
