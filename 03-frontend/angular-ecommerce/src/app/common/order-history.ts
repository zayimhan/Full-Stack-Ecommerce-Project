export class OrderHistory {
    constructor(
      public id: number, // <-- string yerine number
      public orderTrackingNumber: string,
      public totalPrice: number,
      public totalQuantity: number,
      public dateCreated: Date,
      public status: string,
      public cancelRequested?: boolean, // İptal talebi durumu
    ) {}
  }
  