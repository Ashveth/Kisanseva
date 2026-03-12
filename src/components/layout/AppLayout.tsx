import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isOnChat = location.pathname === "/chat";

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="pb-20 md:pb-8">
        <Outlet />
      </main>
      <BottomNav />

      {/* Floating AI Button */}
      {!isOnChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/chat")}
          className="fixed bottom-24 md:bottom-6 right-4 z-50 h-14 w-14 rounded-full gradient-hero shadow-elevated flex items-center justify-center text-primary-foreground"
          aria-label="Ask AI"
        >
          <Sparkles className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
};

export default AppLayout;
