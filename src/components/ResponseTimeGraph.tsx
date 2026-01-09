import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface ResponseTimeGraphProps {
  obstacleDetected?: boolean;
}

interface DataPoint {
  time: string;
  response: number;
  threshold: number;
}

const ResponseTimeGraph = ({ obstacleDetected }: ResponseTimeGraphProps) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [avgResponse, setAvgResponse] = useState(45);
  const [peakResponse, setPeakResponse] = useState(65);
  const [heartbeatPhase, setHeartbeatPhase] = useState(0);

  useEffect(() => {
    // Initialize with some data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}s`,
      response: 40 + Math.random() * 30,
      threshold: 100,
    }));
    setData(initialData);

    // Live heartbeat update - faster interval for smooth animation
    const interval = setInterval(() => {
      setHeartbeatPhase((prev) => (prev + 1) % 100);
      
      setData((prev) => {
        // Create heartbeat-style pattern
        const phase = (Date.now() / 100) % 20;
        let heartbeatValue = 45;
        
        // Simulate heartbeat pattern
        if (phase < 2) {
          heartbeatValue = 45 + (phase * 15); // Rising
        } else if (phase < 4) {
          heartbeatValue = 75 - ((phase - 2) * 20); // Falling sharply
        } else if (phase < 6) {
          heartbeatValue = 35 + ((phase - 4) * 10); // Small rise
        } else if (phase < 8) {
          heartbeatValue = 55 - ((phase - 6) * 5); // Gentle fall
        } else {
          heartbeatValue = 45 + Math.sin(phase * 0.5) * 5; // Baseline with slight variation
        }
        
        // Add some noise
        heartbeatValue += (Math.random() - 0.5) * 10;
        heartbeatValue = Math.max(30, Math.min(90, heartbeatValue));
        
        const newPoint = {
          time: `${prev.length}s`,
          response: heartbeatValue,
          threshold: 100,
        };
        const newData = [...prev.slice(-19), newPoint];
        
        // Calculate stats
        const avg = newData.reduce((a, b) => a + b.response, 0) / newData.length;
        setAvgResponse(Math.round(avg));
        setPeakResponse(Math.round(Math.max(...newData.map((d) => d.response))));
        
        return newData;
      });
    }, 150); // Faster updates for smooth heartbeat

    return () => clearInterval(interval);
  }, []);

  // Spike on obstacle detection
  useEffect(() => {
    if (obstacleDetected) {
      setData((prev) => {
        const spikeData = [...prev];
        // Add multiple spike points for dramatic effect
        for (let i = 0; i < 3; i++) {
          spikeData.push({
            time: `${prev.length + i}s`,
            response: 160 + Math.random() * 40,
            threshold: 100,
          });
        }
        setPeakResponse(180);
        return spikeData.slice(-20);
      });
    }
  }, [obstacleDetected]);

  const currentResponse = data[data.length - 1]?.response || 0;
  const isWarning = currentResponse > 80;
  const isCritical = currentResponse > 120;

  return (
    <div className="glass-panel p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Activity className={`w-4 h-4 ${isCritical ? "text-accent" : isWarning ? "text-neon-yellow" : "text-primary"}`} />
          </motion.div>
          <h3 className="font-display text-sm text-primary cyber-glow-text">RESPONSE TIME</h3>
        </div>
        <motion.div 
          className={`text-xs font-mono px-2 py-0.5 rounded ${
            isCritical ? "bg-accent/20 text-accent" : 
            isWarning ? "bg-neon-yellow/20 text-neon-yellow" : 
            "bg-neon-green/20 text-neon-green"
          }`}
          animate={{ scale: isCritical ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.3, repeat: isCritical ? Infinity : 0 }}
        >
          {currentResponse.toFixed(0)}ms
        </motion.div>
      </div>

      {/* Graph with live heartbeat */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis 
              dataKey="time" 
              tick={{ fill: "hsl(200 20% 55%)", fontSize: 8 }}
              axisLine={{ stroke: "hsl(200 50% 20%)" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[0, 200]}
              tick={{ fill: "hsl(200 20% 55%)", fontSize: 8 }}
              axisLine={{ stroke: "hsl(200 50% 20%)" }}
              tickLine={false}
            />
            <ReferenceLine 
              y={100} 
              stroke="hsl(25 100% 55%)" 
              strokeDasharray="5 5" 
              strokeOpacity={0.5}
              label={{ value: "CRITICAL", fill: "hsl(25 100% 55%)", fontSize: 8, position: "right" }}
            />
            <ReferenceLine 
              y={80} 
              stroke="hsl(45 100% 50%)" 
              strokeDasharray="3 3" 
              strokeOpacity={0.3}
            />
            <Line
              type="monotone"
              dataKey="response"
              stroke="hsl(195 100% 50%)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              style={{
                filter: "drop-shadow(0 0 3px hsl(195 100% 50% / 0.5))"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/30">
        <div className="text-center">
          <div className="text-[9px] text-muted-foreground uppercase">Current</div>
          <motion.div 
            className={`text-sm font-mono ${
              isCritical ? "text-accent" : isWarning ? "text-neon-yellow" : "text-neon-green"
            }`}
            animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3, repeat: isCritical ? Infinity : 0 }}
          >
            {currentResponse.toFixed(0)}ms
          </motion.div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-muted-foreground uppercase">Average</div>
          <div className="text-sm font-mono text-primary">{avgResponse}ms</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-muted-foreground uppercase">Peak</div>
          <div className={`text-sm font-mono ${peakResponse > 100 ? "text-accent" : "text-neon-yellow"}`}>
            {peakResponse}ms
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-[9px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-accent/50" style={{ borderStyle: "dashed" }} />
          <span>Critical (100ms)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-neon-yellow/30" />
          <span>Warning (80ms)</span>
        </div>
      </div>
    </div>
  );
};

export default ResponseTimeGraph;
