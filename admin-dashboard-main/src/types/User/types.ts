export interface IUser {
    id: number
    email: string
    emailConfirmed: boolean
    phoneNumberConfirmed: boolean
    twoFactorEnabled: boolean
    phoneNumber?: string | undefined
    firstName?: string | undefined
    lastName?: string | undefined
    photo?: string | undefined
    createdDate: Date
    lastActivity: Date
    webSite?: string | undefined
    about?: string | undefined
    settlementRef?: string | undefined
    settlementDescrption?: string | undefined
    adverts: number[];
    favoriteAdverts: number[];
}