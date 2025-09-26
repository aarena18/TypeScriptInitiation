import { ReinsuranceStatus } from "../types/index.js";

export class InsuranceCompany {
  constructor(
    public id: number,
    public name: string,
    public country: string,
    public rating: string,
    public contactEmail: string
  ) {}

  getRiskLevel(): string {
    // Convert credit rating to risk level
    if (this.rating.startsWith("AA")) {
      return "Very Low Risk";
    } else if (this.rating.startsWith("A")) {
      return "Low Risk";
    } else if (this.rating.startsWith("BBB")) {
      return "Medium Risk";
    } else if (this.rating.startsWith("BB")) {
      return "High Risk";
    } else {
      return "Very High Risk";
    }
  }
}

export class ReinsuranceContract {
  constructor(
    public id: number,
    public reinsurer: InsuranceCompany,
    public startDate: Date,
    public endDate: Date,
    public riskPercentage: number, // 0-100
    public maxCoverageAmount: number,
    public status: ReinsuranceStatus = ReinsuranceStatus.ACTIVE
  ) {
    if (riskPercentage < 0 || riskPercentage > 100) {
      throw new Error("Risk percentage must be between 0 and 100");
    }
  }

  isActive(date: Date = new Date()): boolean {
    return (
      this.status === ReinsuranceStatus.ACTIVE &&
      date >= this.startDate &&
      date <= this.endDate
    );
  }

  getCoverageForAmount(amount: number): number {
    if (!this.isActive()) return 0;
    const coverage = (amount * this.riskPercentage) / 100;
    return Math.min(coverage, this.maxCoverageAmount);
  }

  suspend(): void {
    this.status = ReinsuranceStatus.SUSPENDED;
  }

  activate(): void {
    this.status = ReinsuranceStatus.ACTIVE;
  }

  expire(): void {
    this.status = ReinsuranceStatus.EXPIRED;
  }
}

export class ReinsuranceCoverage {
  private reinsuranceContracts: ReinsuranceContract[] = [];

  constructor(public contractId: number) {}

  addReinsurance(contract: ReinsuranceContract): void {
    const currentTotal = this.getTotalCoveragePercentage();
    if (currentTotal + contract.riskPercentage > 100) {
      throw new Error(
        `Cannot add reinsurance: total coverage would exceed 100% (current: ${currentTotal}%, trying to add: ${contract.riskPercentage}%)`
      );
    }
    this.reinsuranceContracts.push(contract);
  }

  removeReinsurance(contractId: number): boolean {
    const index = this.reinsuranceContracts.findIndex(
      (c) => c.id === contractId
    );
    if (index !== -1) {
      this.reinsuranceContracts.splice(index, 1);
      return true;
    }
    return false;
  }

  getActiveReinsuranceContracts(): ReinsuranceContract[] {
    return this.reinsuranceContracts.filter((c) => c.isActive());
  }

  getAllReinsuranceContracts(): ReinsuranceContract[] {
    return [...this.reinsuranceContracts];
  }

  getTotalCoveragePercentage(): number {
    return this.getActiveReinsuranceContracts().reduce((total, contract) => {
      return total + contract.riskPercentage;
    }, 0);
  }

  getSelfRetainedPercentage(): number {
    return 100 - this.getTotalCoveragePercentage();
  }

  calculateReinsuranceShares(
    claimAmount: number
  ): Map<string, { company: string; amount: number; percentage: number }> {
    const shares = new Map<
      string,
      { company: string; amount: number; percentage: number }
    >();
    const activeContracts = this.getActiveReinsuranceContracts();

    activeContracts.forEach((contract) => {
      const coverage = contract.getCoverageForAmount(claimAmount);
      const actualPercentage = (coverage / claimAmount) * 100;

      shares.set(`reinsurer_${contract.id}`, {
        company: contract.reinsurer.name,
        amount: coverage,
        percentage: actualPercentage,
      });
    });

    const totalReinsured = Array.from(shares.values()).reduce(
      (sum, share) => sum + share.amount,
      0
    );
    const selfRetained = claimAmount - totalReinsured;

    if (selfRetained > 0) {
      shares.set("self_retained", {
        company: "Self Retained",
        amount: selfRetained,
        percentage: (selfRetained / claimAmount) * 100,
      });
    }

    return shares;
  }

  validateCoverage(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    const totalPercentage = this.getTotalCoveragePercentage();

    if (totalPercentage > 100) {
      issues.push(`Total coverage exceeds 100%: ${totalPercentage}%`);
    }

    const activeContracts = this.getActiveReinsuranceContracts();
    const expiredContracts = this.reinsuranceContracts.filter(
      (c) => !c.isActive()
    );

    if (expiredContracts.length > 0) {
      issues.push(
        `${expiredContracts.length} expired or inactive contracts found`
      );
    }

    if (totalPercentage < 50 && activeContracts.length === 0) {
      issues.push("No reinsurance coverage - high risk exposure");
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}
