import { UUID } from "crypto";

export class LicenseDTO {
    licenseCode: UUID;
    startDate: Date;
    expirationDate?: Date;
    state: number;
    price: number;
    places?: number;
    comment?: string;
}