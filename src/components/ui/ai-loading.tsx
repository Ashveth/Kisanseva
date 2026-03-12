import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface AIErrorCardProps {
  message?: string;
  onRetry: () => void;
}

export const AIErrorCard = ({ message = "Something went wrong. Please try again.", onRetry }: AIErrorCardProps) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center space-y-3">
    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
      <AlertCircle className="h-6 w-6 text-destructive" />
    </div>
    <p className="text-sm text-foreground font-medium">{message}</p>
    <Button onClick={onRetry} variant="outline" size="sm" className="font-display">
      <RefreshCw className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </motion.div>
);

export const ResultCardSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="text-right space-y-1.5">
            <Skeleton className="h-4 w-16 ml-auto" />
            <Skeleton className="h-3 w-20 ml-auto" />
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
    ))}
  </div>
);

export const AnalysisSkeleton = () => (
  <div className="space-y-4">
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
    <div className="glass-card p-4 space-y-3">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
    <div className="glass-card p-4 space-y-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  </div>
);

export const YieldSkeleton = () => (
  <div className="space-y-4">
    <div className="glass-card p-5 text-center space-y-3">
      <Skeleton className="h-4 w-24 mx-auto" />
      <Skeleton className="h-10 w-40 mx-auto" />
      <Skeleton className="h-4 w-32 mx-auto" />
      <Skeleton className="h-4 w-48 mx-auto" />
    </div>
    <div className="glass-card p-4 space-y-3">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export const MarketSkeleton = () => (
  <div className="space-y-4">
    <div className="glass-card p-5 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-8 w-28" />
      <div className="flex gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <div className="glass-card p-4 space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
    <div className="glass-card p-4 space-y-3">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  </div>
);
