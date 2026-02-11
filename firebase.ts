import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// =================================================================================
// 🔥 重要：請將此處的設定物件替換成您在 Firebase Console 複製的 `firebaseConfig`
// =================================================================================
const firebaseConfig = {

  apiKey: "AIzaSyAgfzJAlhGowci25Q4ELjPbb_yz9b1SgKE",

  authDomain: "commission-tracker-e6da0.firebaseapp.com",

  projectId: "commission-tracker-e6da0",

  // 更新：預設改為 .appspot.com，請確認這與您 Firebase Console > Storage 上方顯示的 gs:// 網址一致
  storageBucket: "commission-tracker-e6da0.appspot.com",

  messagingSenderId: "859578190938",

  appId: "1:859578190938:web:cb6274fb81816183501c63",

  measurementId: "G-2GGNJ16VZK"

};

// Initialize Firebase (v8 check)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// 獲取並匯出 Firebase 服務 (v8 Instances)
export const db = firebase.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth();
