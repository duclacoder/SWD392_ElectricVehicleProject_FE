export interface CreatePostPackageDTO {
    packageName: string;
    description: string;
    postPrice: number;
    currency?: string;
    postDuration: number;
    status?: string;
}

export interface PostPackage {
    postPackagesId: number;
    packageName: string;
    description: string;
    postPrice: number;
    currency: string;
    postDuration: number;
    status: string;
}

export interface GetAllPostPackageRequestDTO {
    page: number;
    pageSize: number;
}

export interface PostPackageCustom {
    postPackageId: number;
    packageName: string;
    description: string;
    postPrice: number;
    currency?: string;
    postDuration: number;
    status?: string;
}