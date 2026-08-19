import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { SystemStats } from '../types/stats';

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
        // Query live hardware telemetry from local bridge
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          if (data) setStats(data);
        }
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

  return { stats, loading, error, lastUpdated, isTick, refreshNow: fetchStats };
}
