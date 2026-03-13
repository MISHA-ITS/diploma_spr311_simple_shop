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
    advertisementName: string | null;
    advertisementImage: string | null;

    buyerId: number;
    buyerFirstName: string | null;
    buyerLastName?: string | null;
    buyerPhone?: string | null;
    buyerLocation?: string | null;

    sellerId: number;
    sellerFirstName: string | null;
    sellerLastName?: string | null;
    sellerPhone?: string | null;
    sellerLocation?: string | null;

    price: number;
    status: number;
    createDate: string;
}

export interface IOrder {
    id: number;
    advertisementName: string | null;
    price: number;
    status: OrderStatus;
    createDate: string;
    advertisementImage?: string | null;
}

export interface OrderDetailsDto {
    id: number
    advertisementId: number
    advertisementName: string
    advertisementImage?: string
    price: number
    status: number
    createDate: string

    buyerFirstName?: string
    buyerLastName?: string
    buyerPhone?: string
    buyerLocation?: string

    sellerFirstName?: string
    sellerLastName?: string
    sellerPhone?: string
    sellerLocation?: string
}