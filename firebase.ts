import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// =================================================================================
// 🔥 重要：請將此處的設定物件替換成您在 Firebase Console 複製的 `firebaseConfig`
// =================================================================================
const firebaseConfig = {

  apiKey: "AIzaSyAgfzJAlhGowci25Q4ELjPbb_yz9b1SgKE",

  authDomain: "commission-tracker-e6da0.firebaseapp.com",

  projectId: "commission-tracker-e6da0",

  storageBucket: "commission-tracker-e6da0.firebasestorage.app",

  messagingSenderId: "859578190938",

  appId: "1:859578190938:web:cb6274fb81816183501c63",

  measurementId: "G-2GGNJ16VZK"

};


// 初始化 Firebase 應用
const app = initializeApp(firebaseConfig);

// 獲取並匯出 Firebase Firestore 服務
export const db = getFirestore(app);

// 獲取並匯出 Firebase Storage 服務
export const storage = getStorage(app);

// 獲取並匯出 Firebase Auth 服務
export const auth = getAuth(app);
