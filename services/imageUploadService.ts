import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * 壓縮圖片
 * 將圖片限制在最大寬度/高度，並轉換為 JPEG 格式以節省空間。
 * 目標是讓每張圖片大小控制在 100KB-200KB 以內，以加快上傳速度。
 */
const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        // 優化設定：縮小尺寸至 800px，品質設為 0.6，大幅提升上傳速度
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        const QUALITY = 0.6; 

        // 使用 createObjectURL 代替 FileReader，減少記憶體使用並提升載入速度
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        img.onload = () => {
            // 釋放記憶體
            URL.revokeObjectURL(objectUrl);

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

            // 處理透明背景：若是 PNG 轉 JPEG，透明部分會變黑，這裡強制填滿白色背景
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Canvas to Blob failed"));
                }
            }, 'image/jpeg', QUALITY);
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(objectUrl);
            reject(err);
        };
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
    console.log(`Processing upload for ${file.name}...`);
    
    // 1. 壓縮圖片
    const compressedBlob = await compressImage(file);
    console.log(`Original size: ${(file.size / 1024).toFixed(2)} KB`);
    console.log(`Compressed size: ${(compressedBlob.size / 1024).toFixed(2)} KB`);

    // 2. 建立檔案參考路徑 (使用時間戳記避免檔名衝突)
    const timestamp = Date.now();
    // 移除非英數字符以確保檔名安全
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `products/${timestamp}_${safeName}`;
    const storageRef = ref(storage, fileName);

    // 3. 上傳檔案
    const snapshot = await uploadBytes(storageRef, compressedBlob);
    console.log('Upload completed successfully');

    // 4. 取得下載連結
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;

  } catch (error: any) {
    console.error("Firebase Storage upload failed:", error);
    
    // 檢查常見錯誤並轉換為易讀訊息
    if (error.code === 'storage/unauthorized') {
        throw new Error("權限不足：請檢查 Firebase Console 的 Storage Rules 是否允許寫入 (請暫時設為 allow read, write: if true;)。");
    } else if (error.code === 'storage/canceled') {
        throw new Error("上傳已取消。");
    } else if (error.code === 'storage/unknown') {
        throw new Error("發生未知錯誤，請檢查 Firebase 設定。");
    }
    
    throw new Error(error.message || "上傳過程發生錯誤，請檢查網路連線或稍後再試。");
  }
};