import { motion } from "framer-motion";
import { 
  Cpu, 
  Radio, 
  Satellite, 
  Eye, 
  Thermometer, 
  Battery, 
  Wifi,
  HardDrive,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface SystemStatusProps {
  fogActive: boolean;
  emergencyMode: boolean;
}

const SystemStatus = ({ fogActive, emergencyMode }: SystemStatusProps) => {
  const systems = [
    { 
      name: "LIDAR", 
      icon: Radio, 
      status: fogActive ? "degraded" : "online", 
      value: fogActive ? 65 : 98 
    },
    { 
      name: "CAMERA", 
      icon: Eye, 
      status: fogActive ? "degraded" : "online", 
      value: fogActive ? 45 : 99 
    },
    { 
      name: "RADAR", 
      icon: Satellite, 
      status: "online", 
      value: 97 
    },
    { 
      name: "GPU", 
      icon: Cpu, 
      status: emergencyMode ? "high-load" : "online", 
      value: emergencyMode ? 89 : 62 
    },
    { 
      name: "NETWORK", 
      icon: Wifi, 
      status: "online", 
      value: 100 
    },
    { 
      name: "STORAGE", 
      icon: HardDrive, 
      status: "online", 
      value: 78 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-neon-green";
      case "degraded": return "text-neon-yellow";
      case "high-load": return "text-neon-orange";
      case "offline": return "text-neon-red";
      default: return "text-muted-foreground";
    }
  };

  const getValueColor = (value: number) => {
    if (value >= 90) return "bg-neon-green";
    if (value >= 70) return "bg-primary";
    if (value >= 50) return "bg-neon-yellow";
    return "bg-neon-red";
  };

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm text-primary cyber-glow-text">SYSTEM STATUS</h3>
        {(fogActive || emergencyMode) && (
          <AlertCircle className="w-3 h-3 text-neon-yellow ml-auto animate-pulse" />
        )}
      </div>

      <div className="space-y-2">
        {systems.map((system, index) => {
          const Icon = system.icon;
          
          return (
            <motion.div
              key={system.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2"
            >
              <Icon className={`w-3 h-3 ${getStatusColor(system.status)}`} />
              <span className="text-[10px] text-muted-foreground w-16">{system.name}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${system.value}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`h-full ${getValueColor(system.value)}`}
                />
              </div>
              <span className={`text-[10px] font-mono w-8 text-right ${getStatusColor(system.status)}`}>
                {system.value}%
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-3 border-t border-border/30 grid grid-cols-3 gap-2">
        <div className="text-center">
          <Battery className="w-3 h-3 text-neon-green mx-auto mb-1" />
          <div className="text-[9px] text-muted-foreground">POWER</div>
          <div className="text-xs font-mono text-neon-green">87%</div>
        </div>
        <div className="text-center">
          <Thermometer className="w-3 h-3 text-primary mx-auto mb-1" />
          <div className="text-[9px] text-muted-foreground">TEMP</div>
          <div className="text-xs font-mono text-primary">42°C</div>
        </div>
        <div className="text-center">
          <Cpu className="w-3 h-3 text-primary mx-auto mb-1" />
          <div className="text-[9px] text-muted-foreground">CORES</div>
          <div className="text-xs font-mono text-primary">8/8</div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
