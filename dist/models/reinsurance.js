import { ReinsuranceStatus } from '../types/index.js';
export class InsuranceCompany {
    constructor(id, name, country, rating, // Credit rating like AA+, AA-, A+, etc.
    contactEmail) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.rating = rating;
        this.contactEmail = contactEmail;
    }
    getRiskLevel() {
        // Convert credit rating to risk level
        if (this.rating.startsWith('AA')) {
            return 'Very Low Risk';
        }
        else if (this.rating.startsWith('A')) {
            return 'Low Risk';
        }
        else if (this.rating.startsWith('BBB')) {
            return 'Medium Risk';
        }
        else if (this.rating.startsWith('BB')) {
            return 'High Risk';
        }
        else {
            return 'Very High Risk';
        }
    }
}
export class ReinsuranceContract {
    constructor(id, reinsurer, startDate, endDate, riskPercentage, // 0-100
    maxCoverageAmount, status = ReinsuranceStatus.ACTIVE) {
        this.id = id;
        this.reinsurer = reinsurer;
        this.startDate = startDate;
        this.endDate = endDate;
        this.riskPercentage = riskPercentage;
        this.maxCoverageAmount = maxCoverageAmount;
        this.status = status;
        if (riskPercentage < 0 || riskPercentage > 100) {
            throw new Error("Risk percentage must be between 0 and 100");
        }
    }
    isActive(date = new Date()) {
        return (this.status === ReinsuranceStatus.ACTIVE &&
            date >= this.startDate &&
            date <= this.endDate);
    }
    getCoverageForAmount(amount) {
        if (!this.isActive())
            return 0;
        const coverage = (amount * this.riskPercentage) / 100;
        return Math.min(coverage, this.maxCoverageAmount);
    }
    suspend() {
        this.status = ReinsuranceStatus.SUSPENDED;
    }
    activate() {
        this.status = ReinsuranceStatus.ACTIVE;
    }
    expire() {
        this.status = ReinsuranceStatus.EXPIRED;
    }
}
export class ReinsuranceCoverage {
    constructor(contractId) {
        this.contractId = contractId;
        this.reinsuranceContracts = [];
    }
    addReinsurance(contract) {
        // Vérifier que le total ne dépasse pas 100%
        const currentTotal = this.getTotalCoveragePercentage();
        if (currentTotal + contract.riskPercentage > 100) {
            throw new Error(`Cannot add reinsurance: total coverage would exceed 100% (current: ${currentTotal}%, trying to add: ${contract.riskPercentage}%)`);
        }
        this.reinsuranceContracts.push(contract);
    }
    removeReinsurance(contractId) {
        const index = this.reinsuranceContracts.findIndex(c => c.id === contractId);
        if (index !== -1) {
            this.reinsuranceContracts.splice(index, 1);
            return true;
        }
        return false;
    }
    getActiveReinsuranceContracts() {
        return this.reinsuranceContracts.filter(c => c.isActive());
    }
    getAllReinsuranceContracts() {
        return [...this.reinsuranceContracts];
    }
    getTotalCoveragePercentage() {
        return this.getActiveReinsuranceContracts().reduce((total, contract) => {
            return total + contract.riskPercentage;
        }, 0);
    }
    getSelfRetainedPercentage() {
        return 100 - this.getTotalCoveragePercentage();
    }
    calculateReinsuranceShares(claimAmount) {
        const shares = new Map();
        const activeContracts = this.getActiveReinsuranceContracts();
        // Calculer les parts des réassureurs
        activeContracts.forEach(contract => {
            const coverage = contract.getCoverageForAmount(claimAmount);
            const actualPercentage = (coverage / claimAmount) * 100;
            shares.set(`reinsurer_${contract.id}`, {
                company: contract.reinsurer.name,
                amount: coverage,
                percentage: actualPercentage
            });
        });
        const totalReinsured = Array.from(shares.values()).reduce((sum, share) => sum + share.amount, 0);
        const selfRetained = claimAmount - totalReinsured;
        if (selfRetained > 0) {
            shares.set('self_retained', {
                company: 'Self Retained',
                amount: selfRetained,
                percentage: (selfRetained / claimAmount) * 100
            });
        }
        return shares;
    }
    validateCoverage() {
        const issues = [];
        const totalPercentage = this.getTotalCoveragePercentage();
        if (totalPercentage > 100) {
            issues.push(`Total coverage exceeds 100%: ${totalPercentage}%`);
        }
        const activeContracts = this.getActiveReinsuranceContracts();
        const expiredContracts = this.reinsuranceContracts.filter(c => !c.isActive());
        if (expiredContracts.length > 0) {
            issues.push(`${expiredContracts.length} expired or inactive contracts found`);
        }
        if (totalPercentage < 50 && activeContracts.length === 0) {
            issues.push("No reinsurance coverage - high risk exposure");
        }
        return {
            isValid: issues.length === 0,
            issues
        };
    }
}
