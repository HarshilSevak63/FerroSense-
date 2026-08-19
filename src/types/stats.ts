export interface SystemStats {
  // CPU Metrics
  cpu_usage: number;
  cpu_cores: number[];
  cpu_brand: string;
  cpu_temp: number;

  // RAM Metrics
  ram_used_gb: number;
  ram_total_gb: number;
  ram_used_pct: number;

  // Primary Storage
  disk_name: string;
  disk_used_gb: number;
  disk_total_gb: number;
  disk_used_pct: number;

  // Power & Battery
  battery_pct: number | null;
  is_charging: boolean | null;
  is_laptop: boolean;

  // GPU Metrics
  has_gpu: boolean;
  gpu_name: string | null;
  gpu_usage: number | null;
  gpu_temp: number | null;
  gpu_vram_used_gb: number | null;
  gpu_vram_total_gb: number | null;

  // Thermals & Cooling Fans (NitroSense Deck)
  fan_cpu_rpm: number;
  fan_gpu_rpm: number;
  fan_mode: string;

  // Network I/O & Latency (Feature #1)
  net_download_mbps: number;
  net_upload_mbps: number;
  net_adapter_name: string;
  net_link_speed: string;
  net_ping_ms: number;
  net_total_download_gb: number;
  net_total_upload_gb: number;
}
