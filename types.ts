export enum CommissionStatus {
  APPLYING = '申請中',
  DISCUSSION = '內容討論',
  DEPOSIT_PAID = '支付訂金',
  QUEUED = '確認排單',
  IN_PRODUCTION = '製作中',
  COMPLETED = '製作完成',
  SHIPPED = '貨到付款'
}

export interface Commission {
  id: string;
  artistId: string; // 負責此委託的繪師名稱/ID
  clientName: string;
  contact?: string; // e.g., Discord handle or email
  title: string;
  description: string;
  type: '流麻吊飾' | '流麻立牌' | '流麻磚' | '其他客製';
  price: number;
  status: CommissionStatus;
  dateAdded: string;
  lastUpdated: string;
  thumbnailUrl?: string; 
  notes?: string; 
}

export type ThemeMode = 'client' | 'admin';

export interface Addon {
    name: string;
    price: number;
}

export interface Product {
    name: string;
    price: number;
    img: string;
    addons?: Addon[];
}

export interface ProductOptions {
    [key: string]: Product[];
}