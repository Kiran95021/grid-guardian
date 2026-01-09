import { useEffect, useState, useRef } from "react";
import { Terminal, Cpu, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  reason: string;
  confidence: number;
  priority: "high" | "medium" | "low";
}

const actions = ["BRAKING", "STEERING_LEFT", "STEERING_RIGHT", "ACCELERATING", "MAINTAINING", "LANE_CHANGE"];
const reasons = [
  "Detected Pedestrian",
  "Red Light Ahead",
  "Vehicle Cutting In",
  "Clear Path Ahead",
  "Speed Limit Zone",
  "Intersection Approach",
  "Following Distance",
  "Lane Obstruction",
  "Traffic Flow Optimization",
  "Safety Buffer Engaged",
];

interface DecisionFeedProps {
  emergencyEvent?: boolean;
  fogActive?: boolean;
}

const DecisionFeed = ({ emergencyEvent, fogActive }: DecisionFeedProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const generateLog = (isEmergency = false): LogEntry => {
    const now = new Date();
    const action = isEmergency ? "EMERGENCY_BRAKING" : actions[Math.floor(Math.random() * actions.length)];
    const reason = isEmergency ? "CRITICAL: J-Walker Detected in Path" : reasons[Math.floor(Math.random() * reasons.length)];
    const confidence = isEmergency ? 99 : Math.floor(Math.random() * 25) + 75;

    return {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      action,
      reason,
      confidence,
      priority: isEmergency ? "high" : confidence > 90 ? "low" : confidence > 80 ? "medium" : "high",
    };
  };

  useEffect(() => {
    // Initial logs
    setLogs(Array.from({ length: 5 }, () => generateLog()));

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [...prev, generateLog()];
        if (newLogs.length > 20) newLogs.shift();
        return newLogs;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Add emergency log when event triggered
  useEffect(() => {
    if (emergencyEvent) {
      setLogs((prev) => [...prev, generateLog(true)]);
    }
  }, [emergencyEvent]);

  // Add fog perception log
  useEffect(() => {
    if (fogActive) {
      setLogs((prev) => [
        ...prev,
        {
          id: `fog-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          action: "PERCEPTION_DEGRADED",
          reason: "Sensor Noise Detected - Visibility Reduced",
          confidence: 45,
          priority: "high",
        },
      ]);
    }
  }, [fogActive]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getPriorityColor = (priority: LogEntry["priority"]) => {
    switch (priority) {
      case "high": return "text-neon-red";
      case "medium": return "text-neon-yellow";
      case "low": return "text-neon-green";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-neon-green";
    if (confidence >= 70) return "text-neon-yellow";
    return "text-neon-red";
  };

  return (
    <div className="glass-panel h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border/30">
        <Terminal className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm text-primary cyber-glow-text">DECISION RATIONALE</h3>
        <div className="ml-auto flex items-center gap-2">
          <Activity className="w-3 h-3 text-neon-green animate-pulse" />
          <span className="text-[10px] text-muted-foreground">LIVE</span>
        </div>
      </div>

      {/* Log Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-[11px]"
        style={{ scrollBehavior: "smooth" }}
      >
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-2 rounded border ${
                log.priority === "high" 
                  ? "border-neon-red/30 bg-neon-red/5" 
                  : "border-border/20 bg-card/50"
              }`}
            >
              <div className="flex items-start gap-2">
                {log.priority === "high" ? (
                  <AlertTriangle className="w-3 h-3 text-neon-red mt-0.5 flex-shrink-0" />
                ) : (
                  <Cpu className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-muted-foreground">[{log.timestamp}]</span>
                    <span className={getPriorityColor(log.priority)}>
                      ACTION: {log.action}
                    </span>
                  </div>
                  <div className="text-foreground/80 mt-0.5">
                    REASON: {log.reason}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground">CONFIDENCE:</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${log.confidence}%` }}
                        className={`h-full ${
                          log.confidence >= 90 ? "bg-neon-green" :
                          log.confidence >= 70 ? "bg-neon-yellow" : "bg-neon-red"
                        }`}
                      />
                    </div>
                    <span className={getConfidenceColor(log.confidence)}>
                      {log.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing cursor */}
        <div className="text-primary/50 typing-cursor pl-2">_</div>
      </div>

      {/* Footer Stats */}
      <div className="p-2 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>ENTRIES: {logs.length}</span>
        <span>AVG CONF: {Math.floor(logs.reduce((a, b) => a + b.confidence, 0) / logs.length)}%</span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-neon-green" />
          SYSTEM OK
        </span>
      </div>
    </div>
  );
};

export default DecisionFeed;
