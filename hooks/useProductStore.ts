import { useState, useEffect } from 'react';
import { ProductOptions } from '../types';
import { productOptions as initialProducts } from '../constants';

const LOCAL_STORAGE_KEY = 'arttrack_products_v1';

export const useProductStore = () => {
  const [productOptions, setProductOptions] = useState<ProductOptions>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        if (Object.keys(parsed).length > 0) {
          setProductOptions(parsed);
        } else {
          setProductOptions(initialProducts);
        }
      } else {
        setProductOptions(initialProducts);
      }
    } catch (e) {
      console.error("Failed to parse products from local storage", e);
      setProductOptions(initialProducts);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(productOptions));
    }
  }, [productOptions, isLoaded]);

  const updateProductOptions = (newProductOptions: ProductOptions) => {
    setProductOptions(newProductOptions);
  };

  return { productOptions, updateProductOptions, isLoaded };
};