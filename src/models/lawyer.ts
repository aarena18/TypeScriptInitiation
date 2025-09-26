import { LawyerSpecialty } from '../types/index.js';

export class Lawyer {
  private assignedProcedures: number[] = [];

  constructor(
    public id: number,
    public name: string,
    public specialty: LawyerSpecialty,
    public barNumber: string // Numéro au barreau
  ) {}

  canHandle(procedureType: LawyerSpecialty): boolean {
    return this.specialty === procedureType;
  }

  assignProcedure(procedureId: number): void {
    if (!this.assignedProcedures.includes(procedureId)) {
      this.assignedProcedures.push(procedureId);
    }
  }

  getAssignedProcedures(): number[] {
    return [...this.assignedProcedures];
  }

  getWorkload(): number {
    return this.assignedProcedures.length;
  }

  removeProcedure(procedureId: number): boolean {
    const index = this.assignedProcedures.indexOf(procedureId);
    if (index !== -1) {
      this.assignedProcedures.splice(index, 1);
      return true;
    }
    return false;
  }
}