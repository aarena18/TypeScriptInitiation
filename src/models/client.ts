import { ClientType } from '../types/index.js';
import { ContactInfo, Contract } from './contract.js';

export class Client {
  private contracts: Contract[] = [];

  constructor(
    public id: number,
    public contact: ContactInfo,
    public type: ClientType = ClientType.STANDARD
  ) {}

  isVip(): boolean {
    return this.type === ClientType.VIP;
  }

  addContract(contract: Contract): void {
    if (this.isVip()) {
      contract.reduction += contract.basePrice * 0.1;
      contract.bonus += 50;
    }
    this.contracts.push(contract);
  }

  getActiveContracts(): Contract[] {
    return this.contracts.filter((contract) => contract.isActive());
  }

  getAllContracts(): Contract[] {
    return [...this.contracts];
  }
}