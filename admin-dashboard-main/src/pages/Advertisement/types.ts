export interface IAdvertisement {
    id: number;
    name: string;
    description: string;
    price: number;
    isApproved: boolean;
    isBlocked: boolean;
    isActive: boolean;
    isContractPrice: boolean;
    userId: number;
}

