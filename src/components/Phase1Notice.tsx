import React from 'react';

export const Phase1Notice: React.FC = () => {
  return (
    <div className="phase1-notice-panel">
      <div className="notice-icon-box">🌡️</div>
      <div className="notice-content">
        <div className="notice-header">
          <h4>Thermal & Fan Telemetry Preview</h4>
          <span className="notice-badge">Planned for Phase 1</span>
        </div>
        <p>
          Hardware core temperatures (CPU/GPU Hotspot) and Fan RPM telemetry require low-level driver sidecar integration (LibreHardwareMonitor) with elevated permissions. Scoped for Phase 1.
        </p>
      </div>
    </div>
  );
};
