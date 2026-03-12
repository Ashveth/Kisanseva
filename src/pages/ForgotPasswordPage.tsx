import { useState } from "react";
import { motion } from "framer-motion";
import { Sprout, Mail, Phone, Lock, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ForgotPasswordPage = () => {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const formatPhoneNumber = (input: string): string => {
    const digits = input.replace(/[^\d+]/g, "");
    if (digits.startsWith("+")) return digits;
    if (digits.startsWith("0")) return "+91" + digits.slice(1);
    if (digits.length === 10) return "+91" + digits;
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (method === "phone") {
      if (newPassword !== confirmPassword) {
        toast.error(t.passwordsDoNotMatch);
        return;
      }
    }

    setLoading(true);
    try {
      if (method === "phone") {
        const formattedPhone = formatPhoneNumber(phone);
        const { data, error } = await supabase.functions.invoke("reset-phone-password", {
          body: { phone: formattedPhone, newPassword },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        toast.success(t.passwordResetSuccess);
        setSent(true);
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success(t.passwordResetSent);
        setSent(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
            <Sprout className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">{t.forgotPassword}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t.forgotPasswordDesc}</p>
        </div>

        {!sent ? (
          <>
            {/* Method Toggle */}
            <div className="flex gap-1 p-1 bg-muted rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  method === "phone"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Phone className="h-4 w-4" />
                {t.phone}
              </button>
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  method === "email"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="h-4 w-4" />
                {t.email}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
              {method === "phone" ? (
                <>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder={t.phoneNumber}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 h-11 bg-card"
                      required
                    />
                    <span className="absolute right-3 top-3 text-xs text-muted-foreground">+91</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder={t.newPassword}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 h-11 bg-card"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder={t.confirmPassword}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-11 bg-card"
                      required
                      minLength={6}
                    />
                  </div>
                </>
              ) : (
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-card"
                    required
                  />
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full h-11 gradient-hero text-primary-foreground font-display font-bold">
                {loading ? t.pleaseWait : t.resetPassword}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </>
        ) : (
          <div className="glass-card p-6 text-center space-y-4">
            <div className="text-4xl">{method === "phone" ? "✅" : "✉️"}</div>
            <p className="text-sm text-foreground font-medium">
              {method === "phone" ? t.passwordResetSuccess : t.passwordResetSent}
            </p>
            <Button onClick={() => navigate("/auth")} variant="outline" className="mt-2">
              {t.backToLogin}
            </Button>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground mt-4">
          <button onClick={() => navigate("/auth")} className="text-primary font-medium underline inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            {t.backToLogin}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
