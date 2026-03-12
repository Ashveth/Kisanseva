import { motion, AnimatePresence } from "framer-motion";
import { Bell, CloudRain, TrendingUp, Bug, Check, CheckCheck, Trash2, Plus, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";

const typeConfig = {
  weather: { icon: CloudRain, gradient: "gradient-sky", label: "Weather" },
  market: { icon: TrendingUp, gradient: "gradient-harvest", label: "Market" },
  disease: { icon: Bug, gradient: "gradient-earth", label: "Disease" },
};

const severityConfig = {
  critical: { icon: AlertTriangle, className: "text-destructive bg-destructive/10 border-destructive/30" },
  warning: { icon: AlertTriangle, className: "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/30" },
  info: { icon: Info, className: "text-[hsl(var(--sky))] bg-[hsl(var(--sky))]/10 border-[hsl(var(--sky))]/30" },
};

const NotificationCard = ({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const config = typeConfig[notification.type];
  const severity = severityConfig[notification.severity];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`glass-card p-4 transition-all ${!notification.is_read ? "border-l-4 border-l-primary" : "opacity-75"}`}
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-xl ${config.gradient} flex items-center justify-center shrink-0`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-sm text-foreground truncate">{notification.title}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severity.className}`}>
              {notification.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          {!notification.is_read && (
            <button onClick={() => onMarkRead(notification.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors" title="Mark as read">
              <Check className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => onDelete(notification.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const NotificationsPage = () => {
  const { t } = useLanguage();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, generateSampleNotifications } = useNotifications();

  const filterTypes = ["all", "weather", "market", "disease"] as const;
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = activeFilter === "all" ? notifications : notifications.filter((n) => n.type === activeFilter);

  return (
    <div className="container max-w-2xl py-6 pb-24 md:pb-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            {t.notifications}
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} {t.unreadNotifications}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-xs">
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              {t.markAllRead}
            </Button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filterTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-4 py-2 rounded-full text-xs font-bold font-display transition-colors whitespace-nowrap ${
              activeFilter === type ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {type === "all" ? t.allNotifications : type === "weather" ? t.navWeather : type === "market" ? t.navMarket : t.navDiseaseDetect}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-foreground mb-2">{t.noNotifications}</h3>
          <p className="text-sm text-muted-foreground mb-6">{t.noNotificationsDesc}</p>
          <Button onClick={generateSampleNotifications} variant="outline" className="font-display">
            <Plus className="h-4 w-4 mr-2" />
            {t.generateSampleAlerts}
          </Button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filtered.map((n) => (
              <NotificationCard key={n.id} notification={n} onMarkRead={markAsRead} onDelete={deleteNotification} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {notifications.length === 0 && !loading && (
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8">
          <Button onClick={generateSampleNotifications} className="gradient-hero text-primary-foreground shadow-elevated font-display">
            <Plus className="h-4 w-4 mr-2" />
            {t.generateSampleAlerts}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

import { useState } from "react";
