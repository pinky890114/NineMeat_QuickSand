import { storage } from '../firebase';

/**
 * 壓縮圖片 (優化版)
 * 強制將圖片限制在 600px 以內，品質 0.6，以確保手機上傳秒速完成。
 */
const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        // 設定超時機制：如果 10 秒還沒壓好，就報錯 (避免無限轉圈)
        const timeoutId = setTimeout(() => {
            reject(new Error("圖片處理逾時，請試著換一張較小的圖片。"));
        }, 10000);

        const MAX_WIDTH = 600; // 下修尺寸以提升速度
        const MAX_HEIGHT = 600;
        const QUALITY = 0.6; 

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        
        img.src = objectUrl;

        img.onload = () => {
            clearTimeout(timeoutId); // 成功載入，取消超時
            URL.revokeObjectURL(objectUrl); // 釋放記憶體

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
                reject(new Error("瀏覽器不支援 Canvas 圖片處理"));
                return;
            }

            // 處理透明背景：填滿白色，避免 PNG 轉 JPEG 變黑
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

        img.onerror = (err) => {
            clearTimeout(timeoutId);
            URL.revokeObjectURL(objectUrl);
            reject(new Error("無法讀取此圖片，可能是格式不支援 (如 HEIC)，請使用 JPG/PNG。"));
        };
    });
};

/**
 * 圖片上傳服務 (v8 compatible)
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    console.log(`開始上傳: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    
    // 1. 壓縮圖片
    const compressedBlob = await compressImage(file);
    console.log(`壓縮後大小: ${(compressedBlob.size / 1024).toFixed(2)} KB`);

    // 2. 建立檔案路徑
    const timestamp = Date.now();
    // 移除非英數字符，只留副檔名
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `products/${timestamp}_${safeName}.jpg`; // 強制副檔名為 jpg
    
    const storageRef = storage.ref(fileName);

    // 3. 上傳檔案
    const snapshot = await storageRef.put(compressedBlob);
    console.log('Firebase Storage 上傳成功');

    // 4. 取得下載連結
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;

  } catch (error: any) {
    console.error("Upload failed:", error);
    
    // 處理特定的 Firebase Storage 錯誤代碼
    if (error.code === 'storage/unauthorized') {
        throw new Error("權限不足：請檢查 Firebase Console > Storage > Rules 是否已設為允許公開讀寫。");
    } else if (error.code === 'storage/canceled') {
        throw new Error("上傳已取消。");
    } else if (error.code === 'storage/object-not-found') {
        throw new Error("找不到檔案或是 Bucket 設定錯誤。");
    } 
    
    // 處理 CORS 或 404 造成的網路錯誤
    if (error.message && (error.message.includes('network') || error.message.includes('CORS'))) {
        throw new Error("連線失敗 (CORS)：這通常是因為 Storage Bucket 名稱設定錯誤，或是尚未設定 CORS 規則。");
    }

    // 回傳原始錯誤訊息
    throw error;
  }
};