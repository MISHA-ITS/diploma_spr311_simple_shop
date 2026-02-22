export enum DeliveryType {
    NewPost = 0,
    SelfPickup = 1,
    Courier = 2,
}

export enum PaymentMethod {
    Cash = 0,
    Card = 1,
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