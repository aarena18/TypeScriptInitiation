import { ContractStatus } from '../types/index.js';
export class ContactInfo {
    constructor(email, phone) {
        this.email = email;
        this.phone = phone;
    }
}
export class Contract {
    constructor(id, basePrice, status, reduction = 0, bonus = 0) {
        this.id = id;
        this.basePrice = basePrice;
        this.status = status;
        this.reduction = reduction;
        this.bonus = bonus;
    }
    calculateFinalPrice() {
        return this.basePrice - this.reduction + this.bonus;
    }
    isActive() {
        return this.status === ContractStatus.ACTIVE;
    }
}
