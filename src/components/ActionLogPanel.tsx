import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, AlertTriangle, Shield, Zap, Info } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: number;
  action: string;
  reason: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface ActionLogPanelProps {
  logs: LogEntry[];
}

const ActionLogPanel = ({ logs }: ActionLogPanelProps) => {
  const getPriorityConfig = (priority: LogEntry["priority"]) => {
    switch (priority) {
      case "CRITICAL":
        return { 
          color: "text-accent", 
          bg: "bg-accent/20 border-accent/50",
          icon: AlertTriangle 
        };
      case "HIGH":
        return { 
          color: "text-neon-yellow", 
          bg: "bg-neon-yellow/20 border-neon-yellow/50",
          icon: Zap 
        };
      case "MEDIUM":
        return { 
          color: "text-primary", 
          bg: "bg-primary/20 border-primary/50",
          icon: Shield 
        };
      default:
        return { 
          color: "text-muted-foreground", 
          bg: "bg-card/50 border-border/30",
          icon: Info 
        };
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="glass-panel p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <ScrollText className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm text-primary cyber-glow-text">ACTION LOG</h3>
        <div className="ml-auto text-[10px] text-muted-foreground font-mono">
          {logs.length}/5
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {logs.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No actions logged yet.
              <br />
              <span className="text-[10px]">Start simulation to see logs.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => {
                const config = getPriorityConfig(log.priority);
                const Icon = config.icon;
                const isActive = index === 0;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.7, 
                      x: 0, 
                      scale: 1,
                    }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-lg border ${config.bg} ${
                      isActive ? "ring-1 ring-primary/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-mono text-xs font-bold ${config.color}`}>
                            [{log.action}]
                          </span>
                          {isActive && (
                            <motion.span
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="text-[8px] text-primary uppercase"
                            >
                              ACTIVE
                            </motion.span>
                          )}
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed">
                          {log.reason}
                        </p>
                        <div className="text-[9px] text-muted-foreground mt-1 font-mono">
                          {formatTime(log.timestamp)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Tagline */}
      <div className="mt-4 pt-3 border-t border-border/30">
        <p className="text-[9px] text-primary/80 text-center italic">
          "Every autonomous decision is logged, explained, and auditable."
        </p>
      </div>
    </div>
  );
};

export default ActionLogPanel;
