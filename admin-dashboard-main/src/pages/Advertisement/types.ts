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
    categoryId: number;
    images: string[];
    settlement: SettlementDto;
}

type SettlementDto = {
    ref: string;
    description: string;
    settlementTypeDescription: string;
    region: string;
    area: string;
    warehouse: number;
}

