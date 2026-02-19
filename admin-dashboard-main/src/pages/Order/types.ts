export enum DeliveryType {
    Courier = 0,
    NovaPoshta = 1,
}

export enum PaymentMethod {
    Cash = 0,
    Card = 1,
}

export interface OrderCreateDto {
    advertisementId: number;
    firstName: string;
    phone: string;
    deliveryType: DeliveryType;
    paymentMethod: PaymentMethod;
    cityRef: string;
    warehouseId?: number;
}

export interface OrderResponseDto {
    id: number;
    advertisementId: number;
    status: string;
    totalPrice: number;
    createdAt: string;
}