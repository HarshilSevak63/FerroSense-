export interface SystemStats {
  cpu_usage: number;
  cpu_cores: number[];
  cpu_brand: string;
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
}
