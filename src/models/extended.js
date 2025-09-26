import { PaymentStatus, LegalProcedureStatus } from '../types/index.js';
import { Contract } from './contract.js';
import { Client } from './client.js';
import { ContractBeneficiary } from './beneficiary.js';
export class UpdatedContract extends Contract {
    constructor() {
        super(...arguments);
        this.accidents = [];
        this.payments = [];
    }
    addAccident(accident) {
        this.accidents.push(accident);
    }
    getAccidents() {
        return [...this.accidents];
    }
    getUnassignedAccidents() {
        return this.accidents.filter((accident) => !accident.isAssigned());
    }
    addPayment(payment) {
        this.payments.push(payment);
    }
    getPayments() {
        return [...this.payments];
    }
    getCompletedPayments() {
        return this.payments.filter((payment) => payment.isCompleted());
    }
    getFailedPayments() {
        return this.payments.filter((payment) => payment.status === PaymentStatus.FAILED);
    }
    getPendingPayments() {
        return this.payments.filter((payment) => payment.status === PaymentStatus.PENDING);
    }
    getTotalPaidAmount() {
        return this.getCompletedPayments().reduce((total, payment) => total + payment.amount, 0);
    }
}
export class ContractOption {
    constructor(id, type, name, description, monthlyCost) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.description = description;
        this.monthlyCost = monthlyCost;
    }
    getAnnualCost() {
        return this.monthlyCost * 12;
    }
}
export class SystemEvent {
    constructor(id, date, action, entityType, entityId, description, clientId // To easily filter events by client
    ) {
        this.id = id;
        this.date = date;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.description = description;
        this.clientId = clientId;
    }
}
export class FullContract extends UpdatedContract {
    constructor() {
        super(...arguments);
        this.options = [];
    }
    addOption(option) {
        // Check if option already exists
        const existingOption = this.options.find((opt) => opt.id === option.id);
        if (!existingOption) {
            this.options.push(option);
        }
    }
    removeOption(optionId) {
        const index = this.options.findIndex((opt) => opt.id === optionId);
        if (index !== -1) {
            this.options.splice(index, 1);
            return true;
        }
        return false;
    }
    getOptions() {
        return [...this.options];
    }
    getTotalOptionsCost() {
        return this.options.reduce((total, option) => total + option.monthlyCost, 0);
    }
    calculateFinalPriceWithOptions() {
        return this.calculateFinalPrice() + this.getTotalOptionsCost();
    }
    getOptionsByType(type) {
        return this.options.filter((option) => option.type === type);
    }
}
export class EventLogger {
    constructor() {
        this.events = [];
        this.eventIdCounter = 1;
    }
    logEvent(action, entityType, entityId, description, clientId) {
        const event = new SystemEvent(this.eventIdCounter++, new Date(), action, entityType, entityId, description, clientId);
        this.events.push(event);
        return event;
    }
    getEventsByClient(clientId) {
        return this.events.filter((event) => event.clientId === clientId);
    }
    getEventsByAction(action) {
        return this.events.filter((event) => event.action === action);
    }
    getEventsByEntity(entityType, entityId) {
        return this.events.filter((event) => event.entityType === entityType && event.entityId === entityId);
    }
    getAllEvents() {
        return [...this.events].sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    getRecentEvents(count = 10) {
        return this.getAllEvents().slice(0, count);
    }
}
export class EnhancedClient extends Client {
    constructor() {
        super(...arguments);
        this.fullContracts = [];
    }
    addFullContract(contract) {
        this.fullContracts.push(contract);
        // Also add to base client for compatibility
        super.addContract(contract);
    }
    getFullContracts() {
        return [...this.fullContracts];
    }
    getActiveFullContracts() {
        return this.fullContracts.filter((contract) => contract.isActive());
    }
    getActiveContractsSummary() {
        return this.getActiveFullContracts().map((contract) => `Contract ${contract.id}: €${contract.calculateFinalPriceWithOptions()}/month (${contract.getOptions().length} options)`);
    }
    getOngoingAccidents() {
        const accidents = [];
        this.fullContracts.forEach((contract) => {
            accidents.push(...contract.getAccidents().filter((acc) => acc.isAssigned()));
        });
        return accidents;
    }
    getPaymentHistory() {
        const payments = [];
        this.fullContracts.forEach((contract) => {
            payments.push(...contract.getPayments());
        });
        return payments.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    getTotalMonthlyPremium() {
        return this.getActiveFullContracts().reduce((total, contract) => total + contract.calculateFinalPriceWithOptions(), 0);
    }
}
// Classes étendues pour la Partie 4
export class AdvancedContract extends FullContract {
    constructor() {
        super(...arguments);
        this.beneficiaries = [];
        this.legalProcedures = [];
    }
    addBeneficiary(beneficiary, sharePercentage) {
        const contractBeneficiary = new ContractBeneficiary(beneficiary, sharePercentage, this.id);
        // Vérifier que le total des parts ne dépasse pas 100%
        const totalShares = this.getTotalBeneficiaryShares() + sharePercentage;
        if (totalShares > 100) {
            throw new Error(`Cannot add beneficiary: total shares would exceed 100% (current: ${this.getTotalBeneficiaryShares()}%, trying to add: ${sharePercentage}%)`);
        }
        this.beneficiaries.push(contractBeneficiary);
        return contractBeneficiary;
    }
    removeBeneficiary(beneficiaryId) {
        const index = this.beneficiaries.findIndex(cb => cb.beneficiary.id === beneficiaryId);
        if (index !== -1) {
            this.beneficiaries.splice(index, 1);
            return true;
        }
        return false;
    }
    getBeneficiaries() {
        return [...this.beneficiaries];
    }
    getTotalBeneficiaryShares() {
        return this.beneficiaries.reduce((total, cb) => total + cb.sharePercentage, 0);
    }
    getBeneficiaryByRelation(relation) {
        return this.beneficiaries.filter(cb => cb.beneficiary.relation === relation);
    }
    addLegalProcedure(procedure) {
        this.legalProcedures.push(procedure);
    }
    getLegalProcedures() {
        return [...this.legalProcedures];
    }
    getOpenLegalProcedures() {
        return this.legalProcedures.filter(proc => proc.isOpen());
    }
    getLegalProceduresByStatus(status) {
        return this.legalProcedures.filter(proc => proc.status === status);
    }
}
export class ComprehensiveClient extends EnhancedClient {
    constructor() {
        super(...arguments);
        this.advancedContracts = [];
    }
    addAdvancedContract(contract) {
        this.advancedContracts.push(contract);
        // Also add to parent classes for compatibility
        super.addFullContract(contract);
    }
    getAdvancedContracts() {
        return [...this.advancedContracts];
    }
    getAllBeneficiaries() {
        const allBeneficiaries = [];
        this.advancedContracts.forEach(contract => {
            allBeneficiaries.push(...contract.getBeneficiaries());
        });
        return allBeneficiaries;
    }
    getBeneficiariesByRelation(relation) {
        return this.getAllBeneficiaries().filter(cb => cb.beneficiary.relation === relation);
    }
    getAllLegalProcedures() {
        const allProcedures = [];
        this.advancedContracts.forEach(contract => {
            allProcedures.push(...contract.getLegalProcedures());
        });
        return allProcedures;
    }
    getOpenLegalProcedures() {
        return this.getAllLegalProcedures().filter(proc => proc.isOpen());
    }
    getLegalProceduresCount() {
        const procedures = this.getAllLegalProcedures();
        return {
            open: procedures.filter(p => p.status === LegalProcedureStatus.OPEN || p.status === LegalProcedureStatus.IN_PROGRESS).length,
            settled: procedures.filter(p => p.status === LegalProcedureStatus.SETTLED).length,
            cancelled: procedures.filter(p => p.status === LegalProcedureStatus.CANCELLED).length,
        };
    }
}
