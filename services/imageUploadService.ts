// =================================================================================
// 🔥 重要：請將此處的字串替換成您在 Imgur 網站上複製的 `Client ID`
// =================================================================================
const IMGUR_CLIENT_ID = 'YOUR_IMGUR_CLIENT_ID_HERE';
const IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/image';

/**
 * 圖片上傳服務 (Imgur 版本)
 *
 * @remarks
 * 此函數會接收一個檔案物件，將其匿名上傳到 Imgur，
 * 然後返回一個公開、永久性的圖片網址 (URL)。
 *
 * @param file - 使用者選擇的圖片檔案 (File Object)
 * @returns - 返回一個 Promise，解析後為圖片在 Imgur 上的公開 URL 字串
 */
export const uploadImage = async (file: File): Promise<string> => {
  if (IMGUR_CLIENT_ID === 'YOUR_IMGUR_CLIENT_ID_HERE') {
    const errorMessage = "Imgur Client ID尚未設定！請在 services/imageUploadService.ts 中填入您的 Client ID。";
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    console.log(`Uploading ${file.name} to Imgur...`);
    
    const response = await fetch(IMGUR_UPLOAD_URL, {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Imgur API Error: ${errorData.data.error}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log("Imgur upload successful! URL:", result.data.link);
      return result.data.link; // 返回圖片的直接連結
    } else {
      throw new Error("Imgur upload returned success: false");
    }

  } catch (error) {
    console.error("Imgur upload failed:", error);
    throw new Error("Failed to upload image to Imgur.");
  }
};
