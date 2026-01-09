import { motion } from "framer-motion";
import { Car, MapPin, Clock, Navigation, Shield, Gauge } from "lucide-react";

interface MissionHeaderProps {
  emergencyMode: boolean;
}

const MissionHeader = ({ emergencyMode }: MissionHeaderProps) => {
  const currentTime = new Date().toLocaleTimeString("en-US", { 
    hour12: false, 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit" 
  });

  return (
    <header className="glass-panel p-4">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative"
            animate={emergencyMode ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: emergencyMode ? Infinity : 0 }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              emergencyMode 
                ? "bg-neon-red/20 border border-neon-red/50" 
                : "bg-primary/20 border border-primary/50"
            } cyber-glow`}>
              <Car className={`w-6 h-6 ${emergencyMode ? "text-neon-red" : "text-primary"}`} />
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              emergencyMode ? "bg-neon-red blink-alert" : "bg-neon-green"
            } animate-pulse`} />
          </motion.div>
          
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl font-black tracking-wider">
                <span className="text-gradient-cyber">Urban</span>
                <span className="text-foreground">Drive</span>
                <span className="text-accent ml-2">AI</span>
              </h1>
              {/* Live Pulse Indicator */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-neon-green/10 border border-neon-green/30">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-neon-green"
                />
                <span className="text-[10px] font-mono text-neon-green uppercase tracking-wider">Live</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              SMART AUTONOMOUS VEHICLE SIMULATOR
            </p>
          </div>
        </div>

        {/* Mission Info */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground">ROUTE</div>
              <div className="font-mono text-foreground">SF-101-URBAN</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4 text-neon-green" />
            <div>
              <div className="text-[10px] text-muted-foreground">DESTINATION</div>
              <div className="font-mono text-foreground">2.4 MI</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground">SPEED</div>
              <div className="font-mono text-foreground">32 MPH</div>
            </div>
          </div>
        </div>

        {/* Status & Time */}
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1.5 rounded-lg border ${
            emergencyMode 
              ? "bg-neon-red/10 border-neon-red/50 text-neon-red blink-alert" 
              : "bg-neon-green/10 border-neon-green/50 text-neon-green"
          }`}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-mono font-medium">
                {emergencyMode ? "EMERGENCY" : "AUTONOMOUS"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-[10px]">SYSTEM TIME</span>
            </div>
            <div className="font-mono text-lg text-primary cyber-glow-text">
              {currentTime}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MissionHeader;
