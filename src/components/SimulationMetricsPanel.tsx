import { motion } from "framer-motion";
import { Gauge, Clock, AlertTriangle, Activity, Shield, Zap } from "lucide-react";
import type { SimulationMetrics, DecisionState } from "@/hooks/useSimulationEngine";

interface SimulationMetricsPanelProps {
  metrics: SimulationMetrics;
  decision: DecisionState;
}

const SimulationMetricsPanel = ({ metrics, decision }: SimulationMetricsPanelProps) => {
  const getStatusColor = (status: "SAFE" | "WARNING" | "CRITICAL") => {
    switch (status) {
      case "SAFE": return "text-neon-green";
      case "WARNING": return "text-neon-yellow";
      case "CRITICAL": return "text-accent";
    }
  };

  const getStatusBg = (status: "SAFE" | "WARNING" | "CRITICAL") => {
    switch (status) {
      case "SAFE": return "bg-neon-green/20 border-neon-green/50";
      case "WARNING": return "bg-neon-yellow/20 border-neon-yellow/50";
      case "CRITICAL": return "bg-accent/20 border-accent/50";
    }
  };

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm text-primary cyber-glow-text">REAL-TIME METRICS</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Vehicle Speed */}
        <div className="p-3 rounded-lg bg-card/50 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase">Speed</span>
          </div>
          <div className="font-mono text-xl font-bold text-foreground">
            {(metrics.vehicleSpeed * 3.6).toFixed(1)}
            <span className="text-xs text-muted-foreground ml-1">km/h</span>
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {metrics.vehicleSpeed.toFixed(1)} m/s
          </div>
        </div>

        {/* Time to Collision */}
        <div className={`p-3 rounded-lg border ${
          metrics.timeToCollision < 2 
            ? "bg-accent/20 border-accent/50" 
            : metrics.timeToCollision < 4 
              ? "bg-neon-yellow/20 border-neon-yellow/50"
              : "bg-card/50 border-border/30"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3 text-neon-yellow" />
            <span className="text-[10px] text-muted-foreground uppercase">Time to Collision</span>
          </div>
          <div className={`font-mono text-xl font-bold ${
            metrics.timeToCollision < 2 ? "text-accent" : 
            metrics.timeToCollision < 4 ? "text-neon-yellow" : "text-foreground"
          }`}>
            {metrics.timeToCollision > 100 ? "—" : metrics.timeToCollision.toFixed(1)}
            <span className="text-xs text-muted-foreground ml-1">sec</span>
          </div>
        </div>

        {/* Reaction Time */}
        <div className="p-3 rounded-lg bg-card/50 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3 h-3 text-neon-green" />
            <span className="text-[10px] text-muted-foreground uppercase">Reaction Time</span>
          </div>
          <div className="font-mono text-xl font-bold text-neon-green">
            {metrics.reactionTime > 0 ? metrics.reactionTime.toFixed(2) : "—"}
            <span className="text-xs text-muted-foreground ml-1">sec</span>
          </div>
        </div>

        {/* Emergency Brakes */}
        <div className="p-3 rounded-lg bg-card/50 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3 h-3 text-accent" />
            <span className="text-[10px] text-muted-foreground uppercase">E-Brakes</span>
          </div>
          <div className="font-mono text-xl font-bold text-foreground">
            {metrics.emergencyBrakes}
            <span className="text-xs text-muted-foreground ml-1">total</span>
          </div>
        </div>
      </div>

      {/* Safety Status */}
      <motion.div 
        className={`mt-4 p-3 rounded-lg border ${getStatusBg(metrics.safetyStatus)}`}
        animate={metrics.safetyStatus === "CRITICAL" ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.3, repeat: metrics.safetyStatus === "CRITICAL" ? Infinity : 0 }}
      >
        <div className="flex items-center gap-2">
          <Shield className={`w-5 h-5 ${getStatusColor(metrics.safetyStatus)}`} />
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Safety Status</div>
            <div className={`font-mono text-lg font-bold ${getStatusColor(metrics.safetyStatus)}`}>
              {metrics.safetyStatus}
            </div>
          </div>
          {metrics.safetyStatus === "CRITICAL" && (
            <motion.div
              className="ml-auto"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <AlertTriangle className="w-5 h-5 text-accent" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Current Decision */}
      <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
        <div className="text-[10px] text-muted-foreground uppercase mb-1">Current Action</div>
        <div className={`font-mono text-sm font-bold ${
          decision.action === "BRAKING" ? "text-accent" : 
          decision.action === "SLOW_DOWN" ? "text-neon-yellow" : "text-neon-green"
        }`}>
          {decision.action}
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">
          Collision Risk: {decision.collisionProbability.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default SimulationMetricsPanel;
