export type Preorder = {
    id: number;
    fullName: string;
    quantity: number;
    finalPrice: number;
    paymentMethod: string;
    date: string;                 // DATE (YYYY-MM-DD)
    checkedInCount: number | null;
    createdAt: string;            // timestamptz
    updatedAt: string;            // timestamptz
    UserId: number | null;
  };
  
  export type DoorSale = {
    id: number;
    fullName: string;
    quantity: number;
    finalPrice: number;
    paymentMethod: string;
    date: string;                 // DATE
    createdAt: string;            // timestamptz
    updatedAt: string;            // timestamptz
    UserId: number | null;
  };
  