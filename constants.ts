import { Commission, CommissionStatus, ProductOptions } from './types';

export const STATUS_STEPS = [
  CommissionStatus.APPLYING,
  CommissionStatus.DISCUSSION,
  CommissionStatus.DEPOSIT_PAID,
  CommissionStatus.QUEUED,
  CommissionStatus.IN_PRODUCTION,
  CommissionStatus.COMPLETED,
  CommissionStatus.SHIPPED,
];

// Explicitly define the render order of categories
export const CATEGORY_ORDER = [
    '正方形',
    '長方形',
    '圓形',
    '異形',
    '徽章磚',
    '雙色磚',
];

export const productOptions: ProductOptions = {
    '正方形': [
        { name: '5x5cm正方形', price: 120, img: 'https://picsum.photos/seed/sq1/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '多層流沙層', price: 50}, {name: '流沙油速', price: 10}, {name: '吊牌款式', price: 40}] },
        { name: '6x6cm正方形', price: 120, img: 'https://picsum.photos/seed/sq2/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '多層流沙層', price: 50}, {name: '流沙油速', price: 10}, {name: '閃粉數量', price: 10}] },
        { name: '8x8cm正方形', price: 120, img: 'https://picsum.photos/seed/sq3/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '多層流沙層', price: 50}, {name: '流沙油速', price: 10}, {name: '閃粉數量', price: 10}] },
        { name: '10x10cm正方形', price: 120, img: 'https://picsum.photos/seed/sq4/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '多層流沙層', price: 50}, {name: '流沙油速', price: 10}, {name: '閃粉數量', price: 10}, {name: '吊牌款式', price: 40}, {name: '立牌款式', price: 60}] },
    ],
    '長方形': [
        { name: '3x4cm長方形', price: 120, img: 'https://picsum.photos/seed/rect1/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '吊牌款式', price: 40}] },
        { name: '4x6cm長方形', price: 150, img: 'https://picsum.photos/seed/rect2/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}] },
        { name: '5.5x8.5cm長方形', price: 200, img: 'https://picsum.photos/seed/rect3/400', addons: [{name: '多層流沙層', price: 50}, {name: '立牌款式', price: 60}, {name: '流沙油速', price: 10}, {name: '閃粉數量', price: 10}, {name: '特殊亮片', price: 30}, {name: '吊牌款式', price: 40}, {name: 'PET膠帶', price: 20}, {name: '磁吸款', price: 40}] },
        { name: '7x10cm長方形', price: 250, img: 'https://picsum.photos/seed/rect4/400', addons: [{name: '多層流沙層', price: 50}, {name: '流沙油速', price: 10}, {name: '閃粉數量', price: 10}, {name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}] },
        { name: '7x20cm長方形', price: 300, img: 'https://picsum.photos/seed/rect5/400', addons: [{name: '流沙油速', price: 10}, {name: '特殊亮片', price: 30}, {name: '閃粉數量', price: 10}, {name: 'PET膠帶', price: 20}] },
        { name: '7x21cm長方形', price: 300, img: 'https://picsum.photos/seed/rect6/400', addons: [{name: '流沙油速', price: 10}, {name: '特殊亮片', price: 30}, {name: '閃粉數量', price: 10}, {name: 'PET膠帶', price: 20}] },
        { name: '7.5x13cm長方形', price: 250, img: 'https://picsum.photos/seed/rect7/400', addons: [{name: '多層流沙層', price: 50}, {name: '流沙油速', price: 10}, {name: '閃粉數量', price: 10}, {name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '磁吸款', price: 40}, {name: '立牌款式', price: 60}] },
        { name: '8x21cm長方形', price: 320, img: 'https://picsum.photos/seed/rect8/400', addons: [{name: '流沙油速', price: 10}, {name: '特殊亮片', price: 30}, {name: '閃粉數量', price: 10}, {name: 'PET膠帶', price: 20}] },
        { name: '10x15cm長方形', price: 270, img: 'https://picsum.photos/seed/rect9/400', addons: [{name: '多層流沙層', price: 50}, {name: '流沙油速', price: 10}, {name: '閃粉數量', price: 10}, {name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '磁吸款', price: 40}, {name: '雙色款', price: 50}] },
    ],
    '圓形': [
        { name: '5cm圓形', price: 120, img: 'https://picsum.photos/seed/circ1/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '流沙油速', price: 10}] },
        { name: '6cm圓形', price: 150, img: 'https://picsum.photos/seed/circ2/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '流沙油速', price: 10}] },
        { name: '8cm圓形', price: 180, img: 'https://picsum.photos/seed/circ3/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '流沙油速', price: 10}, {name: '立牌款式', price: 60}] },
        { name: '10cm圓形', price: 220, img: 'https://picsum.photos/seed/circ4/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}, {name: '流沙油速', price: 10}, {name: '立牌款式', price: 60}] },
    ],
    '異形': [
        { name: '7.5x15cm圓頂彩窗', price: 0, img: 'https://picsum.photos/seed/spec1/400', addons: [{name: '流沙油速', price: 10}, {name: '特殊亮片', price: 30}, {name: '閃粉數量', price: 10}, {name: 'PET膠帶', price: 20}] },
        { name: '7x15cm票根', price: 270, img: 'https://picsum.photos/seed/spec2/400', addons: [{name: '特殊亮片', price: 30}, {name: '流沙油速', price: 10}, {name: '閃粉數量', price: 10}, {name: 'PET膠帶', price: 20}] },
        { name: '7x20cm票根', price: 300, img: 'https://picsum.photos/seed/spec3/400', addons: [{name: '特殊亮片', price: 30}, {name: '流沙油速', price: 10}, {name: '閃粉數量', price: 10}, {name: 'PET膠帶', price: 20}, {name: '雙色款', price: 50}] },
        { name: '通行證', price: 170, img: 'https://picsum.photos/seed/spec4/400', addons: [{name: '流沙油速', price: 10}, {name: '特殊亮片', price: 30}, {name: '閃粉數量', price: 10}] },
        { name: '異形總覽', price: 100, img: 'https://picsum.photos/seed/spec5/400', addons: [{name: '立牌款式', price: 60}, {name: '吊牌款式', price: 40}, {name: '流沙油速', price: 10}, {name: '特殊亮片', price: 30}, {name: '閃粉數量', price: 10}, {name: 'PET膠帶', price: 20}] },
    ],
    '徽章磚': [
        { name: '58mm徽章磚', price: 200, img: 'https://picsum.photos/seed/badge1/400', addons: [{name: '特殊亮片', price: 30}, {name: '流沙油速', price: 10}, {name: 'PET膠帶', price: 20}, {name: '立牌款式', price: 60}] },
        { name: '75mm徽章磚', price: 240, img: 'https://picsum.photos/seed/badge2/400', addons: [{name: '特殊亮片', price: 30}, {name: '流沙油速', price: 10}, {name: 'PET膠帶', price: 20}, {name: '立牌款式', price: 60}] },
    ],
    '雙色磚': [
        { name: '雙色流麻磚 (常規)', price: 300, img: 'https://picsum.photos/seed/twotone1/400', addons: [{name: '特殊亮片', price: 30}, {name: '流沙油速', price: 10}, {name: 'PET膠帶', price: 20}, {name: '磁吸款', price: 40}] },
        { name: '漸層雙色磚', price: 350, img: 'https://picsum.photos/seed/twotone2/400', addons: [{name: '特殊亮片', price: 30}, {name: '流沙油速', price: 10}, {name: 'PET膠帶', price: 20}, {name: '磁吸款', price: 40}] },
    ],
};


export const MOCK_COMMISSIONS: Commission[] = [
  {
    id: 'c-101',
    artistId: '麻糬流麻',
    clientName: '小星',
    title: 'OC 貓耳少女雙人吊飾',
    description: '雙層雙面，愛心形狀。入油：粉色 + 白色亮片。配件：貓咪形狀的金色D扣。',
    type: '流麻吊飾',
    price: 850,
    status: CommissionStatus.IN_PRODUCTION,
    dateAdded: '2023-10-25',
    lastUpdated: '2023-11-02',
    thumbnailUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: 'c-102',
    artistId: '麻糬流麻',
    clientName: '阿光',
    title: '遊戲角色印象立牌',
    description: '角色在星空下的場景。底座印花為星象盤。希望有星星和月亮形狀的亮片。',
    type: '流麻立牌',
    price: 1200,
    status: CommissionStatus.DEPOSIT_PAID,
    dateAdded: '2023-10-28',
    lastUpdated: '2023-10-30',
    thumbnailUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 'c-103',
    artistId: '麻糬流麻',
    clientName: 'Momo',
    title: '寵物兔兔紀念流麻磚',
    description: '需要根據提供的寵物照片繪製Q版。整體色調為溫暖的米白色。內部亮片想要胡蘿蔔形狀的。',
    type: '流麻磚',
    price: 1500,
    status: CommissionStatus.QUEUED,
    dateAdded: '2023-11-01',
    lastUpdated: '2023-11-01',
    thumbnailUrl: 'https://picsum.photos/400/250?random=3'
  },
  {
    id: 'c-104',
    artistId: '麻糬流麻',
    clientName: 'Viper007',
    title: '原創機甲主題吊飾',
    description: '單層透明壓克力，背景有科技感的線條。藍色入油 + 銀色六角形亮片。',
    type: '流麻吊飾',
    price: 700,
    status: CommissionStatus.COMPLETED,
    dateAdded: '2023-10-20',
    lastUpdated: '2023-10-29',
    thumbnailUrl: 'https://picsum.photos/400/400?random=4'
  }
];