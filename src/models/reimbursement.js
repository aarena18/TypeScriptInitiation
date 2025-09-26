import { ReimbursementStatus } from '../types/index.js';
export class Reimbursement {
    constructor(id, accidentId, amount, date, method, status = ReimbursementStatus.PENDING, isPartial = false, description) {
        this.id = id;
        this.accidentId = accidentId;
        this.amount = amount;
        this.date = date;
        this.method = method;
        this.status = status;
        this.isPartial = isPartial;
        this.description = description;
    }
    process() {
        this.status = ReimbursementStatus.PROCESSED;
    }
    fail() {
        this.status = ReimbursementStatus.FAILED;
    }
    isProcessed() {
        return this.status === ReimbursementStatus.PROCESSED;
    }
}
export class AccidentReimbursement {
    constructor(accidentId, totalClaimAmount) {
        this.accidentId = accidentId;
        this.totalClaimAmount = totalClaimAmount;
        this.reimbursements = [];
    }
    addReimbursement(reimbursement) {
        if (reimbursement.accidentId !== this.accidentId) {
            throw new Error("Reimbursement must be for the same accident");
        }
        const currentTotal = this.getTotalReimbursed();
        if (currentTotal + reimbursement.amount > this.totalClaimAmount) {
            throw new Error(`Reimbursement amount exceeds claim total. Available: €${this.totalClaimAmount - currentTotal}`);
        }
        this.reimbursements.push(reimbursement);
    }
    getReimbursements() {
        return [...this.reimbursements];
    }
    getTotalReimbursed() {
        return this.reimbursements.reduce((total, reimbursement) => {
            return reimbursement.isProcessed() ? total + reimbursement.amount : total;
        }, 0);
    }
    getRemainingAmount() {
        return this.totalClaimAmount - this.getTotalReimbursed();
    }
    isFullyReimbursed() {
        return this.getRemainingAmount() === 0;
    }
    getProcessedReimbursements() {
        return this.reimbursements.filter(r => r.isProcessed());
    }
    getPendingReimbursements() {
        return this.reimbursements.filter(r => r.status === ReimbursementStatus.PENDING);
    }
}
