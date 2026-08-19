export interface SystemStats {
  cpu_usage: number;
  cpu_cores: number[];
  cpu_brand: string;
  cpu_temp: number | null;
  ram_used_gb: number;
  ram_total_gb: number;
  ram_used_pct: number;
  disk_name: string;
  disk_used_gb: number;
  disk_total_gb: number;
  disk_used_pct: number;
  battery_pct: number | null;
  is_charging: boolean | null;
  is_laptop: boolean;
  // GPU & Fan Telemetry
  has_gpu: boolean;
  gpu_name: string | null;
  gpu_usage: number | null;
  gpu_temp: number | null;
  gpu_vram_used_gb: number | null;
  gpu_vram_total_gb: number | null;
  fan_cpu_rpm: number | null;
  fan_gpu_rpm: number | null;
  fan_mode: 'Auto' | 'Max' | 'Custom';
}
