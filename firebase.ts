import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// =================================================================================
// 🔥 重要：請確認 storageBucket 與您 Firebase Console > Storage 上顯示的一致
// 通常是 "commission-tracker-e6da0.appspot.com" 或 "commission-tracker-e6da0.firebasestorage.app"
// =================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAgfzJAlhGowci25Q4ELjPbb_yz9b1SgKE",
  authDomain: "commission-tracker-e6da0.firebaseapp.com",
  projectId: "commission-tracker-e6da0",
  storageBucket: "commission-tracker-e6da0.appspot.com",
  messagingSenderId: "859578190938",
  appId: "1:859578190938:web:cb6274fb81816183501c63",
  measurementId: "G-2GGNJ16VZK"
};

// 初始化 Firebase (Modular SDK)
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
