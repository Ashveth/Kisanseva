import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Notification {
  id: string;
  user_id: string;
  type: "weather" | "market" | "disease";
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  is_read: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => fetchNotifications()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchNotifications]);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notif && !notif.is_read) setUnreadCount((c) => Math.max(0, c - 1));
  };

  const generateSampleNotifications = async () => {
    if (!user) return;
    const samples = [
      { user_id: user.id, type: "weather", title: "Heavy Rain Alert", message: "Heavy rainfall expected in next 24 hours. Secure your crops and reduce irrigation.", severity: "critical" },
      { user_id: user.id, type: "market", title: "Wheat Price Spike", message: "Wheat prices rose 12% in the last week. Consider selling stored wheat for best returns.", severity: "warning" },
      { user_id: user.id, type: "disease", title: "Leaf Blight Detected", message: "Leaf blight has been reported in your region. Apply fungicide treatment within 48 hours.", severity: "warning" },
      { user_id: user.id, type: "weather", title: "Frost Warning", message: "Temperature expected to drop below 2°C tonight. Cover frost-sensitive crops.", severity: "critical" },
      { user_id: user.id, type: "market", title: "Rice Prices Stable", message: "Rice market prices are stable this week. Current rate: ₹2,450/quintal.", severity: "info" },
      { user_id: user.id, type: "disease", title: "Pest Alert: Aphids", message: "High aphid activity detected in nearby farms. Monitor your crops and apply neem-based spray.", severity: "info" },
    ];
    await supabase.from("notifications").insert(samples);
    fetchNotifications();
  };

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, generateSampleNotifications };
};
