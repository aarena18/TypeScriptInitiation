import { LegalProcedureStatus } from '../types/index.js';

export class LegalProcedure {
  constructor(
    public id: number,
    public openingDate: Date,
    public status: LegalProcedureStatus,
    public accidentIds: number[],
    public description: string,
    public assignedLawyerId?: number
  ) {}

  isAssigned(): boolean {
    return this.assignedLawyerId !== undefined;
  }

  addAccident(accidentId: number): void {
    if (!this.accidentIds.includes(accidentId)) {
      this.accidentIds.push(accidentId);
    }
  }

  removeAccident(accidentId: number): boolean {
    const index = this.accidentIds.indexOf(accidentId);
    if (index !== -1) {
      this.accidentIds.splice(index, 1);
      return true;
    }
    return false;
  }

  close(status: LegalProcedureStatus.SETTLED | LegalProcedureStatus.CANCELLED): void {
    this.status = status;
  }

  isOpen(): boolean {
    return this.status === LegalProcedureStatus.OPEN || this.status === LegalProcedureStatus.IN_PROGRESS;
  }
}