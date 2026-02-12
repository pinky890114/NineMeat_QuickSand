import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ProductOptions } from '../types';
import { productOptions as initialProducts } from '../constants';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

const PRODUCTS_COLLECTION = 'product_options';
const PRODUCTS_DOC_ID = 'singleton';

export const useProductStore = () => {
  const [productOptions, setProductOptions] = useState<ProductOptions>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};

    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, PRODUCTS_DOC_ID);
        
        const initializeData = async () => {
            try {
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    console.log("Initializing product options...");
                    try {
                        await setDoc(docRef, initialProducts);
                    } catch (error) {
                        // 這裡通常是因為還沒登入或權限問題，先忽略，使用預設值
                        console.warn("Using default products (Pending specific permissions or creation).");
                    }
                }
            } catch (error: any) {
                // 這裡捕捉 "Client is offline" 或 "Backend didn't respond"
                if (error.code === 'unavailable' || error.message.includes('offline')) {
                    console.warn("⚠️ Firestore is offline or unreachable. Using local mock data.");
                } else {
                    console.warn("Failed to init product data (using defaults):", error.message);
                }
                setProductOptions(initialProducts);
                setIsLoaded(true);
            }
        };

        initializeData();

        unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const firestoreData = docSnap.data() as ProductOptions;
            // Merge initialProducts with firestoreData to ensure new categories (keys) 
            // from initialProducts appear even if they don't exist in the DB yet.
            setProductOptions({ ...initialProducts, ...firestoreData });
          } else {
            setProductOptions(initialProducts);
          }
          setIsLoaded(true);
        }, (error) => {
            // 監聽失敗時也切換回預設值
            console.warn("Firestore snapshot listener paused (Offline/Error). Using local data.");
            setProductOptions(initialProducts);
            setIsLoaded(true);
        });

    } catch (err) {
        console.error("Critical Firebase Error in ProductStore:", err);
        setProductOptions(initialProducts);
        setIsLoaded(true);
    }

    return () => unsubscribe();
  }, []);

  const updateProductOptions = async (newProductOptions: ProductOptions) => {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, PRODUCTS_DOC_ID);
        await setDoc(docRef, newProductOptions);
        return true;
    } catch (error: any) {
        console.error("Error updating options:", error);
        
        let message = `更新失敗：${error.message}`;
        if (error.code === 'permission-denied') {
            message = "⚠️ 權限不足 (Permission Denied)\n\n請至 Firebase Console > Firestore Database > Rules 設定規則。";
        } else if (error.code === 'unavailable') {
            message = "⚠️ 無法連線到伺服器 (Offline)\n\n請檢查您的網路連線，或確認 Firestore 資料庫是否已建立。";
        }
        
        alert(message);
        return false;
    }
  };

  return { productOptions, updateProductOptions, isLoaded };
};