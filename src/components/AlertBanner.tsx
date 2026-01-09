import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";

interface AlertBannerProps {
  show: boolean;
  message: string;
  onDismiss: () => void;
}

const AlertBanner = ({ show, message, onDismiss }: AlertBannerProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        >
          <div className="bg-neon-red/20 backdrop-blur-xl border-2 border-neon-red rounded-lg p-4 shadow-[0_0_30px_hsl(var(--neon-red)/0.4)]">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="p-2 bg-neon-red/30 rounded-lg"
              >
                <ShieldAlert className="w-6 h-6 text-neon-red" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-neon-red" />
                  <span className="text-sm font-display font-bold text-neon-red uppercase tracking-wider">
                    Safety Violation Risk
                  </span>
                </div>
                <p className="text-sm text-foreground font-mono mt-1">{message}</p>
              </div>

              <button
                onClick={onDismiss}
                className="p-1 hover:bg-neon-red/30 rounded transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Progress bar for auto-dismiss */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              onAnimationComplete={onDismiss}
              className="absolute bottom-0 left-0 h-1 bg-neon-red rounded-b-lg"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertBanner;
