import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

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
// Check if firebase is already initialized to prevent errors during hot reload
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// 獲取並匯出 Firebase Firestore 服務
export const db = app.firestore();

// 獲取並匯出 Firebase Storage 服務
export const storage = app.storage();

// 獲取並匯出 Firebase Auth 服務
export const auth = app.auth();
