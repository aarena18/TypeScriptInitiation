import { AnomalyStatus, AnomalyType, AnomalySeverity } from "../types/index.js";
import { AdvancedContract } from "./extended.js";

export class Anomaly {
  constructor(
    public id: number,
    public type: AnomalyType,
    public entityId: number,
    public description: string,
    public severity: AnomalySeverity,
    public status: AnomalyStatus = AnomalyStatus.DETECTED,
    public detectedDate: Date = new Date(),
    public resolvedDate?: Date,
    public assignedAuditorId?: number
  ) {}

  investigate(): void {
    this.status = AnomalyStatus.INVESTIGATING;
  }

  resolve(): void {
    this.status = AnomalyStatus.RESOLVED;
    this.resolvedDate = new Date();
  }

  isResolved(): boolean {
    return this.status === AnomalyStatus.RESOLVED;
  }

  getDaysToResolve(): number {
    if (!this.resolvedDate) return -1;
    return Math.floor(
      (this.resolvedDate.getTime() - this.detectedDate.getTime()) /
        (1000 * 3600 * 24)
    );
  }
}

export class Audit {
  private anomalies: Anomaly[] = [];
  private anomalyIdCounter: number = 1;

  constructor(
    public id: number,
    public startDate: Date,
    public endDate: Date,
    public report: string,
    public auditorName: string
  ) {}

  addAnomaly(
    type: AnomalyType,
    entityId: number,
    description: string,
    severity: AnomalySeverity
  ): Anomaly {
    const anomaly = new Anomaly(
      this.anomalyIdCounter++,
      type,
      entityId,
      description,
      severity
    );
    this.anomalies.push(anomaly);
    return anomaly;
  }

  getAnomalies(): Anomaly[] {
    return [...this.anomalies];
  }

  getAnomaliesByType(type: AnomalyType): Anomaly[] {
    return this.anomalies.filter((anomaly) => anomaly.type === type);
  }

  getAnomaliesBySeverity(severity: AnomalySeverity): Anomaly[] {
    return this.anomalies.filter((anomaly) => anomaly.severity === severity);
  }

  getUnresolvedAnomalies(): Anomaly[] {
    return this.anomalies.filter((anomaly) => !anomaly.isResolved());
  }

  resolveAnomaly(anomalyId: number): boolean {
    const anomaly = this.anomalies.find((a) => a.id === anomalyId);
    if (anomaly) {
      anomaly.resolve();
      return true;
    }
    return false;
  }

  getCompletionRate(): number {
    if (this.anomalies.length === 0) return 100;
    const resolved = this.anomalies.filter((a) => a.isResolved()).length;
    return Math.round((resolved / this.anomalies.length) * 100);
  }

  getAnomalyCountByStatus(): {
    detected: number;
    investigating: number;
    resolved: number;
  } {
    return {
      detected: this.anomalies.filter(
        (a) => a.status === AnomalyStatus.DETECTED
      ).length,
      investigating: this.anomalies.filter(
        (a) => a.status === AnomalyStatus.INVESTIGATING
      ).length,
      resolved: this.anomalies.filter(
        (a) => a.status === AnomalyStatus.RESOLVED
      ).length,
    };
  }
}

export class AuditService {
  static detectContractAnomalies(contracts: AdvancedContract[]): Anomaly[] {
    const anomalies: Anomaly[] = [];
    let anomalyId = 1;

    contracts.forEach((contract) => {
      if (contract.getBeneficiaries().length === 0) {
        anomalies.push(
          new Anomaly(
            anomalyId++,
            AnomalyType.CONTRACT,
            contract.id,
            "Contract has no beneficiaries",
            AnomalySeverity.HIGH
          )
        );
      }

      const totalShares = contract.getTotalBeneficiaryShares();
      if (totalShares < 100 && contract.getBeneficiaries().length > 0) {
        anomalies.push(
          new Anomaly(
            anomalyId++,
            AnomalyType.CONTRACT,
            contract.id,
            `Beneficiary shares incomplete: ${totalShares}% < 100%`,
            AnomalySeverity.MEDIUM
          )
        );
      }

      const unassignedAccidents = contract.getUnassignedAccidents();
      if (unassignedAccidents.length > 0) {
        anomalies.push(
          new Anomaly(
            anomalyId++,
            AnomalyType.ACCIDENT,
            contract.id,
            `${unassignedAccidents.length} unassigned accidents found`,
            AnomalySeverity.HIGH
          )
        );
      }

      const failedPayments = contract.getFailedPayments();
      if (failedPayments.length > 2) {
        anomalies.push(
          new Anomaly(
            anomalyId++,
            AnomalyType.PAYMENT,
            contract.id,
            `Multiple payment failures: ${failedPayments.length} failed payments`,
            AnomalySeverity.HIGH
          )
        );
      }
    });

    return anomalies;
  }
}
