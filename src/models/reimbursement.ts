import { ReimbursementMethod, ReimbursementStatus } from '../types/index.js';

export class Reimbursement {
  constructor(
    public id: number,
    public accidentId: number,
    public amount: number,
    public date: Date,
    public method: ReimbursementMethod,
    public status: ReimbursementStatus = ReimbursementStatus.PENDING,
    public isPartial: boolean = false,
    public description?: string
  ) {}

  process(): void {
    this.status = ReimbursementStatus.PROCESSED;
  }

  fail(): void {
    this.status = ReimbursementStatus.FAILED;
  }

  isProcessed(): boolean {
    return this.status === ReimbursementStatus.PROCESSED;
  }
}

export class AccidentReimbursement {
  private reimbursements: Reimbursement[] = [];

  constructor(
    public accidentId: number,
    public totalClaimAmount: number
  ) {}

  addReimbursement(reimbursement: Reimbursement): void {
    if (reimbursement.accidentId !== this.accidentId) {
      throw new Error("Reimbursement must be for the same accident");
    }
    
    const currentTotal = this.getTotalReimbursed();
    if (currentTotal + reimbursement.amount > this.totalClaimAmount) {
      throw new Error(`Reimbursement amount exceeds claim total. Available: €${this.totalClaimAmount - currentTotal}`);
    }
    
    this.reimbursements.push(reimbursement);
  }

  getReimbursements(): Reimbursement[] {
    return [...this.reimbursements];
  }

  getTotalReimbursed(): number {
    return this.reimbursements.reduce((total, reimbursement) => {
      return reimbursement.isProcessed() ? total + reimbursement.amount : total;
    }, 0);
  }

  getRemainingAmount(): number {
    return this.totalClaimAmount - this.getTotalReimbursed();
  }

  isFullyReimbursed(): boolean {
    return this.getRemainingAmount() === 0;
  }

  getProcessedReimbursements(): Reimbursement[] {
    return this.reimbursements.filter(r => r.isProcessed());
  }

  getPendingReimbursements(): Reimbursement[] {
    return this.reimbursements.filter(r => r.status === ReimbursementStatus.PENDING);
  }
}