import { motion } from "framer-motion";
import { Shield, Route, Scale, Users } from "lucide-react";

interface PriorityIndicatorProps {
  emergencyMode: boolean;
  fogActive: boolean;
  pedestrianDetected: boolean;
}

const PriorityIndicator = ({ emergencyMode, fogActive, pedestrianDetected }: PriorityIndicatorProps) => {
  // Dynamic priority values based on current state
  const priorities = [
    {
      name: "Safety",
      icon: Shield,
      // Safety is always highest priority, especially in emergency
      value: emergencyMode ? 100 : pedestrianDetected ? 95 : 85,
      color: "accent"
    },
    {
      name: "Rules",
      icon: Scale,
      // Rule compliance high when following procedures
      value: emergencyMode ? 90 : fogActive ? 80 : 88,
      color: "primary"
    },
    {
      name: "Efficiency",
      icon: Route,
      // Efficiency drops during emergency or fog
      value: emergencyMode ? 30 : fogActive ? 50 : 75,
      color: "neon-green"
    },
    {
      name: "Comfort",
      icon: Users,
      // Comfort drops significantly during emergency braking
      value: emergencyMode ? 20 : fogActive ? 60 : 82,
      color: "neon-yellow"
    }
  ];

  const getColorClass = (color: string, type: "text" | "bg" | "border") => {
    const colorMap: Record<string, Record<string, string>> = {
      accent: { text: "text-accent", bg: "bg-accent", border: "border-accent" },
      primary: { text: "text-primary", bg: "bg-primary", border: "border-primary" },
      "neon-green": { text: "text-neon-green", bg: "bg-neon-green", border: "border-neon-green" },
      "neon-yellow": { text: "text-neon-yellow", bg: "bg-neon-yellow", border: "border-neon-yellow" }
    };
    return colorMap[color]?.[type] || "";
  };

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-xs text-primary cyber-glow-text">PRIORITY INDICATOR</h3>
        {emergencyMode && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="px-2 py-0.5 bg-accent/20 border border-accent/50 rounded text-[8px] font-mono text-accent"
          >
            EMERGENCY
          </motion.div>
        )}
      </div>

      <div className="space-y-3">
        {priorities.map((priority, index) => {
          const Icon = priority.icon;
          const isHighPriority = priority.value >= 85;
          
          return (
            <motion.div
              key={priority.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${getColorClass(priority.color, "text")}`} />
                  <span className="text-[10px] text-muted-foreground uppercase">{priority.name}</span>
                </div>
                <motion.span 
                  className={`text-xs font-mono font-bold ${getColorClass(priority.color, "text")}`}
                  animate={isHighPriority && emergencyMode ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3, repeat: isHighPriority && emergencyMode ? Infinity : 0 }}
                >
                  {priority.value}%
                </motion.span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${priority.value}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full ${getColorClass(priority.color, "bg")} ${
                    isHighPriority ? "opacity-100" : "opacity-70"
                  }`}
                  style={{
                    boxShadow: isHighPriority ? `0 0 8px hsl(var(--${priority.color}))` : "none"
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Status Summary */}
      <div className="mt-4 pt-3 border-t border-border/30">
        <div className={`p-2 rounded text-center text-[10px] font-mono ${
          emergencyMode 
            ? "bg-accent/10 border border-accent/30 text-accent" 
            : "bg-neon-green/10 border border-neon-green/30 text-neon-green"
        }`}>
          {emergencyMode 
            ? "⚠ SAFETY OVERRIDE ACTIVE" 
            : "✓ BALANCED OPERATION MODE"
          }
        </div>
      </div>
    </div>
  );
};

export default PriorityIndicator;
