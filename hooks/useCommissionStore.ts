import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    onSnapshot, 
    query, 
    orderBy, 
    writeBatch,
    getDocs
} from 'firebase/firestore';
import { Commission, CommissionStatus } from '../types';
import { MOCK_COMMISSIONS } from '../constants';

const COMMISSIONS_COLLECTION = 'commissions';

export const useCommissionStore = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  
  // 實時監聽 Firestore 中的訂單數據
  useEffect(() => {
    try {
        const commissionsCollectionRef = collection(db, COMMISSIONS_COLLECTION);
        
        // 檢查是否需要初始化數據
        const initializeData = async () => {
            try {
                const snapshot = await getDocs(commissionsCollectionRef);
                if (snapshot.empty) {
                    console.log("Commissions collection is empty. Initializing with mock data...");
                    const batch = writeBatch(db);
                    MOCK_COMMISSIONS.forEach((commission) => {
                        const newDocRef = doc(commissionsCollectionRef); 
                        // Firestore doesn't store the ID within the document by default
                        const { id, ...data } = commission;
                        batch.set(newDocRef, data);
                    });
                    await batch.commit();
                    console.log("Mock data initialized in Firestore.");
                }
            } catch (e) {
                console.error("Initial data check failed (likely config issue), using mock data locally.", e);
                setCommissions(MOCK_COMMISSIONS);
            }
        };
        
        initializeData();

        const q = query(commissionsCollectionRef, orderBy('dateAdded', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const commissionsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              } as Commission));
              setCommissions(commissionsData);
            }, (error) => {
              console.error("Error fetching commissions:", error);
              // Fallback for preview mode or invalid config
              setCommissions(MOCK_COMMISSIONS);
            });

        // 清理監聽器
        return () => unsubscribe();
    } catch (err) {
        console.error("Firebase connection failed critical:", err);
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
      alert("無法新增訂單：可能是因為尚未設定 Firebase API Key 或網路問題。");
    }
  }, []);

  const updateCommissionStatus = useCallback(async (id: string, newStatus: CommissionStatus) => {
    try {
      const commissionRef = doc(db, COMMISSIONS_COLLECTION, id);
      await updateDoc(commissionRef, {
        status: newStatus,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      console.error("Error updating document status: ", e);
    }
  }, []);

  const updateCommission = useCallback(async (id: string, data: Partial<Omit<Commission, 'id'>>) => {
    try {
      const commissionRef = doc(db, COMMISSIONS_COLLECTION, id);
      await updateDoc(commissionRef, {
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
