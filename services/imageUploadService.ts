import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * 壓縮圖片
 * 將圖片限制在最大寬度/高度，並轉換為 JPEG 格式以節省空間。
 * 目標是讓每張圖片大小控制在 300KB 以內。
 */
const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        const QUALITY = 0.7; // 70% 品質

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // 計算縮放比例
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("Canvas context failed"));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("Canvas to Blob failed"));
                    }
                }, 'image/jpeg', QUALITY);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

/**
 * 圖片上傳服務 (Firebase Storage 版本)
 * 
 * 1. 壓縮圖片
 * 2. 上傳至 Firebase Storage 的 'products' 資料夾
 * 3. 返回下載連結
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    console.log(`Processing ${file.name}...`);
    
    // 1. 壓縮圖片
    const compressedBlob = await compressImage(file);
    console.log(`Original size: ${file.size / 1024} KB`);
    console.log(`Compressed size: ${compressedBlob.size / 1024} KB`);

    // 2. 建立檔案參考路徑 (使用時間戳記避免檔名衝突)
    const timestamp = Date.now();
    const fileName = `products/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const storageRef = ref(storage, fileName);

    // 3. 上傳檔案
    const snapshot = await uploadBytes(storageRef, compressedBlob);
    console.log('Uploaded a blob or file!', snapshot);

    // 4. 取得下載連結
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;

  } catch (error) {
    console.error("Firebase Storage upload failed:", error);
    throw new Error("圖片上傳失敗，請檢查 Firebase Storage 權限設定。");
  }
};