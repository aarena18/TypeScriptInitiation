import { LegalProcedureStatus } from '../types/index.js';
export class LegalProcedure {
    constructor(id, openingDate, status, accidentIds, // Peut être lié à plusieurs accidents
    description, assignedLawyerId) {
        this.id = id;
        this.openingDate = openingDate;
        this.status = status;
        this.accidentIds = accidentIds;
        this.description = description;
        this.assignedLawyerId = assignedLawyerId;
    }
    isAssigned() {
        return this.assignedLawyerId !== undefined;
    }
    addAccident(accidentId) {
        if (!this.accidentIds.includes(accidentId)) {
            this.accidentIds.push(accidentId);
        }
    }
    removeAccident(accidentId) {
        const index = this.accidentIds.indexOf(accidentId);
        if (index !== -1) {
            this.accidentIds.splice(index, 1);
            return true;
        }
        return false;
    }
    close(status) {
        this.status = status;
    }
    isOpen() {
        return this.status === LegalProcedureStatus.OPEN || this.status === LegalProcedureStatus.IN_PROGRESS;
    }
}
