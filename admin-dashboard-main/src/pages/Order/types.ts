export enum DeliveryType {
    NewPost = 0,
    SelfPickup = 1,
    Courier = 2,
}

export enum PaymentMethod {
    Cash = 0,
    Card = 1,
}

export enum OrderStatus {
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
    Shipped = 3,
    Completed = 4,
    Canceled = 5
}

export interface OrderCreateDto {
    advertisementId: number;

    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;

    deliveryMethod: number; // enum numeric

    settlement: string | null;
    newPostWarehouse: string | null;
    deliveryAddress: string | null;

    paymentMethod: number;
}

export interface OrderResponseDto {
    id: number;
    advertisementId: number;
    status: string;
    totalPrice: number;
    createdAt: string;
}

export interface IOrder {
    id: number;
    advertisementName: string | null;
    price: number;
    status: OrderStatus;
    createDate: string;
    advertisementImage?: string | null;
}