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
                        console.error("Error setting initial options:", error);
                    }
                }
            } catch (error) {
                console.error("Failed to init product data:", error);
                setProductOptions(initialProducts);
                setIsLoaded(true);
            }
        };

        initializeData();

        unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProductOptions(docSnap.data() as ProductOptions);
          } else {
            setProductOptions(initialProducts);
          }
          setIsLoaded(true);
        }, (error) => {
            console.error("Error fetching options:", error);
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
        }
        
        alert(message);
        return false;
    }
  };

  return { productOptions, updateProductOptions, isLoaded };
};
