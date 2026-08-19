import React from 'react';
import { Sparkline } from './Sparkline';
import { LinearGauge } from './LinearGauge';

interface NetworkCardProps {
  downloadMbps: number;
  uploadMbps: number;
  adapterName: string;
  linkSpeed: string;
  pingMs: number;
  totalDownloadGb: number;
  totalUploadGb: number;
  downloadHistory?: number[];
  uploadHistory?: number[];
}

export const NetworkCard: React.FC<NetworkCardProps> = ({
  downloadMbps,
  uploadMbps,
  adapterName,
  linkSpeed,
  pingMs,
  totalDownloadGb,
  totalUploadGb,
  downloadHistory = [],
  uploadHistory = [],
}) => {
  // Normalize speeds for linear meter (max scale 50 MB/s)
  const dlPct = Math.min(100, (downloadMbps / 50) * 100);
  const ulPct = Math.min(100, (uploadMbps / 20) * 100);

  return (
    <div className="stat-card">
      <div className="card-header">
        <div className="header-left">
          <span className="card-icon" role="img" aria-label="network">🌐</span>
          <div>
            <h3>Network (I/O)</h3>
            <p className="card-subtitle" title={adapterName}>{adapterName}</p>
          </div>
        </div>
        <div className="header-right">
          <span className="badge badge-ping">
            <span className="ping-dot" /> {pingMs} ms
          </span>
          <span className="badge">{linkSpeed}</span>
        </div>
      </div>

      <div className="network-speeds-grid">
        {/* Download Section */}
        <div className="net-speed-box dl-box">
          <div className="net-box-header">
            <span className="net-dir-icon">↓</span>
            <span className="net-dir-title">DOWNLOAD</span>
            <span className="net-speed-num dl-color">{downloadMbps.toFixed(2)} <small>MB/s</small></span>
          </div>
          <LinearGauge value={dlPct} />
          <div className="net-sparkline-wrap">
            <Sparkline data={downloadHistory} width={130} height={20} color="#00f0ff" max={25} />
          </div>
        </div>

        {/* Upload Section */}
        <div className="net-speed-box ul-box">
          <div className="net-box-header">
            <span className="net-dir-icon">↑</span>
            <span className="net-dir-title">UPLOAD</span>
            <span className="net-speed-num ul-color">{uploadMbps.toFixed(2)} <small>MB/s</small></span>
          </div>
          <LinearGauge value={ulPct} />
          <div className="net-sparkline-wrap">
            <Sparkline data={uploadHistory} width={130} height={20} color="#00ff88" max={10} />
          </div>
        </div>
      </div>

      {/* Session Traffic Footer */}
      <div className="net-footer-row">
        <div className="net-traffic-stat">
          <span className="traffic-label">Session In:</span>
          <strong>{totalDownloadGb.toFixed(2)} GB</strong>
        </div>
        <div className="net-traffic-divider">|</div>
        <div className="net-traffic-stat">
          <span className="traffic-label">Session Out:</span>
          <strong>{totalUploadGb.toFixed(2)} GB</strong>
        </div>
      </div>
    </div>
  );
};
