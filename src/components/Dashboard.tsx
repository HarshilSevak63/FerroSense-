import React from 'react';
import { SystemStats } from '../types/stats';
import { RadialGauge } from './RadialGauge';
import { LinearGauge } from './LinearGauge';
import { BatteryGauge } from './BatteryGauge';
import { GpuCard } from './GpuCard';
import { ThermalFanCard } from './ThermalFanCard';
import { NetworkCard } from './NetworkCard';
import { TopProcessesCard } from './TopProcessesCard';
import { Sparkline } from './Sparkline';

interface DashboardProps {
  stats: SystemStats;
  cpuHistory?: number[];
  gpuHistory?: number[];
  dlHistory?: number[];
  ulHistory?: number[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  cpuHistory = [],
  gpuHistory = [],
  dlHistory = [],
  ulHistory = [],
}) => {
  const cpuGhz = stats.cpu_ghz ?? 2.4;
  const powerPlan = stats.power_plan ?? 'Balanced';

  return (
    <div className="dashboard-grid">
      {/* 1. CPU Processor Card with GHz Clock & Power Plan (Feature #2) */}
      <div className="stat-card">
        <div className="card-header">
          <div className="header-left">
            <span className="card-icon" role="img" aria-label="cpu">🧠</span>
            <div>
              <h3>Processor</h3>
              <p className="card-subtitle">{stats.cpu_brand}</p>
            </div>
          </div>
          <div className="header-right">
            <span className="badge badge-ghz" title="Current CPU Clock Frequency">
              ⚡ {cpuGhz.toFixed(2)} GHz
            </span>
            <span className="badge badge-temp">
              <span className="badge-icon">🌡️</span> {stats.cpu_temp}°C
            </span>
          </div>
        </div>

        <div className="gauge-container">
          <RadialGauge
            value={stats.cpu_usage}
            unit="%"
            label="TOTAL LOAD"
            sublabel={`${cpuGhz.toFixed(2)} GHz • ${stats.cpu_temp}°C`}
          />
        </div>

        <div className="sparkline-row">
          <div className="sparkline-label-group">
            <span className="spark-title">REAL-TIME TREND (60S)</span>
            <span className="spark-curr-val">{stats.cpu_usage.toFixed(1)}%</span>
          </div>
          <div className="sparkline-right-group">
            <span className="power-plan-badge" title="Active Windows Power Plan">
              🛡️ {powerPlan}
            </span>
            <Sparkline data={cpuHistory} width={130} height={26} color="var(--accent-primary)" />
          </div>
        </div>

        <div className="cores-section">
          <div className="cores-header">
            <span>CORE DISTRIBUTION ({stats.cpu_cores.length} CORES):</span>
          </div>
          <div className="cores-grid">
            {stats.cpu_cores.map((usage, idx) => (
              <div key={idx} className="core-bar-wrapper" title={`Core #${idx + 1}: ${usage}%`}>
                <div
                  className={`core-bar-fill ${usage > 85 ? 'core-high' : usage > 50 ? 'core-mid' : ''}`}
                  style={{ width: `${Math.max(8, usage)}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Dedicated GPU Card */}
      <GpuCard
        has_gpu={stats.has_gpu}
        gpu_name={stats.gpu_name}
        gpu_usage={stats.gpu_usage}
        gpu_temp={stats.gpu_temp}
        gpu_vram_used_gb={stats.gpu_vram_used_gb}
        gpu_vram_total_gb={stats.gpu_vram_total_gb}
        gpuHistory={gpuHistory}
      />

      {/* 3. Thermals & Fan Deck (NitroSense) */}
      <ThermalFanCard
        cpuTemp={stats.cpu_temp}
        gpuTemp={stats.gpu_temp ?? 45}
        fanCpuRpm={stats.fan_cpu_rpm}
        fanGpuRpm={stats.fan_gpu_rpm}
        fanMode={(stats.fan_mode as any) || 'Auto'}
      />

      {/* 4. Network Card (Feature #1) */}
      <NetworkCard
        downloadMbps={stats.net_download_mbps || 0}
        uploadMbps={stats.net_upload_mbps || 0}
        adapterName={stats.net_adapter_name || 'Wi-Fi 6 Adapter'}
        linkSpeed={stats.net_link_speed || '1.2 Gbps'}
        pingMs={stats.net_ping_ms || 20}
        totalDownloadGb={stats.net_total_download_gb || 0}
        totalUploadGb={stats.net_total_upload_gb || 0}
        downloadHistory={dlHistory}
        uploadHistory={ulHistory}
      />

      {/* 5. Top 5 Resource Hog Processes (Feature #3) */}
      <TopProcessesCard processes={stats.top_processes || []} />

      {/* 6. Memory (RAM) Card */}
      <div className="stat-card">
        <div className="card-header">
          <div className="header-left">
            <span className="card-icon" role="img" aria-label="ram">💾</span>
            <div>
              <h3>Memory (RAM)</h3>
              <p className="card-subtitle">Physical Memory</p>
            </div>
          </div>
          <span className="badge">RAM</span>
        </div>

        <div className="ram-details">
          <div className="stat-split">
            <div className="stat-item">
              <span className="stat-label">USED</span>
              <div className="stat-val-group">
                <span className="stat-number">{stats.ram_used_gb.toFixed(2)}</span>
                <span className="stat-unit">GB</span>
              </div>
            </div>
            <div className="stat-divider">/</div>
            <div className="stat-item">
              <span className="stat-label">TOTAL</span>
              <div className="stat-val-group">
                <span className="stat-number">{stats.ram_total_gb.toFixed(2)}</span>
                <span className="stat-unit">GB</span>
              </div>
            </div>
          </div>

          <LinearGauge
            value={stats.ram_used_pct}
            label={stats.ram_used_pct > 85 ? 'High Load' : 'Normal'}
            sublabel={`${stats.ram_used_pct.toFixed(1)}%`}
          />

          <div className="ram-footer-stat">
            <span>Free Available:</span>
            <strong>{(stats.ram_total_gb - stats.ram_used_gb).toFixed(2)} GB</strong>
          </div>
        </div>
      </div>

      {/* 7. Primary Storage Card */}
      <div className="stat-card">
        <div className="card-header">
          <div className="header-left">
            <span className="card-icon" role="img" aria-label="disk">💽</span>
            <div>
              <h3>Primary Storage</h3>
              <p className="card-subtitle">Volume ({stats.disk_name})</p>
            </div>
          </div>
          <span className="badge">DRIVE</span>
        </div>

        <div className="disk-details">
          <div className="stat-split">
            <div className="stat-item">
              <span className="stat-label">USED SPACE</span>
              <div className="stat-val-group">
                <span className="stat-number">{stats.disk_used_gb.toFixed(1)}</span>
                <span className="stat-unit">GB</span>
              </div>
            </div>
            <div className="stat-divider">/</div>
            <div className="stat-item">
              <span className="stat-label">CAPACITY</span>
              <div className="stat-val-group">
                <span className="stat-number">{stats.disk_total_gb.toFixed(1)}</span>
                <span className="stat-unit">GB</span>
              </div>
            </div>
          </div>

          <LinearGauge
            value={stats.disk_used_pct}
            label="Normal"
            sublabel={`${stats.disk_used_pct.toFixed(1)}%`}
          />

          <div className="ram-footer-stat">
            <span>Available Space:</span>
            <strong>{(stats.disk_total_gb - stats.disk_used_gb).toFixed(1)} GB</strong>
          </div>
        </div>
      </div>

      {/* 8. Power & Battery */}
      <div className="stat-card">
        <div className="card-header">
          <div className="header-left">
            <span className="card-icon" role="img" aria-label="battery">🔋</span>
            <div>
              <h3>Power & Battery</h3>
              <p className="card-subtitle">
                {stats.is_laptop ? 'Integrated Battery Pack' : 'Desktop Power Supply'}
              </p>
            </div>
          </div>
          <span className="badge">POWER</span>
        </div>

        <BatteryGauge
          battery_pct={stats.battery_pct}
          is_charging={stats.is_charging}
          is_laptop={stats.is_laptop}
        />
      </div>
    </div>
  );
};
