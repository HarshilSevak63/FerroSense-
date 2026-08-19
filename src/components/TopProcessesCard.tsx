import React from 'react';
import { ProcessItem } from '../types/stats';

interface TopProcessesCardProps {
  processes: ProcessItem[];
}

export const TopProcessesCard: React.FC<TopProcessesCardProps> = ({ processes }) => {
  return (
    <div className="stat-card">
      <div className="card-header">
        <div className="header-left">
          <span className="card-icon" role="img" aria-label="task">⚡</span>
          <div>
            <h3>Top Active Tasks</h3>
            <p className="card-subtitle">Resource Hog Processes</p>
          </div>
        </div>
        <span className="badge badge-active-count">{processes.length} Processes</span>
      </div>

      <div className="process-list">
        {processes.map((p) => {
          const isHighCpu = p.cpu_usage > 10;
          return (
            <div key={p.pid} className="process-item-row" title={`PID ${p.pid}: ${p.name}`}>
              <div className="process-info-col">
                <span className="process-name">{p.name}</span>
                <span className="process-pid">PID {p.pid}</span>
              </div>

              <div className="process-bars-col">
                <div className="process-bar-metric">
                  <span className="proc-bar-label">CPU</span>
                  <div className="proc-bar-track">
                    <div
                      className={`proc-bar-fill ${isHighCpu ? 'proc-bar-cpu-high' : 'proc-bar-cpu'}`}
                      style={{ width: `${Math.min(100, Math.max(5, p.cpu_usage * 3))}%` }}
                    />
                  </div>
                  <span className="proc-bar-val">{p.cpu_usage.toFixed(1)}%</span>
                </div>

                <div className="process-bar-metric">
                  <span className="proc-bar-label">RAM</span>
                  <div className="proc-bar-track">
                    <div
                      className="proc-bar-fill proc-bar-ram"
                      style={{ width: `${Math.min(100, Math.max(5, p.memory_pct * 8))}%` }}
                    />
                  </div>
                  <span className="proc-bar-val">{p.memory_mb.toFixed(0)} MB</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="process-footer">
        <span>Active Memory Slices</span>
        <strong>Real-time Windows Probes</strong>
      </div>
    </div>
  );
};
