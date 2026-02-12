import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { Commission, CommissionStatus } from '../types';
import { MOCK_COMMISSIONS } from '../constants';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, writeBatch, getDocs } from 'firebase/firestore';

const COMMISSIONS_COLLECTION = 'commissions';

export const useCommissionStore = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  
  useEffect(() => {
    try {
        const commissionsRef = collection(db, COMMISSIONS_COLLECTION);
        
        // 檢查並初始化數據 (Modular SDK)
        const initializeData = async () => {
            try {
                const q = query(commissionsRef);
                const snapshot = await getDocs(q);
                
                if (snapshot.empty) {
                    console.log("Commissions collection is empty. Initializing with mock data...");
                    const batch = writeBatch(db);
                    MOCK_COMMISSIONS.forEach((commission) => {
                        // 使用新的 doc 參考
                        const newDocRef = doc(commissionsRef);
                        const { id, ...data } = commission;
                        batch.set(newDocRef, data);
                    });
                    await batch.commit();
                    console.log("Mock data initialized.");
                }
            } catch (e) {
                console.error("Initial check failed (likely offline/no auth), using local mock.", e);
                setCommissions(MOCK_COMMISSIONS);
            }
        };
        
        initializeData();

        // 監聽更新
        const q = query(commissionsRef, orderBy('dateAdded', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const commissionsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Commission));
          setCommissions(commissionsData);
        }, (error) => {
          console.error("Error fetching commissions:", error);
          setCommissions(MOCK_COMMISSIONS);
        });

        return () => unsubscribe();
    } catch (err) {
        console.error("Firebase connection error:", err);
        setCommissions(MOCK_COMMISSIONS);
        return () => {};
    }
  }, []);

  const addCommission = useCallback(async (newCommission: Omit<Commission, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    try {
      const commissionToAdd = {
        ...newCommission,
        dateAdded: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      await addDoc(collection(db, COMMISSIONS_COLLECTION), commissionToAdd);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("無法新增訂單：可能是權限不足或網路問題。");
    }
  }, []);

  const updateCommissionStatus = useCallback(async (id: string, newStatus: CommissionStatus) => {
    try {
      const docRef = doc(db, COMMISSIONS_COLLECTION, id);
      await updateDoc(docRef, {
        status: newStatus,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      console.error("Error updating status: ", e);
    }
  }, []);

  const updateCommission = useCallback(async (id: string, data: Partial<Omit<Commission, 'id'>>) => {
    try {
      const docRef = doc(db, COMMISSIONS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }, []);

  const deleteCommission = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, COMMISSIONS_COLLECTION, id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }, []);
  
  return { commissions, addCommission, updateCommissionStatus, updateCommission, deleteCommission };
};
