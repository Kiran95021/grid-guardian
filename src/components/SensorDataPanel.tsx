import { motion } from "framer-motion";
import { Eye, Ruler, TrendingDown, Clock, Radio } from "lucide-react";
import type { SensorData } from "@/hooks/useSimulationEngine";

interface SensorDataPanelProps {
  sensors: SensorData;
  isActive: boolean;
}

const SensorDataPanel = ({ sensors, isActive }: SensorDataPanelProps) => {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm text-primary cyber-glow-text">SENSOR DATA</h3>
        <motion.div
          className="ml-auto w-2 h-2 rounded-full bg-neon-green"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      <div className="space-y-3">
        {/* Pedestrian Detection */}
        <div className={`p-3 rounded-lg border ${
          sensors.pedestrianDetected 
            ? "bg-accent/20 border-accent/50" 
            : "bg-card/50 border-border/30"
        }`}>
          <div className="flex items-center gap-2">
            <Eye className={`w-4 h-4 ${sensors.pedestrianDetected ? "text-accent" : "text-muted-foreground"}`} />
            <div className="flex-1">
              <div className="text-[10px] text-muted-foreground uppercase">Pedestrian Detection</div>
              <div className={`font-mono text-sm font-bold ${
                sensors.pedestrianDetected ? "text-accent" : "text-neon-green"
              }`}>
                {sensors.pedestrianDetected ? "DETECTED" : "CLEAR"}
              </div>
            </div>
            {sensors.pedestrianDetected && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-accent"
              />
            )}
          </div>
        </div>

        {/* Distance */}
        <div className="p-3 rounded-lg bg-card/50 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="w-3 h-3 text-neon-yellow" />
            <span className="text-[10px] text-muted-foreground uppercase">Distance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                animate={{ 
                  width: `${Math.min(100, Math.max(0, 100 - (sensors.distanceToPedestrian / 50) * 100))}%` 
                }}
                className={`h-full ${
                  sensors.distanceToPedestrian < 15 ? "bg-accent" : 
                  sensors.distanceToPedestrian < 25 ? "bg-neon-yellow" : "bg-neon-green"
                }`}
              />
            </div>
            <span className={`font-mono text-sm font-bold min-w-[4rem] text-right ${
              sensors.distanceToPedestrian < 15 ? "text-accent" : "text-foreground"
            }`}>
              {sensors.distanceToPedestrian > 100 ? "—" : `${sensors.distanceToPedestrian.toFixed(1)}m`}
            </span>
          </div>
        </div>

        {/* Relative Speed */}
        <div className="p-3 rounded-lg bg-card/50 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase">Relative Speed</span>
          </div>
          <div className="font-mono text-sm font-bold text-foreground">
            {sensors.relativeSpeed.toFixed(1)} m/s
            <span className="text-xs text-muted-foreground ml-1">
              ({(sensors.relativeSpeed * 3.6).toFixed(1)} km/h)
            </span>
          </div>
        </div>

        {/* Time to Collision */}
        <div className={`p-3 rounded-lg border ${
          sensors.timeToCollision < 2 
            ? "bg-accent/20 border-accent/50" 
            : sensors.timeToCollision < 4 
              ? "bg-neon-yellow/20 border-neon-yellow/50"
              : "bg-card/50 border-border/30"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className={`w-3 h-3 ${
              sensors.timeToCollision < 2 ? "text-accent" : "text-neon-yellow"
            }`} />
            <span className="text-[10px] text-muted-foreground uppercase">Time to Collision</span>
          </div>
          <div className={`font-mono text-lg font-bold ${
            sensors.timeToCollision < 2 ? "text-accent" : 
            sensors.timeToCollision < 4 ? "text-neon-yellow" : "text-foreground"
          }`}>
            {sensors.timeToCollision > 100 ? "∞" : `${sensors.timeToCollision.toFixed(2)}s`}
          </div>
        </div>

        {/* Sensor Confidence */}
        <div className="p-3 rounded-lg bg-card/50 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground uppercase">Sensor Confidence</span>
            <span className="font-mono text-xs text-neon-green">{sensors.sensorConfidence}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-neon-green"
              style={{ width: `${sensors.sensorConfidence}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDataPanel;
