import { AccidentType, ExpertSpecialty } from '../types/index.js';

export class Accident {
  constructor(
    public id: number,
    public contractId: number,
    public date: Date,
    public type: AccidentType,
    public description?: string,
    public assignedExpertId?: number
  ) {}

  isAssigned(): boolean {
    return this.assignedExpertId !== undefined;
  }
}

export class Expert {
  private assignedAccidents: number[] = [];

  constructor(
    public id: number,
    public name: string,
    public specialty: ExpertSpecialty
  ) {}

  canHandle(accidentType: AccidentType): boolean {
    return this.specialty === accidentType;
  }

  assignAccident(accidentId: number): void {
    if (!this.assignedAccidents.includes(accidentId)) {
      this.assignedAccidents.push(accidentId);
    }
  }

  getAssignedAccidents(): number[] {
    return [...this.assignedAccidents];
  }

  getWorkload(): number {
    return this.assignedAccidents.length;
  }
}