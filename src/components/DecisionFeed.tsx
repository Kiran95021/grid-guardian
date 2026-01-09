import { useEffect, useState, useRef } from "react";
import { Terminal, Cpu, AlertTriangle, CheckCircle, Activity, Zap } from "lucide-react";
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
  intersectionReached?: boolean;
}

const DecisionFeed = ({ emergencyEvent, fogActive, intersectionReached }: DecisionFeedProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lastIntersectionTime, setLastIntersectionTime] = useState(0);

  const generateLog = (isEmergency = false, isIntersection = false): LogEntry => {
    const now = new Date();
    let action: string;
    let reason: string;
    let confidence: number;
    let priority: "high" | "medium" | "low";

    if (isEmergency) {
      action = "EMERGENCY_BRAKING";
      reason = "CRITICAL: J-Walker Detected in Path - Collision Avoidance Active";
      confidence = 99;
      priority = "high";
    } else if (isIntersection) {
      action = "HOLDING_AT_JUNCTION";
      reason = "Analyzing Cross-Traffic & Signal State";
      confidence = 95;
      priority = "medium";
    } else {
      action = actions[Math.floor(Math.random() * actions.length)];
      reason = reasons[Math.floor(Math.random() * reasons.length)];
      confidence = Math.floor(Math.random() * 25) + 75;
      priority = confidence > 90 ? "low" : confidence > 80 ? "medium" : "high";
    }

    return {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      action,
      reason,
      confidence,
      priority,
    };
  };

  useEffect(() => {
    // Initial logs - limit to 3
    setLogs(Array.from({ length: 3 }, () => generateLog()));

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [...prev, generateLog()];
        // Limit to 5 entries for clarity
        while (newLogs.length > 5) newLogs.shift();
        return newLogs;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Add emergency log when event triggered
  useEffect(() => {
    if (emergencyEvent) {
      setLogs((prev) => [...prev, generateLog(true, false)]);
    }
  }, [emergencyEvent]);

  // Add intersection log when vehicle reaches junction
  useEffect(() => {
    if (intersectionReached && Date.now() - lastIntersectionTime > 5000) {
      setLastIntersectionTime(Date.now());
      setLogs((prev) => [...prev, generateLog(false, true)]);
    }
  }, [intersectionReached, lastIntersectionTime]);

  // Add fog perception log
  useEffect(() => {
    if (fogActive) {
      setLogs((prev) => [
        ...prev,
        {
          id: `fog-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          action: "PERCEPTION_DEGRADED",
          reason: "Sensor Noise Detected - Switching to Radar-Primary Mode",
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
      case "high": return "text-accent";
      case "medium": return "text-neon-yellow";
      case "low": return "text-neon-green";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-neon-green";
    if (confidence >= 70) return "text-neon-yellow";
    return "text-accent";
  };

  const getActionColor = (action: string) => {
    if (action.includes("EMERGENCY") || action.includes("DEGRADED")) return "text-accent";
    if (action.includes("HOLDING")) return "text-primary";
    return "text-neon-green";
  };

  return (
    <div className="glass-panel h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border/30">
        <Terminal className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm text-primary cyber-glow-text">XAI DECISION RATIONALE</h3>
        <div className="ml-auto flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Zap className="w-3 h-3 text-primary" />
          </motion.div>
          <Activity className="w-3 h-3 text-neon-green animate-pulse" />
          <span className="text-[10px] text-muted-foreground">LIVE FEED</span>
        </div>
      </div>

      {/* Log Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-1.5 font-mono text-[11px]"
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
              className={`p-2.5 rounded-lg border backdrop-blur-sm ${
                log.priority === "high" 
                  ? "border-accent/40 bg-accent/10" 
                  : log.action.includes("HOLDING")
                    ? "border-primary/40 bg-primary/10"
                    : "border-border/20 bg-card/50"
              }`}
            >
              <div className="flex items-start gap-2">
                {log.priority === "high" ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                ) : log.action.includes("HOLDING") ? (
                  <Activity className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                ) : (
                  <Cpu className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-muted-foreground">[{log.timestamp}]</span>
                  </div>
                  <div className={`font-semibold mt-1 ${getActionColor(log.action)}`}>
                    ACTION: {log.action.replace(/_/g, " ")}
                  </div>
                  <div className="text-foreground/80 mt-0.5">
                    REASON: {log.reason}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-muted-foreground">CONFIDENCE:</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${log.confidence}%` }}
                        className={`h-full ${
                          log.confidence >= 90 ? "bg-neon-green" :
                          log.confidence >= 70 ? "bg-neon-yellow" : "bg-accent"
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
          XAI ACTIVE
        </span>
      </div>
    </div>
  );
};

export default DecisionFeed;
