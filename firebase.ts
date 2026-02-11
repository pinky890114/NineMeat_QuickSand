import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// =================================================================================
// 🔥 重要：請將此處的設定物件替換成您在 Firebase Console 複製的 `firebaseConfig`
// =================================================================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase 應用
const app = initializeApp(firebaseConfig);

// 獲取並匯出 Firebase Firestore 服務
export const db = getFirestore(app);
