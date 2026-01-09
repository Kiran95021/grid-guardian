import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Clock } from "lucide-react";

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

  useEffect(() => {
    // Initialize with some data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}s`,
      response: 40 + Math.random() * 30,
      threshold: 100,
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData((prev) => {
        const newPoint = {
          time: `${prev.length}s`,
          response: 40 + Math.random() * 30,
          threshold: 100,
        };
        const newData = [...prev.slice(-19), newPoint];
        
        // Calculate stats
        const avg = newData.reduce((a, b) => a + b.response, 0) / newData.length;
        setAvgResponse(Math.round(avg));
        setPeakResponse(Math.round(Math.max(...newData.map((d) => d.response))));
        
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Spike on obstacle detection
  useEffect(() => {
    if (obstacleDetected) {
      setData((prev) => {
        const spikeData = prev.map((d, i) => ({
          ...d,
          response: i === prev.length - 1 ? 180 : d.response,
        }));
        setPeakResponse(180);
        return spikeData;
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
          <Activity className={`w-4 h-4 ${isCritical ? "text-neon-red" : isWarning ? "text-neon-yellow" : "text-primary"}`} />
          <h3 className="font-display text-sm text-primary cyber-glow-text">RESPONSE TIME</h3>
        </div>
        <div className={`text-xs font-mono px-2 py-0.5 rounded ${
          isCritical ? "bg-neon-red/20 text-neon-red" : 
          isWarning ? "bg-neon-yellow/20 text-neon-yellow" : 
          "bg-neon-green/20 text-neon-green"
        }`}>
          {currentResponse.toFixed(0)}ms
        </div>
      </div>

      {/* Graph */}
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
              stroke="hsl(0 85% 55%)" 
              strokeDasharray="5 5" 
              strokeOpacity={0.5}
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
              isCritical ? "text-neon-red" : isWarning ? "text-neon-yellow" : "text-neon-green"
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
          <div className={`text-sm font-mono ${peakResponse > 100 ? "text-neon-red" : "text-neon-yellow"}`}>
            {peakResponse}ms
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-[9px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-0.5 bg-neon-red/50" style={{ borderStyle: "dashed" }} />
          <span>Critical (100ms)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-0.5 bg-neon-yellow/30" />
          <span>Warning (80ms)</span>
        </div>
      </div>
    </div>
  );
};

export default ResponseTimeGraph;
