import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { ProductOptions } from '../types';
import { productOptions as initialProducts } from '../constants';

const PRODUCTS_COLLECTION = 'product_options';
const PRODUCTS_DOC_ID = 'singleton'; // Use a single document to store all options

export const useProductStore = () => {
  const [productOptions, setProductOptions] = useState<ProductOptions>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};

    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, PRODUCTS_DOC_ID);
        
        // Check if we need to initialize data
        const initializeData = async () => {
            try {
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    console.log("Product options document does not exist. Initializing...");
                    try {
                        await setDoc(docRef, initialProducts);
                        console.log("Initial product options set in Firestore.");
                    } catch (error) {
                        console.error("Error setting initial product options:", error);
                    }
                }
            } catch (error) {
                console.error("Failed to initialize product data (likely offline or no auth):", error);
                // Ensure we show something if initialization fails
                setProductOptions(initialProducts);
                setIsLoaded(true);
            }
        };

        initializeData();

        unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProductOptions(docSnap.data() as ProductOptions);
          } else {
            // This case should be handled by initialization, but as a fallback:
            setProductOptions(initialProducts);
          }
          setIsLoaded(true);
        }, (error) => {
            console.error("Error fetching product options:", error);
            setProductOptions(initialProducts); // Fallback on error
            setIsLoaded(true);
        });

    } catch (err) {
        console.error("Critical Firebase Error in ProductStore:", err);
        // Fallback completely if db is invalid or other sync errors occur
        setProductOptions(initialProducts);
        setIsLoaded(true);
    }

    return () => unsubscribe();
  }, []);

  const updateProductOptions = async (newProductOptions: ProductOptions) => {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, PRODUCTS_DOC_ID);
        await setDoc(docRef, newProductOptions);
    } catch (error) {
        console.error("Error updating product options:", error);
        alert("更新失敗：可能是因為尚未設定 Firebase 金鑰或權限不足。");
    }
  };

  return { productOptions, updateProductOptions, isLoaded };
};