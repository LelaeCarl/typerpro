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
        <div className="bg-surface-panel border border-text-secondary/20 rounded-lg p-3 shadow-tooltip">
          <p className="text-text-secondary text-sm">{`Time: ${Math.round(label)}s`}</p>
          <p className="text-accent-yellow text-sm">{`WPM: ${payload[0].value}`}</p>
          <p className="text-text-secondary text-sm">{`Raw: ${payload[1].value}`}</p>
          {payload[2]?.value > 0 && (
            <p className="text-semantic-error text-sm">{`Errors: ${payload[2].value}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis 
            dataKey="time" 
            stroke="#424446"
            fontSize={12}
            tickFormatter={(value) => Math.round(value)}
          />
          <YAxis 
            stroke="#424446"
            fontSize={12}
            domain={[0, 'dataMax + 20']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="wpm" 
            stroke="#5a5951" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#5a5951' }}
          />
          <Line 
            type="monotone" 
            dataKey="rawWpm" 
            stroke="#424446" 
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 3, fill: '#424446' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsGraph;
