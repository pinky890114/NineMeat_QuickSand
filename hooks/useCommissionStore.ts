import { useState, useEffect, useCallback } from 'react';
import { Commission, CommissionStatus } from '../types';
import { MOCK_COMMISSIONS } from '../constants';

// A slightly different key to avoid conflicts with old data structures during development
const LOCAL_STORAGE_KEY = 'arttrack_commissions_zh_v2';

export const useCommissionStore = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migration: Ensure artistId exists
          parsed = parsed.map((c: any) => ({
            ...c,
            artistId: c.artistId || 'Unknown'
          }));
          setCommissions(parsed);
        } else {
          setCommissions(MOCK_COMMISSIONS);
        }
      } else {
        setCommissions(MOCK_COMMISSIONS);
      }
    } catch (e) {
      console.error("Failed to parse commissions from local storage", e);
      setCommissions(MOCK_COMMISSIONS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(commissions));
    }
  }, [commissions, isLoaded]);

  const addCommission = useCallback((newCommission: Omit<Commission, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    const commissionToAdd: Commission = {
      ...newCommission,
      id: `c-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setCommissions(prev => [commissionToAdd, ...prev]);
  }, []);

  const updateCommissionStatus = useCallback((id: string, newStatus: CommissionStatus) => {
    setCommissions(prev => prev.map(c =>
      c.id === id ? { ...c, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } : c
    ));
  }, []);

  const updateCommission = useCallback((id: string, data: Partial<Omit<Commission, 'id'>>) => {
    setCommissions(prev => prev.map(c =>
      c.id === id ? { ...c, ...data, lastUpdated: new Date().toISOString().split('T')[0] } : c
    ));
  }, []);

  const deleteCommission = useCallback((id: string) => {
    setCommissions(prev => prev.filter(c => c.id !== id));
  }, []);
  
  return { commissions, addCommission, updateCommissionStatus, updateCommission, deleteCommission };
};