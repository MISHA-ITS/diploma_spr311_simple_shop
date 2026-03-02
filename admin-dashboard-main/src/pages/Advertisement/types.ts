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
    updateDate: string;
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

export type AdvertisementsTab =
    | "all"
    | "active"
    | "waiting"
    | "inactive"
    | "rejected";

export interface Props {
    advertisements: IAdvertisement[];
}

