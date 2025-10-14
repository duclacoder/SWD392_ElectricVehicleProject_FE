export interface UserPackagesDTO {
    userName: string;
    packagesName: string;
    purchasedDuration: number;
    purchasedAtPrice: number;
    currency: string;
}

export interface UserPackagesCustom {
    userPackagesId?: number;
    userName: string;
    packagesName: string;
    purchasedDuration: number;
    purchasedAtPrice: number;
    currency: string;
    purchasedAt: Date;
    status: string;
}

export interface GetAllUserPackageRequestDTO {
    page: number;
    pageSize: number;
    userName?: string;
    packageName?: string;
}