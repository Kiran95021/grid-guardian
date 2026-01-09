import { motion } from "framer-motion";
import { PersonStanding, Cloud, Car, Zap, TriangleAlert, Activity } from "lucide-react";

interface ScenarioControlsProps {
  onJWalker: () => void;
  onFog: () => void;
  onTrafficSurge: () => void;
  fogActive: boolean;
  trafficActive: boolean;
  jWalkerActive: boolean;
}

const ScenarioControls = ({
  onJWalker,
  onFog,
  onTrafficSurge,
  fogActive,
  trafficActive,
  jWalkerActive,
}: ScenarioControlsProps) => {
  const scenarios = [
    {
      id: "jwalker",
      label: "Sudden J-Walker",
      description: "Emergency brake test",
      icon: PersonStanding,
      onClick: onJWalker,
      active: jWalkerActive,
      color: "neon-red",
    },
    {
      id: "fog",
      label: "Sensor Noise (Fog)",
      description: "Reduce visibility",
      icon: Cloud,
      onClick: onFog,
      active: fogActive,
      color: "neon-yellow",
    },
    {
      id: "traffic",
      label: "Traffic Surge",
      description: "Increase vehicles",
      icon: Car,
      onClick: onTrafficSurge,
      active: trafficActive,
      color: "neon-orange",
    },
  ];

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-accent" />
        <h3 className="font-display text-sm text-accent">INJECT CHAOS</h3>
        <TriangleAlert className="w-3 h-3 text-accent/50 ml-auto" />
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario, index) => {
          const Icon = scenario.icon;
          
          return (
            <motion.button
              key={scenario.id}
              onClick={scenario.onClick}
              disabled={scenario.id === "jwalker" && jWalkerActive}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-3 rounded-lg border transition-all duration-300 text-left flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                scenario.active
                  ? scenario.id === "jwalker" 
                    ? "border-neon-red/50 bg-neon-red/10 shadow-[0_0_15px_hsl(var(--neon-red)/0.3)]"
                    : scenario.id === "fog"
                      ? "border-neon-yellow/50 bg-neon-yellow/10 shadow-[0_0_15px_hsl(var(--neon-yellow)/0.3)]"
                      : "border-accent/50 bg-accent/10 shadow-[0_0_15px_hsl(var(--accent)/0.3)]"
                  : "border-border/30 bg-card/30 hover:border-primary/50 hover:bg-card/50"
              }`}
            >
              <div className={`p-2 rounded-lg ${
                scenario.active 
                  ? scenario.id === "jwalker" ? "bg-neon-red/20" 
                    : scenario.id === "fog" ? "bg-neon-yellow/20" : "bg-accent/20"
                  : "bg-muted/50"
              }`}>
                <Icon className={`w-5 h-5 ${
                  scenario.active 
                    ? scenario.id === "jwalker" ? "text-neon-red" 
                      : scenario.id === "fog" ? "text-neon-yellow" : "text-accent"
                    : "text-muted-foreground"
                }`} />
              </div>
              
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  scenario.active 
                    ? scenario.id === "jwalker" ? "text-neon-red" 
                      : scenario.id === "fog" ? "text-neon-yellow" : "text-accent"
                    : "text-foreground"
                }`}>
                  {scenario.label}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {scenario.description}
                </div>
              </div>

              {scenario.active && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    scenario.id === "jwalker" ? "bg-neon-red" 
                      : scenario.id === "fog" ? "bg-neon-yellow" : "bg-accent"
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Active Scenarios Counter */}
      <div className="mt-4 pt-3 border-t border-border/30">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">ACTIVE SCENARIOS</span>
          <span className="text-primary font-mono">
            {[fogActive, trafficActive, jWalkerActive].filter(Boolean).length}/3
          </span>
        </div>
        <div className="flex gap-1 mt-2">
          {[fogActive, trafficActive, jWalkerActive].map((active, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                active ? "bg-accent" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioControls;
