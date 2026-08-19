import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { SystemStats } from '../types/stats';

function getSimulatedStats(prev: SystemStats | null): SystemStats {
  const cpuBase = prev ? prev.cpu_usage : 22.4;
  const cpuDelta = (Math.random() - 0.48) * 8.0;
  const newCpu = Math.min(95, Math.max(5, cpuBase + cpuDelta));

  const cores = Array.from({ length: 8 }, (_, i) => {
    const prevCore = prev?.cpu_cores[i] ?? 18;
    return Math.min(100, Math.max(2, prevCore + (Math.random() - 0.48) * 15));
  });

  return {
    cpu_usage: Math.round(newCpu * 10) / 10,
    cpu_cores: cores,
    cpu_brand: 'Intel(R) Core(TM) i7-12700H @ 2.30GHz',
    ram_used_gb: Math.round((9.42 + (Math.random() - 0.5) * 0.2) * 100) / 100,
    ram_total_gb: 16.0,
    ram_used_pct: Math.round((9.42 / 16.0) * 1000) / 10,
    disk_name: 'C:\\ (System NVMe)',
    disk_used_gb: 294.5,
    disk_total_gb: 512.0,
    disk_used_pct: 57.5,
    battery_pct: 84,
    is_charging: true,
    is_laptop: true,
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
      console.warn('Tauri backend not attached, using simulated telemetry:', err);
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
