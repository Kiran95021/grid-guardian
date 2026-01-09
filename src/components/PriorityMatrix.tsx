import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Shield, Gauge, Route, Users } from "lucide-react";

interface PriorityMatrixProps {
  emergencyMode?: boolean;
  fogMode?: boolean;
  trafficSurge?: boolean;
}

const PriorityMatrix = ({ emergencyMode, fogMode, trafficSurge }: PriorityMatrixProps) => {
  const baseData = [
    { factor: "Safety", value: 95, fullMark: 100 },
    { factor: "Compliance", value: 88, fullMark: 100 },
    { factor: "Efficiency", value: 72, fullMark: 100 },
    { factor: "Comfort", value: 65, fullMark: 100 },
  ];

  // Adjust values based on active scenarios
  const data = baseData.map((item) => {
    let value = item.value;
    
    if (emergencyMode) {
      if (item.factor === "Safety") value = 100;
      if (item.factor === "Efficiency") value = 30;
      if (item.factor === "Comfort") value = 20;
    }
    
    if (fogMode) {
      if (item.factor === "Safety") value = Math.min(value, 85);
      if (item.factor === "Efficiency") value = Math.min(value, 50);
    }
    
    if (trafficSurge) {
      if (item.factor === "Efficiency") value = Math.max(value, 85);
      if (item.factor === "Comfort") value = Math.min(value, 45);
    }
    
    return { ...item, value };
  });

  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case "Safety": return Shield;
      case "Compliance": return Gauge;
      case "Efficiency": return Route;
      case "Comfort": return Users;
      default: return Shield;
    }
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
              tick={{ fill: "hsl(200 100% 95%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            />
            <PolarRadiusAxis 
              angle={30} 
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
              className={`flex items-center gap-2 p-2 rounded border ${
                isHighPriority 
                  ? "border-neon-green/30 bg-neon-green/5" 
                  : isLowPriority 
                    ? "border-neon-yellow/30 bg-neon-yellow/5"
                    : "border-border/20 bg-card/30"
              }`}
              animate={{ scale: emergencyMode && item.factor === "Safety" ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.5, repeat: emergencyMode && item.factor === "Safety" ? Infinity : 0 }}
            >
              <Icon className={`w-3 h-3 ${
                isHighPriority ? "text-neon-green" : isLowPriority ? "text-neon-yellow" : "text-primary"
              }`} />
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-muted-foreground uppercase">{item.factor}</div>
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${
                        isHighPriority ? "bg-neon-green" : isLowPriority ? "bg-neon-yellow" : "bg-primary"
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-mono ${
                    isHighPriority ? "text-neon-green" : isLowPriority ? "text-neon-yellow" : "text-primary"
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
          className="mt-3 p-2 bg-neon-red/10 border border-neon-red/30 rounded text-center"
        >
          <span className="text-[10px] text-neon-red font-mono blink-alert">
            ⚠ SAFETY OVERRIDE ACTIVE
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default PriorityMatrix;
