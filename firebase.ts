import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// =================================================================================
// 🔥 重要：請確認 storageBucket 與您 Firebase Console > Storage 上顯示的一致
// 新版 Firebase 專案通常是 "專案ID.firebasestorage.app"
// 舊版 Firebase 專案可能是 "專案ID.appspot.com"
//
// 1. 前往 Firebase Console > Storage
// 2. 複製 "gs://" 後面的那串文字
// 3. 貼上到下方的 storageBucket
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

// 初始化 Firebase (Modular SDK)
const app = initializeApp(firebaseConfig);

// 初始化 Firestore
// 如果遇到 "Backend didn't respond" 錯誤，請確認：
// 1. 您的網路連線正常 (非公司內網擋火牆)
// 2. 您已在 Firebase Console > Firestore Database 點擊「建立資料庫」
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);