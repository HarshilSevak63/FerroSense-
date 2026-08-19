import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { SystemStats } from '../types/stats';

export function useSystemStats(pollingIntervalMs: number = 1500) {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isTick, setIsTick] = useState<boolean>(false);

  const [cpuHistory, setCpuHistory] = useState<number[]>(() => Array(25).fill(25));
  const [gpuHistory, setGpuHistory] = useState<number[]>(() => Array(25).fill(20));
  const [tempHistory, setTempHistory] = useState<number[]>(() => Array(25).fill(50));

  const fetchStats = useCallback(async () => {
    try {
      let data: SystemStats | null = null;
      if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
        data = await invoke<SystemStats>('get_system_stats');
      } else {
        const res = await fetch('/api/stats');
        if (res.ok) {
          data = await res.json();
        }
      }

      if (data) {
        setStats(data);
        const cpuVal = typeof data.cpu_usage === 'number' ? data.cpu_usage : 25;
        const gpuVal = typeof data.gpu_usage === 'number' ? data.gpu_usage : 20;
        const tempVal = typeof data.cpu_temp === 'number' ? data.cpu_temp : 50;

        setCpuHistory((prev) => [...prev.slice(1), cpuVal]);
        setGpuHistory((prev) => [...prev.slice(1), gpuVal]);
        setTempHistory((prev) => [...prev.slice(1), tempVal]);
      }
      setError(null);
      setLastUpdated(new Date());
      setIsTick((prev) => !prev);
    } catch (err) {
      console.warn('Telemetry poll warning:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [fetchStats, pollingIntervalMs]);

  return {
    stats,
    loading,
    error,
    lastUpdated,
    isTick,
    cpuHistory,
    gpuHistory,
    tempHistory,
    refreshNow: fetchStats,
  };
}
