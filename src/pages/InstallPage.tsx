import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Wifi, WifiOff, CheckCircle2, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const features = [
    { icon: WifiOff, title: "Works Offline", desc: "Access weather, crop tips, and saved data without internet" },
    { icon: Smartphone, title: "Home Screen App", desc: "Install to your phone — opens like a real app" },
    { icon: Download, title: "Fast & Light", desc: "Loads instantly, uses less data than browsing" },
  ];

  return (
    <div className="container py-6 space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="h-20 w-20 mx-auto rounded-2xl overflow-hidden shadow-elevated">
          <img src="/pwa-icon-192.png" alt="FarmWise" className="h-full w-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold font-display text-foreground">Install FarmWise</h1>
        <div className="flex items-center justify-center gap-2 text-sm">
          {isOnline ? (
            <span className="flex items-center gap-1 text-primary"><Wifi className="h-4 w-4" /> Online</span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground"><WifiOff className="h-4 w-4" /> Offline</span>
          )}
        </div>
      </motion.div>

      <div className="space-y-3">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
              <f.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-bold text-foreground text-sm">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {isInstalled ? (
        <div className="glass-card p-5 text-center space-y-2">
          <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
          <p className="font-display font-bold text-foreground">Already Installed!</p>
          <p className="text-sm text-muted-foreground">FarmWise is on your home screen. Open it from there for the best experience.</p>
        </div>
      ) : deferredPrompt ? (
        <Button onClick={handleInstall} className="w-full font-display" size="lg">
          <Download className="h-5 w-5 mr-2" />
          Install FarmWise
        </Button>
      ) : (
        <div className="glass-card p-5 space-y-3">
          <p className="font-display font-bold text-foreground text-sm text-center">How to Install</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2"><Share className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" /> <strong>iPhone:</strong> Tap Share → "Add to Home Screen"</p>
            <p className="flex items-start gap-2"><Download className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" /> <strong>Android:</strong> Tap ⋮ menu → "Install app" or "Add to Home Screen"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallPage;
