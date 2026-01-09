import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Shield, Gauge, Route, Users } from "lucide-react";

interface PriorityMatrixProps {
  emergencyMode?: boolean;
  fogMode?: boolean;
  trafficSurge?: boolean;
}

const PriorityMatrix = ({ emergencyMode, fogMode, trafficSurge }: PriorityMatrixProps) => {
  // Updated categories based on research requirements
  const baseData = [
    { factor: "Safety Rigor", value: 95, fullMark: 100 },
    { factor: "Path Efficiency", value: 72, fullMark: 100 },
    { factor: "Rule Compliance", value: 88, fullMark: 100 },
    { factor: "Passenger Comfort", value: 65, fullMark: 100 },
  ];

  // Adjust values based on active scenarios
  const data = baseData.map((item) => {
    let value = item.value;
    
    if (emergencyMode) {
      if (item.factor === "Safety Rigor") value = 100;
      if (item.factor === "Path Efficiency") value = 30;
      if (item.factor === "Passenger Comfort") value = 20;
    }
    
    if (fogMode) {
      if (item.factor === "Safety Rigor") value = Math.min(value, 85);
      if (item.factor === "Path Efficiency") value = Math.min(value, 50);
    }
    
    if (trafficSurge) {
      if (item.factor === "Path Efficiency") value = Math.max(value, 85);
      if (item.factor === "Passenger Comfort") value = Math.min(value, 45);
    }
    
    return { ...item, value };
  });

  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case "Safety Rigor": return Shield;
      case "Path Efficiency": return Route;
      case "Rule Compliance": return Gauge;
      case "Passenger Comfort": return Users;
      default: return Shield;
    }
  };

  const getFactorKey = (factor: string) => {
    return factor.toLowerCase().replace(" ", "-");
  };

  return (
    <div className="glass-panel p-4 h-full flex flex-col">
      <h3 className="font-display text-sm text-primary cyber-glow-text mb-4">PRIORITY MATRIX</h3>
      
      {/* Radar Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid 
              stroke="hsl(200 50% 20%)" 
              strokeDasharray="3 3"
            />
            <PolarAngleAxis 
              dataKey="factor" 
              tick={{ fill: "hsl(200 100% 95%)", fontSize: 9, fontFamily: "JetBrains Mono" }}
            />
            <PolarRadiusAxis 
              angle={45} 
              domain={[0, 100]} 
              tick={{ fill: "hsl(200 20% 55%)", fontSize: 8 }}
              axisLine={false}
            />
            <Radar
              name="Priority"
              dataKey="value"
              stroke="hsl(195 100% 50%)"
              fill="hsl(195 100% 50%)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Factor Details */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {data.map((item) => {
          const Icon = getFactorIcon(item.factor);
          const isHighPriority = item.value >= 80;
          const isLowPriority = item.value < 50;
          
          return (
            <motion.div
              key={item.factor}
              className={`flex items-center gap-2 p-2 rounded-lg border backdrop-blur-sm ${
                isHighPriority 
                  ? "border-neon-green/30 bg-neon-green/5" 
                  : isLowPriority 
                    ? "border-accent/30 bg-accent/5"
                    : "border-border/20 bg-card/30"
              }`}
              animate={{ scale: emergencyMode && item.factor === "Safety Rigor" ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.5, repeat: emergencyMode && item.factor === "Safety Rigor" ? Infinity : 0 }}
            >
              <Icon className={`w-3 h-3 ${
                isHighPriority ? "text-neon-green" : isLowPriority ? "text-accent" : "text-primary"
              }`} />
              <div className="flex-1 min-w-0">
                <div className="text-[8px] text-muted-foreground uppercase truncate">{item.factor}</div>
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${
                        isHighPriority ? "bg-neon-green" : isLowPriority ? "bg-accent" : "bg-primary"
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-mono ${
                    isHighPriority ? "text-neon-green" : isLowPriority ? "text-accent" : "text-primary"
                  }`}>
                    {item.value}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Status indicator */}
      {emergencyMode && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-2 bg-accent/10 border border-accent/30 rounded-lg text-center"
        >
          <span className="text-[10px] text-accent font-mono blink-alert">
            ⚠ SAFETY OVERRIDE ACTIVE
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default PriorityMatrix;
