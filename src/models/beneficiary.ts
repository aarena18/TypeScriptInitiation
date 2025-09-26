import { BeneficiaryRelation } from '../types/index.js';

export class Beneficiary {
  constructor(
    public id: number,
    public name: string,
    public relation: BeneficiaryRelation,
    public email?: string,
    public phone?: string
  ) {}

  getContactInfo(): string {
    const contact = [];
    if (this.email) contact.push(`Email: ${this.email}`);
    if (this.phone) contact.push(`Phone: ${this.phone}`);
    return contact.length > 0 ? contact.join(", ") : "No contact info";
  }
}

export class ContractBeneficiary {
  constructor(
    public beneficiary: Beneficiary,
    public sharePercentage: number, 
    public contractId: number
  ) {
    if (sharePercentage <= 0 || sharePercentage > 100) {
      throw new Error("Share percentage must be between 0 and 100");
    }
  }

  getShareAmount(contractValue: number): number {
    return (contractValue * this.sharePercentage) / 100;
  }
}