import { 
  OptionType, 
  EventAction, 
  EntityType, 
  PaymentStatus, 
  BeneficiaryRelation, 
  LegalProcedureStatus 
} from '../types/index.js';
import { Contract } from './contract.js';
import { Accident } from './accident.js';
import { Payment } from './payment.js';
import { Client } from './client.js';
import { Beneficiary, ContractBeneficiary } from './beneficiary.js';
import { LegalProcedure } from './legal-procedure.js';

export class UpdatedContract extends Contract {
  private accidents: Accident[] = [];
  private payments: Payment[] = [];

  addAccident(accident: Accident): void {
    this.accidents.push(accident);
  }

  getAccidents(): Accident[] {
    return [...this.accidents];
  }

  getUnassignedAccidents(): Accident[] {
    return this.accidents.filter((accident) => !accident.isAssigned());
  }

  addPayment(payment: Payment): void {
    this.payments.push(payment);
  }

  getPayments(): Payment[] {
    return [...this.payments];
  }

  getCompletedPayments(): Payment[] {
    return this.payments.filter((payment) => payment.isCompleted());
  }

  getFailedPayments(): Payment[] {
    return this.payments.filter(
      (payment) => payment.status === PaymentStatus.FAILED
    );
  }

  getPendingPayments(): Payment[] {
    return this.payments.filter(
      (payment) => payment.status === PaymentStatus.PENDING
    );
  }

  getTotalPaidAmount(): number {
    return this.getCompletedPayments().reduce(
      (total, payment) => total + payment.amount,
      0
    );
  }
}

export class ContractOption {
  constructor(
    public id: number,
    public type: OptionType,
    public name: string,
    public description: string,
    public monthlyCost: number
  ) {}

  getAnnualCost(): number {
    return this.monthlyCost * 12;
  }
}

export class SystemEvent {
  constructor(
    public id: number,
    public date: Date,
    public action: EventAction,
    public entityType: EntityType,
    public entityId: number,
    public description: string,
    public clientId?: number // To easily filter events by client
  ) {}
}

export class FullContract extends UpdatedContract {
  private options: ContractOption[] = [];

  addOption(option: ContractOption): void {
    // Check if option already exists
    const existingOption = this.options.find((opt) => opt.id === option.id);
    if (!existingOption) {
      this.options.push(option);
    }
  }

  removeOption(optionId: number): boolean {
    const index = this.options.findIndex((opt) => opt.id === optionId);
    if (index !== -1) {
      this.options.splice(index, 1);
      return true;
    }
    return false;
  }

  getOptions(): ContractOption[] {
    return [...this.options];
  }

  getTotalOptionsCost(): number {
    return this.options.reduce(
      (total, option) => total + option.monthlyCost,
      0
    );
  }

  calculateFinalPriceWithOptions(): number {
    return this.calculateFinalPrice() + this.getTotalOptionsCost();
  }

  getOptionsByType(type: OptionType): ContractOption[] {
    return this.options.filter((option) => option.type === type);
  }
}

export class EventLogger {
  private events: SystemEvent[] = [];
  private eventIdCounter: number = 1;

  logEvent(
    action: EventAction,
    entityType: EntityType,
    entityId: number,
    description: string,
    clientId?: number
  ): SystemEvent {
    const event = new SystemEvent(
      this.eventIdCounter++,
      new Date(),
      action,
      entityType,
      entityId,
      description,
      clientId
    );
    this.events.push(event);
    return event;
  }

  getEventsByClient(clientId: number): SystemEvent[] {
    return this.events.filter((event) => event.clientId === clientId);
  }

  getEventsByAction(action: EventAction): SystemEvent[] {
    return this.events.filter((event) => event.action === action);
  }

  getEventsByEntity(entityType: EntityType, entityId: number): SystemEvent[] {
    return this.events.filter(
      (event) => event.entityType === entityType && event.entityId === entityId
    );
  }

  getAllEvents(): SystemEvent[] {
    return [...this.events].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getRecentEvents(count: number = 10): SystemEvent[] {
    return this.getAllEvents().slice(0, count);
  }
}

export class EnhancedClient extends Client {
  private fullContracts: FullContract[] = [];

  addFullContract(contract: FullContract): void {
    this.fullContracts.push(contract);
    // Also add to base client for compatibility
    super.addContract(contract);
  }

  getFullContracts(): FullContract[] {
    return [...this.fullContracts];
  }

  getActiveFullContracts(): FullContract[] {
    return this.fullContracts.filter((contract) => contract.isActive());
  }

  getActiveContractsSummary(): string[] {
    return this.getActiveFullContracts().map(
      (contract) =>
        `Contract ${
          contract.id
        }: €${contract.calculateFinalPriceWithOptions()}/month (${
          contract.getOptions().length
        } options)`
    );
  }

  getOngoingAccidents(): Accident[] {
    const accidents: Accident[] = [];
    this.fullContracts.forEach((contract) => {
      accidents.push(
        ...contract.getAccidents().filter((acc) => acc.isAssigned())
      );
    });
    return accidents;
  }

  getPaymentHistory(): Payment[] {
    const payments: Payment[] = [];
    this.fullContracts.forEach((contract) => {
      payments.push(...contract.getPayments());
    });
    return payments.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getTotalMonthlyPremium(): number {
    return this.getActiveFullContracts().reduce(
      (total, contract) => total + contract.calculateFinalPriceWithOptions(),
      0
    );
  }
}

// Classes étendues pour la Partie 4
export class AdvancedContract extends FullContract {
  private beneficiaries: ContractBeneficiary[] = [];
  private legalProcedures: LegalProcedure[] = [];

  addBeneficiary(beneficiary: Beneficiary, sharePercentage: number): ContractBeneficiary {
    const contractBeneficiary = new ContractBeneficiary(beneficiary, sharePercentage, this.id);
    
    // Vérifier que le total des parts ne dépasse pas 100%
    const totalShares = this.getTotalBeneficiaryShares() + sharePercentage;
    if (totalShares > 100) {
      throw new Error(`Cannot add beneficiary: total shares would exceed 100% (current: ${this.getTotalBeneficiaryShares()}%, trying to add: ${sharePercentage}%)`);
    }
    
    this.beneficiaries.push(contractBeneficiary);
    return contractBeneficiary;
  }

  removeBeneficiary(beneficiaryId: number): boolean {
    const index = this.beneficiaries.findIndex(cb => cb.beneficiary.id === beneficiaryId);
    if (index !== -1) {
      this.beneficiaries.splice(index, 1);
      return true;
    }
    return false;
  }

  getBeneficiaries(): ContractBeneficiary[] {
    return [...this.beneficiaries];
  }

  getTotalBeneficiaryShares(): number {
    return this.beneficiaries.reduce((total, cb) => total + cb.sharePercentage, 0);
  }

  getBeneficiaryByRelation(relation: BeneficiaryRelation): ContractBeneficiary[] {
    return this.beneficiaries.filter(cb => cb.beneficiary.relation === relation);
  }

  addLegalProcedure(procedure: LegalProcedure): void {
    this.legalProcedures.push(procedure);
  }

  getLegalProcedures(): LegalProcedure[] {
    return [...this.legalProcedures];
  }

  getOpenLegalProcedures(): LegalProcedure[] {
    return this.legalProcedures.filter(proc => proc.isOpen());
  }

  getLegalProceduresByStatus(status: LegalProcedureStatus): LegalProcedure[] {
    return this.legalProcedures.filter(proc => proc.status === status);
  }
}

export class ComprehensiveClient extends EnhancedClient {
  private advancedContracts: AdvancedContract[] = [];

  addAdvancedContract(contract: AdvancedContract): void {
    this.advancedContracts.push(contract);
    // Also add to parent classes for compatibility
    super.addFullContract(contract);
  }

  getAdvancedContracts(): AdvancedContract[] {
    return [...this.advancedContracts];
  }

  getAllBeneficiaries(): ContractBeneficiary[] {
    const allBeneficiaries: ContractBeneficiary[] = [];
    this.advancedContracts.forEach(contract => {
      allBeneficiaries.push(...contract.getBeneficiaries());
    });
    return allBeneficiaries;
  }

  getBeneficiariesByRelation(relation: BeneficiaryRelation): ContractBeneficiary[] {
    return this.getAllBeneficiaries().filter(cb => cb.beneficiary.relation === relation);
  }

  getAllLegalProcedures(): LegalProcedure[] {
    const allProcedures: LegalProcedure[] = [];
    this.advancedContracts.forEach(contract => {
      allProcedures.push(...contract.getLegalProcedures());
    });
    return allProcedures;
  }

  getOpenLegalProcedures(): LegalProcedure[] {
    return this.getAllLegalProcedures().filter(proc => proc.isOpen());
  }

  getLegalProceduresCount(): { open: number; settled: number; cancelled: number } {
    const procedures = this.getAllLegalProcedures();
    return {
      open: procedures.filter(p => p.status === LegalProcedureStatus.OPEN || p.status === LegalProcedureStatus.IN_PROGRESS).length,
      settled: procedures.filter(p => p.status === LegalProcedureStatus.SETTLED).length,
      cancelled: procedures.filter(p => p.status === LegalProcedureStatus.CANCELLED).length,
    };
  }
}
