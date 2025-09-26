import { AnomalyStatus, AnomalyType, AnomalySeverity } from '../types/index.js';
export class Anomaly {
    constructor(id, type, entityId, description, severity, status = AnomalyStatus.DETECTED, detectedDate = new Date(), resolvedDate, assignedAuditorId) {
        this.id = id;
        this.type = type;
        this.entityId = entityId;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.detectedDate = detectedDate;
        this.resolvedDate = resolvedDate;
        this.assignedAuditorId = assignedAuditorId;
    }
    investigate() {
        this.status = AnomalyStatus.INVESTIGATING;
    }
    resolve() {
        this.status = AnomalyStatus.RESOLVED;
        this.resolvedDate = new Date();
    }
    isResolved() {
        return this.status === AnomalyStatus.RESOLVED;
    }
    getDaysToResolve() {
        if (!this.resolvedDate)
            return -1;
        return Math.floor((this.resolvedDate.getTime() - this.detectedDate.getTime()) / (1000 * 3600 * 24));
    }
}
export class Audit {
    constructor(id, startDate, endDate, report, auditorName) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.report = report;
        this.auditorName = auditorName;
        this.anomalies = [];
        this.anomalyIdCounter = 1;
    }
    addAnomaly(type, entityId, description, severity) {
        const anomaly = new Anomaly(this.anomalyIdCounter++, type, entityId, description, severity);
        this.anomalies.push(anomaly);
        return anomaly;
    }
    getAnomalies() {
        return [...this.anomalies];
    }
    getAnomaliesByType(type) {
        return this.anomalies.filter(anomaly => anomaly.type === type);
    }
    getAnomaliesBySeverity(severity) {
        return this.anomalies.filter(anomaly => anomaly.severity === severity);
    }
    getUnresolvedAnomalies() {
        return this.anomalies.filter(anomaly => !anomaly.isResolved());
    }
    resolveAnomaly(anomalyId) {
        const anomaly = this.anomalies.find(a => a.id === anomalyId);
        if (anomaly) {
            anomaly.resolve();
            return true;
        }
        return false;
    }
    getCompletionRate() {
        if (this.anomalies.length === 0)
            return 100;
        const resolved = this.anomalies.filter(a => a.isResolved()).length;
        return Math.round((resolved / this.anomalies.length) * 100);
    }
    getAnomalyCountByStatus() {
        return {
            detected: this.anomalies.filter(a => a.status === AnomalyStatus.DETECTED).length,
            investigating: this.anomalies.filter(a => a.status === AnomalyStatus.INVESTIGATING).length,
            resolved: this.anomalies.filter(a => a.status === AnomalyStatus.RESOLVED).length,
        };
    }
}
export class AuditService {
    static detectContractAnomalies(contracts) {
        const anomalies = [];
        let anomalyId = 1;
        contracts.forEach(contract => {
            if (contract.getBeneficiaries().length === 0) {
                anomalies.push(new Anomaly(anomalyId++, AnomalyType.CONTRACT, contract.id, "Contract has no beneficiaries", AnomalySeverity.HIGH));
            }
            const totalShares = contract.getTotalBeneficiaryShares();
            if (totalShares < 100 && contract.getBeneficiaries().length > 0) {
                anomalies.push(new Anomaly(anomalyId++, AnomalyType.CONTRACT, contract.id, `Beneficiary shares incomplete: ${totalShares}% < 100%`, AnomalySeverity.MEDIUM));
            }
            const unassignedAccidents = contract.getUnassignedAccidents();
            if (unassignedAccidents.length > 0) {
                anomalies.push(new Anomaly(anomalyId++, AnomalyType.ACCIDENT, contract.id, `${unassignedAccidents.length} unassigned accidents found`, AnomalySeverity.HIGH));
            }
            const failedPayments = contract.getFailedPayments();
            if (failedPayments.length > 2) {
                anomalies.push(new Anomaly(anomalyId++, AnomalyType.PAYMENT, contract.id, `Multiple payment failures: ${failedPayments.length} failed payments`, AnomalySeverity.HIGH));
            }
        });
        return anomalies;
    }
}
