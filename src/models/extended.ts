import {
  OptionType,
  EventAction,
  EntityType,
  PaymentStatus,
  BeneficiaryRelation,
  LegalProcedureStatus,
  ContractStatus,
} from "../types/index.js";
import { Contract } from "./contract.js";
import { Accident } from "./accident.js";
import { Payment } from "./payment.js";
import { Client } from "./client.js";
import { Beneficiary, ContractBeneficiary } from "./beneficiary.js";
import { LegalProcedure } from "./legal-procedure.js";
import { AccidentReimbursement } from "./reimbursement.js";
import { Audit, Anomaly } from "./audit.js";
import { ReinsuranceCoverage, ReinsuranceContract } from "./reinsurance.js";

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
    public clientId?: number
  ) {}
}

export class FullContract extends UpdatedContract {
  private options: ContractOption[] = [];

  addOption(option: ContractOption): void {
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

export class AdvancedContract extends FullContract {
  private beneficiaries: ContractBeneficiary[] = [];
  private legalProcedures: LegalProcedure[] = [];

  addBeneficiary(
    beneficiary: Beneficiary,
    sharePercentage: number
  ): ContractBeneficiary {
    const contractBeneficiary = new ContractBeneficiary(
      beneficiary,
      sharePercentage,
      this.id
    );

    const totalShares = this.getTotalBeneficiaryShares() + sharePercentage;
    if (totalShares > 100) {
      throw new Error(
        `Cannot add beneficiary: total shares would exceed 100% (current: ${this.getTotalBeneficiaryShares()}%, trying to add: ${sharePercentage}%)`
      );
    }

    this.beneficiaries.push(contractBeneficiary);
    return contractBeneficiary;
  }

  removeBeneficiary(beneficiaryId: number): boolean {
    const index = this.beneficiaries.findIndex(
      (cb) => cb.beneficiary.id === beneficiaryId
    );
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
    return this.beneficiaries.reduce(
      (total, cb) => total + cb.sharePercentage,
      0
    );
  }

  getBeneficiaryByRelation(
    relation: BeneficiaryRelation
  ): ContractBeneficiary[] {
    return this.beneficiaries.filter(
      (cb) => cb.beneficiary.relation === relation
    );
  }

  addLegalProcedure(procedure: LegalProcedure): void {
    this.legalProcedures.push(procedure);
  }

  getLegalProcedures(): LegalProcedure[] {
    return [...this.legalProcedures];
  }

  getOpenLegalProcedures(): LegalProcedure[] {
    return this.legalProcedures.filter((proc) => proc.isOpen());
  }

  getLegalProceduresByStatus(status: LegalProcedureStatus): LegalProcedure[] {
    return this.legalProcedures.filter((proc) => proc.status === status);
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
    this.advancedContracts.forEach((contract) => {
      allBeneficiaries.push(...contract.getBeneficiaries());
    });
    return allBeneficiaries;
  }

  getBeneficiariesByRelation(
    relation: BeneficiaryRelation
  ): ContractBeneficiary[] {
    return this.getAllBeneficiaries().filter(
      (cb) => cb.beneficiary.relation === relation
    );
  }

  getAllLegalProcedures(): LegalProcedure[] {
    const allProcedures: LegalProcedure[] = [];
    this.advancedContracts.forEach((contract) => {
      allProcedures.push(...contract.getLegalProcedures());
    });
    return allProcedures;
  }

  getOpenLegalProcedures(): LegalProcedure[] {
    return this.getAllLegalProcedures().filter((proc) => proc.isOpen());
  }

  getLegalProceduresCount(): {
    open: number;
    settled: number;
    cancelled: number;
  } {
    const procedures = this.getAllLegalProcedures();
    return {
      open: procedures.filter(
        (p) =>
          p.status === LegalProcedureStatus.OPEN ||
          p.status === LegalProcedureStatus.IN_PROGRESS
      ).length,
      settled: procedures.filter(
        (p) => p.status === LegalProcedureStatus.SETTLED
      ).length,
      cancelled: procedures.filter(
        (p) => p.status === LegalProcedureStatus.CANCELLED
      ).length,
    };
  }
}

export class UltimateContract extends AdvancedContract {
  private accidentReimbursements: Map<number, AccidentReimbursement> =
    new Map();
  private reinsuranceCoverage?: ReinsuranceCoverage;
  private audits: Audit[] = [];

  constructor(
    id: number,
    basePrice: number,
    status: ContractStatus,
    reduction: number = 0,
    bonus: number = 0
  ) {
    super(id, basePrice, status, reduction, bonus);
  }

  createAccidentReimbursement(
    accidentId: number,
    claimAmount: number
  ): AccidentReimbursement {
    if (this.accidentReimbursements.has(accidentId)) {
      throw new Error(
        `Reimbursement already exists for accident ${accidentId}`
      );
    }

    const reimbursement = new AccidentReimbursement(accidentId, claimAmount);
    this.accidentReimbursements.set(accidentId, reimbursement);
    return reimbursement;
  }

  getAccidentReimbursement(
    accidentId: number
  ): AccidentReimbursement | undefined {
    return this.accidentReimbursements.get(accidentId);
  }

  getAllAccidentReimbursements(): AccidentReimbursement[] {
    return Array.from(this.accidentReimbursements.values());
  }

  getTotalReimbursements(): number {
    return Array.from(this.accidentReimbursements.values()).reduce(
      (total, ar) => {
        return total + ar.getTotalReimbursed();
      },
      0
    );
  }

  setReinsuranceCoverage(coverage: ReinsuranceCoverage): void {
    this.reinsuranceCoverage = coverage;
  }

  getReinsuranceCoverage(): ReinsuranceCoverage | undefined {
    return this.reinsuranceCoverage;
  }

  calculateReinsuranceDistribution(
    claimAmount: number
  ): Map<
    string,
    { company: string; amount: number; percentage: number }
  > | null {
    if (!this.reinsuranceCoverage) {
      return null;
    }
    return this.reinsuranceCoverage.calculateReinsuranceShares(claimAmount);
  }

  addAudit(audit: Audit): void {
    this.audits.push(audit);
  }

  getAudits(): Audit[] {
    return [...this.audits];
  }

  getLatestAudit(): Audit | undefined {
    return this.audits.sort(
      (a, b) => b.startDate.getTime() - a.startDate.getTime()
    )[0];
  }

  getUnresolvedAnomalies(): Anomaly[] {
    const allAnomalies: Anomaly[] = [];
    this.audits.forEach((audit) => {
      allAnomalies.push(...audit.getUnresolvedAnomalies());
    });
    return allAnomalies;
  }
}

export class UltimateClient extends ComprehensiveClient {
  private ultimateContracts: UltimateContract[] = [];

  addUltimateContract(contract: UltimateContract): void {
    this.ultimateContracts.push(contract);
    super.addAdvancedContract(contract);
  }

  getUltimateContracts(): UltimateContract[] {
    return [...this.ultimateContracts];
  }

  getTotalReimbursements(): number {
    return this.ultimateContracts.reduce((total, contract) => {
      return total + contract.getTotalReimbursements();
    }, 0);
  }

  getActiveReinsuranceContracts(): ReinsuranceContract[] {
    const allContracts: ReinsuranceContract[] = [];
    this.ultimateContracts.forEach((contract) => {
      const coverage = contract.getReinsuranceCoverage();
      if (coverage) {
        allContracts.push(...coverage.getActiveReinsuranceContracts());
      }
    });
    return allContracts;
  }

  getAllUnresolvedAnomalies(): Anomaly[] {
    const allAnomalies: Anomaly[] = [];
    this.ultimateContracts.forEach((contract) => {
      allAnomalies.push(...contract.getUnresolvedAnomalies());
    });
    return allAnomalies;
  }

  getReinsuranceCoverageOverview(): {
    totalCoverage: number;
    selfRetained: number;
    riskDistribution: Map<string, number>;
  } {
    const riskDistribution = new Map<string, number>();
    let totalCoverage = 0;
    let contractCount = 0;

    this.ultimateContracts.forEach((contract) => {
      const coverage = contract.getReinsuranceCoverage();
      if (coverage) {
        contractCount++;
        totalCoverage += coverage.getTotalCoveragePercentage();

        coverage.getActiveReinsuranceContracts().forEach((reinsContract) => {
          const existing =
            riskDistribution.get(reinsContract.reinsurer.name) || 0;
          riskDistribution.set(
            reinsContract.reinsurer.name,
            existing + reinsContract.riskPercentage
          );
        });
      }
    });

    const avgCoverage = contractCount > 0 ? totalCoverage / contractCount : 0;

    return {
      totalCoverage: avgCoverage,
      selfRetained: 100 - avgCoverage,
      riskDistribution,
    };
  }
}
