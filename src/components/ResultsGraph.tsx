import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateDisplayGraphData } from '../lib/vibe/interceptor';
import type { DisplayStats } from '../types';

interface ResultsGraphProps { 
  displayStats: DisplayStats; 
}

const ResultsGraph = ({ displayStats }: ResultsGraphProps) => {
  const graphData = generateDisplayGraphData(displayStats);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-panel border border-text2/20 rounded-lg p-3 shadow-tooltip">
          <p className="text-text2 text-sm">{`Time: ${Math.round(label)}s`}</p>
          <p className="text-accent text-sm">{`WPM: ${payload[0].value}`}</p>
          <p className="text-text2 text-sm">{`Raw: ${payload[1].value}`}</p>
          {payload[2]?.value > 0 && (
            <p className="text-error text-sm">{`Errors: ${payload[2].value}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={graphData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--tp-graph-grid)" 
          />
          <XAxis 
            dataKey="time" 
            stroke="var(--tp-text-2)" 
            fontSize={12} 
            tickFormatter={(value) => Math.round(value)}
          />
          <YAxis 
            stroke="var(--tp-text-2)" 
            fontSize={12} 
            domain={[0, 'dataMax + 20']} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="wpm" 
            stroke="var(--tp-graph-wpm)" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 4, fill: 'var(--tp-graph-wpm)' }} 
          />
          <Line 
            type="monotone" 
            dataKey="rawWpm" 
            stroke="var(--tp-graph-raw)" 
            strokeWidth={1} 
            dot={false} 
            activeDot={{ r: 3, fill: 'var(--tp-graph-raw)' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsGraph;
