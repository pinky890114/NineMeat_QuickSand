import { useState, useEffect } from 'react';
import { db } from '../firebase';
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
        const docRef = db.collection(PRODUCTS_COLLECTION).doc(PRODUCTS_DOC_ID);
        
        // Check if we need to initialize data
        const initializeData = async () => {
            try {
                const docSnap = await docRef.get();
                if (!docSnap.exists) {
                    console.log("Product options document does not exist. Initializing...");
                    try {
                        await docRef.set(initialProducts);
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

        unsubscribe = docRef.onSnapshot((docSnap) => {
          if (docSnap.exists) {
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
        const docRef = db.collection(PRODUCTS_COLLECTION).doc(PRODUCTS_DOC_ID);
        await docRef.set(newProductOptions);
        return true;
    } catch (error: any) {
        console.error("Error updating product options:", error);
        
        let message = `更新失敗：${error.message}`;
        if (error.code === 'permission-denied') {
            message = "⚠️ 權限不足 (Permission Denied)\n\n請至 Firebase Console > Firestore Database > Rules 設定規則。\n\n建議加入以下規則：\nmatch /product_options/{document=**} {\n  allow read: if true;\n  allow write: if request.auth != null;\n}";
        }
        
        alert(message);
        return false;
    }
  };

  return { productOptions, updateProductOptions, isLoaded };
};