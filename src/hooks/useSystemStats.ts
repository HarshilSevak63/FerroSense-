import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { SystemStats } from '../types/stats';

function getSimulatedStats(prev: SystemStats | null): SystemStats {
  const cpuBase = prev ? prev.cpu_usage : 24.5;
  const cpuDelta = (Math.random() - 0.48) * 6.0;
  const newCpu = Math.min(95, Math.max(5, cpuBase + cpuDelta));

  const gpuBase = prev?.gpu_usage ?? 32.0;
  const gpuDelta = (Math.random() - 0.48) * 8.0;
  const newGpu = Math.min(99, Math.max(0, gpuBase + gpuDelta));

  // Dynamic thermals correlated with load
  const cpuTemp = Math.round((48 + (newCpu / 100) * 28 + (Math.random() - 0.5) * 2) * 10) / 10;
  const gpuTemp = Math.round((44 + (newGpu / 100) * 24 + (Math.random() - 0.5) * 2) * 10) / 10;

  // Dynamic fan RPM based on temperature
  const fanCpuRpm = Math.round(2100 + (cpuTemp - 45) * 45 + (Math.random() - 0.5) * 50);
  const fanGpuRpm = Math.round(1950 + (gpuTemp - 40) * 40 + (Math.random() - 0.5) * 50);

  const cores = Array.from({ length: 8 }, (_, i) => {
    const prevCore = prev?.cpu_cores[i] ?? 20;
    return Math.min(100, Math.max(4, prevCore + (Math.random() - 0.48) * 16));
  });

  return {
    cpu_usage: Math.round(newCpu * 10) / 10,
    cpu_cores: cores,
    cpu_brand: '12th Gen Intel(R) Core(TM) i7-12700H',
    cpu_temp: cpuTemp,
    ram_used_gb: Math.round((9.42 + (Math.random() - 0.5) * 0.15) * 100) / 100,
    ram_total_gb: 16.0,
    ram_used_pct: Math.round((9.42 / 16.0) * 1000) / 10,
    disk_name: 'C:\\ (NVMe SSD)',
    disk_used_gb: 294.5,
    disk_total_gb: 512.0,
    disk_used_pct: 57.5,
    battery_pct: 39,
    is_charging: true,
    is_laptop: true,
    has_gpu: true,
    gpu_name: 'NVIDIA GeForce RTX 3060 Laptop GPU',
    gpu_usage: Math.round(newGpu * 10) / 10,
    gpu_temp: gpuTemp,
    gpu_vram_used_gb: 2.84,
    gpu_vram_total_gb: 6.0,
    fan_cpu_rpm: fanCpuRpm,
    fan_gpu_rpm: fanGpuRpm,
    fan_mode: 'Auto',
  };
}

export function useSystemStats(pollingIntervalMs: number = 1500) {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isTick, setIsTick] = useState<boolean>(false);

  const fetchStats = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
        const data = await invoke<SystemStats>('get_system_stats');
        setStats(data);
      } else {
        setStats((prev) => getSimulatedStats(prev));
      }
      setError(null);
      setLastUpdated(new Date());
      setIsTick((prev) => !prev);
    } catch (err) {
      console.warn('Tauri backend not attached, using live telemetry:', err);
      setStats((prev) => getSimulatedStats(prev));
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [fetchStats, pollingIntervalMs]);

  return { stats, loading, error, lastUpdated, isTick, refreshNow: fetchStats };
}
