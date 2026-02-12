import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error("圖片處理逾時，請試著換一張較小的圖片。"));
        }, 10000);

        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        const QUALITY = 0.6; 

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        
        img.src = objectUrl;

        img.onload = () => {
            clearTimeout(timeoutId);
            URL.revokeObjectURL(objectUrl);

            let width = img.width;
            let height = img.height;

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
                reject(new Error("瀏覽器不支援 Canvas"));
                return;
            }

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("圖片轉換失敗"));
                }
            }, 'image/jpeg', QUALITY);
        };

        img.onerror = () => {
            clearTimeout(timeoutId);
            URL.revokeObjectURL(objectUrl);
            reject(new Error("無法讀取圖片。"));
        };
    });
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    console.log(`開始上傳: ${file.name}`);
    const compressedBlob = await compressImage(file);
    
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `products/${timestamp}_${safeName}.jpg`;
    
    // 使用 Modular SDK 語法
    const storageRef = ref(storage, fileName);
    const snapshot = await uploadBytes(storageRef, compressedBlob);
    
    console.log('上傳成功');
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;

  } catch (error: any) {
    console.error("Upload failed:", error);
    
    if (error.code === 'storage/unauthorized') {
        throw new Error("權限不足：請檢查 Firebase Storage Rules。");
    } else if (error.code === 'storage/object-not-found') {
        throw new Error("Bucket 設定錯誤或找不到檔案。");
    } 
    
    if (error.message && (error.message.includes('network') || error.message.includes('CORS'))) {
        throw new Error("連線失敗 (CORS)：Bucket 可能尚未建立或 CORS 未設定。");
    }

    throw error;
  }
};
