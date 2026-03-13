import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="pb-20 md:pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
