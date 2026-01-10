import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer, 
  ShieldCheck, 
  AlertOctagon, 
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface SafetyEvent {
  id: string;
  timestamp: string;
  type: "near_miss" | "brake_event" | "avoidance";
  description: string;
  responseTime: number;
}

interface SafetyAnalyticsProps {
  currentResponseTime: number;
  isEmergency: boolean;
  isBraking: boolean;
  pedestrianDistance: number;
  onSafetyEvent?: (event: SafetyEvent) => void;
}

const SafetyAnalytics = ({ 
  currentResponseTime, 
  isEmergency, 
  isBraking,
  pedestrianDistance,
  onSafetyEvent 
}: SafetyAnalyticsProps) => {
  const [safetyEvents, setSafetyEvents] = useState<SafetyEvent[]>([]);
  const [avgResponseTime, setAvgResponseTime] = useState(45);
  const [ruleCompliance, setRuleCompliance] = useState({
    speedAdherence: true,
    stopBehavior: true,
    safeDistance: true,
    signalCompliance: true
  });
  const [responseTimes, setResponseTimes] = useState<number[]>([45, 48, 42, 50, 47]);

  // Update response time stats
  useEffect(() => {
    if (currentResponseTime > 0) {
      setResponseTimes(prev => {
        const updated = [...prev, currentResponseTime].slice(-20);
        const avg = updated.reduce((a, b) => a + b, 0) / updated.length;
        setAvgResponseTime(Math.round(avg));
        return updated;
      });
    }
  }, [currentResponseTime]);

  // Track braking events
  useEffect(() => {
    if (isBraking && pedestrianDistance < 15) {
      const newEvent: SafetyEvent = {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("en-US", { 
          hour12: false, 
          hour: "2-digit", 
          minute: "2-digit", 
          second: "2-digit" 
        }),
        type: isEmergency ? "brake_event" : "near_miss",
        description: isEmergency 
          ? `Emergency brake @ ${pedestrianDistance.toFixed(1)}m` 
          : `Near miss avoidance @ ${pedestrianDistance.toFixed(1)}m`,
        responseTime: currentResponseTime
      };
      
      setSafetyEvents(prev => [...prev, newEvent].slice(-5));
      onSafetyEvent?.(newEvent);
    }
  }, [isBraking, isEmergency, pedestrianDistance, currentResponseTime, onSafetyEvent]);

  // Update rule compliance based on state
  useEffect(() => {
    setRuleCompliance({
      speedAdherence: !isEmergency,
      stopBehavior: isBraking || !isEmergency,
      safeDistance: pedestrianDistance > 10 || isBraking,
      signalCompliance: true
    });
  }, [isEmergency, isBraking, pedestrianDistance]);

  const complianceScore = Object.values(ruleCompliance).filter(Boolean).length;
  const compliancePercentage = (complianceScore / 4) * 100;

  return (
    <div className="glass-panel p-4 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingDown className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm text-primary cyber-glow-text">ANALYTICS & KPIs</h3>
      </div>

      {/* Decision Response Time */}
      <div className="p-3 rounded-lg bg-card/50 border border-border/30">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] text-muted-foreground uppercase">Decision Response Time</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <motion.span 
              className={`text-2xl font-mono font-bold ${
                currentResponseTime > 100 ? "text-accent" : 
                currentResponseTime > 60 ? "text-neon-yellow" : "text-neon-green"
              }`}
              animate={isEmergency ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3, repeat: isEmergency ? Infinity : 0 }}
            >
              {currentResponseTime}
            </motion.span>
            <span className="text-xs text-muted-foreground">ms</span>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-muted-foreground">AVG</div>
            <div className="text-sm font-mono text-primary">{avgResponseTime}ms</div>
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${Math.min(100, (currentResponseTime / 150) * 100)}%` }}
            className={`h-full ${
              currentResponseTime > 100 ? "bg-accent" : 
              currentResponseTime > 60 ? "bg-neon-yellow" : "bg-neon-green"
            }`}
          />
        </div>
        <div className="flex justify-between mt-1 text-[8px] text-muted-foreground">
          <span>0ms</span>
          <span>TARGET: &lt;100ms</span>
          <span>150ms</span>
        </div>
      </div>

      {/* Rule Compliance Status */}
      <div className="p-3 rounded-lg bg-card/50 border border-border/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
            <span className="text-[10px] text-muted-foreground uppercase">Rule Compliance</span>
          </div>
          <span className={`text-sm font-mono font-bold ${
            compliancePercentage === 100 ? "text-neon-green" : 
            compliancePercentage >= 75 ? "text-neon-yellow" : "text-accent"
          }`}>
            {compliancePercentage.toFixed(0)}%
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(ruleCompliance).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1.5">
              {value ? (
                <CheckCircle className="w-3 h-3 text-neon-green" />
              ) : (
                <XCircle className="w-3 h-3 text-accent" />
              )}
              <span className={`text-[9px] ${value ? "text-muted-foreground" : "text-accent"}`}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Event Log */}
      <div className="p-3 rounded-lg bg-card/50 border border-border/30">
        <div className="flex items-center gap-2 mb-2">
          <AlertOctagon className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] text-muted-foreground uppercase">Safety Event Log</span>
          <span className="ml-auto text-[9px] font-mono text-muted-foreground">
            {safetyEvents.length}/5
          </span>
        </div>
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          <AnimatePresence>
            {safetyEvents.length === 0 ? (
              <div className="text-[10px] text-muted-foreground text-center py-2">
                No safety events recorded
              </div>
            ) : (
              safetyEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-2 rounded text-[9px] font-mono border ${
                    event.type === "brake_event" 
                      ? "bg-accent/10 border-accent/30 text-accent" 
                      : "bg-neon-yellow/10 border-neon-yellow/30 text-neon-yellow"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-2.5 h-2.5" />
                    <span>[{event.timestamp}]</span>
                  </div>
                  <div className="mt-0.5">{event.description}</div>
                  <div className="mt-0.5 text-muted-foreground">
                    Response: {event.responseTime}ms
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SafetyAnalytics;
