import { ClientType } from '../types/index.js';
export class Client {
    constructor(id, contact, type = ClientType.STANDARD) {
        this.id = id;
        this.contact = contact;
        this.type = type;
        this.contracts = [];
    }
    isVip() {
        return this.type === ClientType.VIP;
    }
    addContract(contract) {
        if (this.isVip()) {
            contract.reduction += contract.basePrice * 0.1;
            contract.bonus += 50;
        }
        this.contracts.push(contract);
    }
    getActiveContracts() {
        return this.contracts.filter((contract) => contract.isActive());
    }
    getAllContracts() {
        return [...this.contracts];
    }
}
