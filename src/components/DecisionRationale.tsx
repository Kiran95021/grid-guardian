import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, AlertTriangle, Zap, Eye, Brain } from "lucide-react";

interface RationaleEntry {
  id: string;
  timestamp: string;
  perception: string;
  decision: string;
  rationale: string;
  confidence: number;
  priority: "critical" | "warning" | "normal";
}

interface DecisionRationaleProps {
  pedestrianDetected: boolean;
  pedestrianDistance: number;
  collisionProbability: number;
  actionTaken: "BRAKING" | "CONTINUE";
  fogActive: boolean;
  intersectionReached: boolean;
  isEmergency: boolean;
}

const DecisionRationale = ({
  pedestrianDetected,
  pedestrianDistance,
  collisionProbability,
  actionTaken,
  fogActive,
  intersectionReached,
  isEmergency
}: DecisionRationaleProps) => {
  const [entries, setEntries] = useState<RationaleEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastEventRef = useRef<string>("");

  const generateTimestamp = () => {
    return new Date().toLocaleTimeString("en-US", { 
      hour12: false, 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit" 
    });
  };

  const addEntry = (entry: Omit<RationaleEntry, "id" | "timestamp">) => {
    const newEntry: RationaleEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: generateTimestamp()
    };
    setEntries(prev => [...prev, newEntry].slice(-5));
  };

  // Initial entry
  useEffect(() => {
    addEntry({
      perception: "System initialized",
      decision: "Normal Operation",
      rationale: "All sensors nominal, path clear",
      confidence: 98,
      priority: "normal"
    });
  }, []);

  // Emergency braking event
  useEffect(() => {
    if (isEmergency && lastEventRef.current !== "emergency") {
      lastEventRef.current = "emergency";
      addEntry({
        perception: `Pedestrian detected @ ${pedestrianDistance.toFixed(1)}m`,
        decision: "Emergency Brake",
        rationale: "Safety distance threshold violated",
        confidence: 99,
        priority: "critical"
      });
    } else if (!isEmergency && lastEventRef.current === "emergency") {
      lastEventRef.current = "";
      addEntry({
        perception: "Path cleared",
        decision: "Resume Normal",
        rationale: "Obstacle no longer in path, safe to proceed",
        confidence: 95,
        priority: "normal"
      });
    }
  }, [isEmergency, pedestrianDistance]);

  // Fog/sensor degradation event
  useEffect(() => {
    if (fogActive && lastEventRef.current !== "fog") {
      lastEventRef.current = "fog";
      addEntry({
        perception: "Sensor degradation detected",
        decision: "Reduce Speed",
        rationale: "Visibility reduced, switching to radar-primary mode",
        confidence: 72,
        priority: "warning"
      });
    }
  }, [fogActive]);

  // Intersection event
  useEffect(() => {
    if (intersectionReached && !isEmergency) {
      addEntry({
        perception: "Intersection ahead",
        decision: "Holding at Junction",
        rationale: "Analyzing cross-traffic & signal state",
        confidence: 95,
        priority: "normal"
      });
    }
  }, [intersectionReached, isEmergency]);

  // Regular status updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isEmergency && !fogActive) {
        const statuses = [
          {
            perception: "Lane tracking stable",
            decision: "Maintain Course",
            rationale: "Clear path ahead, optimal speed maintained",
            confidence: 96 + Math.floor(Math.random() * 4),
            priority: "normal" as const
          },
          {
            perception: "Traffic flow analyzed",
            decision: "Continue",
            rationale: "Following distance optimal, no obstacles",
            confidence: 94 + Math.floor(Math.random() * 5),
            priority: "normal" as const
          },
          {
            perception: "Surrounding vehicles tracked",
            decision: "Adjust Speed",
            rationale: "Matching traffic flow for efficiency",
            confidence: 93 + Math.floor(Math.random() * 6),
            priority: "normal" as const
          }
        ];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        addEntry(randomStatus);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isEmergency, fogActive]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const getPriorityStyles = (priority: RationaleEntry["priority"]) => {
    switch (priority) {
      case "critical":
        return "border-accent/50 bg-accent/10";
      case "warning":
        return "border-neon-yellow/50 bg-neon-yellow/10";
      default:
        return "border-border/30 bg-card/50";
    }
  };

  const getPriorityIcon = (priority: RationaleEntry["priority"]) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="w-3.5 h-3.5 text-accent" />;
      case "warning":
        return <Eye className="w-3.5 h-3.5 text-neon-yellow" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <div className="glass-panel h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border/30">
        <Terminal className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm text-primary cyber-glow-text">DECISION RATIONALE</h3>
        <div className="ml-auto flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Brain className="w-3 h-3 text-primary" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-1"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
            <span className="text-[9px] text-muted-foreground font-mono">LIVE</span>
          </motion.div>
        </div>
      </div>

      {/* Entries Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-2"
        style={{ scrollBehavior: "smooth" }}
      >
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg border font-mono text-[10px] ${getPriorityStyles(entry.priority)}`}
            >
              <div className="flex items-start gap-2">
                {getPriorityIcon(entry.priority)}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Timestamp */}
                  <div className="text-muted-foreground">
                    [{entry.timestamp}]
                  </div>
                  
                  {/* Perception */}
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-semibold shrink-0">PERCEPTION:</span>
                    <span className="text-foreground">{entry.perception}</span>
                  </div>
                  
                  {/* Decision */}
                  <div className="flex items-start gap-2">
                    <span className={`font-semibold shrink-0 ${
                      entry.priority === "critical" ? "text-accent" : 
                      entry.priority === "warning" ? "text-neon-yellow" : "text-neon-green"
                    }`}>DECISION:</span>
                    <span className={`font-bold ${
                      entry.priority === "critical" ? "text-accent" : 
                      entry.priority === "warning" ? "text-neon-yellow" : "text-foreground"
                    }`}>{entry.decision}</span>
                  </div>
                  
                  {/* Rationale */}
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground shrink-0">RATIONALE:</span>
                    <span className="text-foreground/80">{entry.rationale}</span>
                  </div>
                  
                  {/* Confidence Bar */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground text-[9px]">CONF:</span>
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${entry.confidence}%` }}
                        className={`h-full ${
                          entry.confidence >= 90 ? "bg-neon-green" :
                          entry.confidence >= 70 ? "bg-neon-yellow" : "bg-accent"
                        }`}
                      />
                    </div>
                    <span className={`text-[9px] ${
                      entry.confidence >= 90 ? "text-neon-green" :
                      entry.confidence >= 70 ? "text-neon-yellow" : "text-accent"
                    }`}>{entry.confidence}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Cursor */}
        <div className="text-primary/50 typing-cursor pl-2 text-xs">_</div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border/30 flex items-center justify-between text-[9px] text-muted-foreground font-mono">
        <span>ENTRIES: {entries.length}/5</span>
        <span className="flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-neon-green" />
          XAI ENGINE ACTIVE
        </span>
      </div>
    </div>
  );
};

export default DecisionRationale;
