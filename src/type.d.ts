// redux store
interface IsAdminState {
  user: { isAdmin: boolean };
}

interface IsLoginState {
  user: { isLogin: boolean };
}

interface CartState {
  cart: {
    cartProducts: [
      {
        productName: string;
        productCode: string;
        img: string;
        price: number;
        size: string;
        quantity: number;
        unitSumPrice: number;
        _id: string;
        color?: string | undefined;
      },
    ];
    cartProductsLength: number;
  };
}

type ReduxAction = {
  type?: string;
  payload?: any;
};

// 싱글 주문 redux 타입
interface sumDataType {
  productName: string;
  productCode: string;
  price: number;
  quantity: number;
  size: string;
  totalPrice: number;
  img: string;
  color: string | undefined;
}
// ------

interface ProductsType {
  productName: string;
  productCode: string;
  img?: string[];
  price?: number;
  size?: { OS: number; S: number; M: number; L: number };
  quantity?: number;
  unitSumPrice?: number;
  detail?: string;
  totalPrice?: number;
  color?: string | undefined;
  __v?: number;
  _id?: string;
  category?: string;
  createAt?: string;
}

// CancelList ---
interface CancelListType {
  cancels: {
    cancelAmount: number;
    cancelReason: string;
    canceledAt: string;
    transactionKey: string;
  };
}
//---

// orderList---
interface Order_Cancel_ListType extends CancelListType {
  isCancel: boolean;
  isDelivered: boolean;
  isOrdered: boolean;
  isRefund: boolean;
  isRetrieved: boolean;
  isReturn: boolean;
  isReturnSubmit: boolean;
  isShipping: boolean;
  payments: {
    approvedAt: string;
    discount: null;
    method: string;
    orderId: string;
    orderName: string;
    status: string;
    totalAmount: number;
  };
  products: [
    {
      color?: string | null | undefined;
      img: string;
      price: number;
      productCode: string;
      productName: string;
      quantity: number;
      size: string;
      unitSumPrice: number;
      _id: string;
    },
  ];
  recipient: {
    message: string;
    phoneCode: string;
    phoneLastNum: string;
    phoneMidNum: string;
    recipientAddress: string;
    recipientAddressDetail: string;
    recipientName: string;
    recipientZipcode: string;
  };
  shippingAt: string;
  shippingCode?: number | null | undefined;
  submitReturn?: {
    reason?: string | null | undefined;
    return_img?: [string | null | undefined];
    return_message?: string | null | undefined;
    submitAt?: string | null | undefined;
  };
  user: string;
  __v?: number;
  _id?: string;
}
//---

// Address index--
interface AddressDefault {
  address: string;
  addressDetail?: string | null | undefined;
  isDefault: boolean;
  message_ad?: string | null | undefined;
  recipient: string;
  recipientPhone: string;
  zipCode: string;
  _id: string;
}
// ---

// Daum PostInfo ---
interface DaumPostInfo {
  address: string;
  addressEnglish: string;
  bcode: string;
  bname: string;
  bname1: string;
  bname1English: string;
  bname2: string;
  bname2English: string;
  bnameEnglish: string;
  buildingCode: string;
  buildingName: string;
  hname: string;
  jibunAddress: string;
  jibunAddressEnglish: string; // '83-3, Yeokchon-dong, Eunpyeong-gu, Seoul, Korea';
  query: string;
  roadAddress: string;
  roadAddressEnglish: string; // '3, Yeonseo-ro 3-gil, Eunpyeong-gu, Seoul, Korea';
  roadname: string;
  roadnameCode: string;
  roadnameEnglish: string;
  sido: string; // '서울'
  sidoEnglish: string; //'Seoul';
  sigungu: string; // '은평구';
  sigunguCode: string; // '11380';
  sigunguEnglish: string; //'Eunpyeong-gu';
  userLanguageType: string; // 'K';
  zonecode: string; // '03421';
}

// 이미지 업로드 ---
interface ImagePreviewType {
  file: File;
  thumbnail?: string;
  type?: string;
}
