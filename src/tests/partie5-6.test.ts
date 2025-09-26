import {
  ContractStatus,
  ClientType,
  AccidentType,
  PaymentMethod,
  OptionType,
  BeneficiaryRelation,
  ReimbursementMethod,
  ReimbursementStatus,
  AnomalyType,
  AnomalySeverity,
  ReinsuranceStatus,
} from "../types/index.js";
import { ContactInfo, Contract } from "../models/contract.js";
import { Client } from "../models/client.js";
import { Accident, Expert } from "../models/accident.js";
import { Payment } from "../models/payment.js";
import { ContractOption } from "../models/extended.js";
import { Beneficiary } from "../models/beneficiary.js";
import { Reimbursement } from "../models/reimbursement.js";
import { Audit, AuditService } from "../models/audit.js";
import {
  InsuranceCompany,
  ReinsuranceContract,
  ReinsuranceCoverage,
} from "../models/reinsurance.js";
import { UltimateContract, UltimateClient } from "../models/extended.js";
import { assignExpertToAccident } from "../utils/assignment.js";

// ---- Tests Parties 5 et 6 ----

export function runPartie56Tests(): void {
  const aliceContact = new ContactInfo("alice@example.com", "0601020304");
  const bobContact = new ContactInfo("bob@example.com");
  const alice = new Client(101, aliceContact, ClientType.VIP);
  const bob = new Client(102, bobContact, ClientType.STANDARD);
  const aliceContract1 = new Contract(1001, 500, ContractStatus.ACTIVE);
  const bobContract = new Contract(1003, 300, ContractStatus.ACTIVE);

  alice.addContract(aliceContract1);
  bob.addContract(bobContract);

  const aliceFireAccident = new Accident(
    3001,
    aliceContract1.id,
    new Date("2025-09-25"),
    AccidentType.FIRE,
    "Kitchen fire at Alice's home - burnt pancackes"
  );

  const aliceTheftAccident = new Accident(
    3002,
    aliceContract1.id,
    new Date("2025-09-26"),
    AccidentType.THEFT,
    "Alice's laptop stolen from car"
  );

  const bobWaterAccident = new Accident(
    3003,
    bobContract.id,
    new Date("2025-09-26"),
    AccidentType.WATER_DAMAGE,
    "Bob's apartment - pipe burst in bathroom"
  );

  const fireExpert = new Expert(1, "Jean Dupont", AccidentType.FIRE);
  const theftExpert = new Expert(2, "Marie Martin", AccidentType.THEFT);
  const waterExpert = new Expert(3, "Pierre Durand", AccidentType.WATER_DAMAGE);
  const expertsList = [fireExpert, theftExpert, waterExpert];

  assignExpertToAccident(aliceFireAccident, expertsList);
  assignExpertToAccident(aliceTheftAccident, expertsList);
  assignExpertToAccident(bobWaterAccident, expertsList);

  const alicePayment1 = new Payment(
    4001,
    aliceContract1.id,
    500,
    PaymentMethod.CARD,
    new Date("2025-09-01")
  );

  const alicePayment2 = new Payment(
    4002,
    aliceContract1.id,
    500,
    PaymentMethod.BANK_TRANSFER,
    new Date("2025-10-01")
  );

  const bobPayment1 = new Payment(
    4003,
    bobContract.id,
    300,
    PaymentMethod.CASH,
    new Date("2025-09-15")
  );

  alicePayment1.complete();
  alicePayment2.fail();
  bobPayment1.complete();

  const tripAssistance = new ContractOption(
    1,
    OptionType.TRIP_ASSISTANCE,
    "Assistance Voyage",
    "Assistance 24h/24 en cas de panne ou d'accident en voyage",
    25
  );

  const juridicalProtection = new ContractOption(
    2,
    OptionType.JURIDICAL_PROTECTION,
    "Protection Juridique",
    "Assistance juridique et prise en charge des frais de procédure",
    15
  );

  const familyProtection = new ContractOption(
    3,
    OptionType.FAMILY_PROTECTION,
    "Protection Famille",
    "Extension de couverture pour tous les membres de la famille",
    35
  );

  const spouse = new Beneficiary(
    1,
    "Marie Alice Martin",
    BeneficiaryRelation.SPOUSE,
    "marie.martin@email.com",
    "0607080910"
  );

  const child1 = new Beneficiary(
    2,
    "Lucas Martin",
    BeneficiaryRelation.CHILD,
    "lucas.martin@email.com"
  );

  const child2 = new Beneficiary(3, "Emma Martin", BeneficiaryRelation.CHILD);

  const ultimateAlice = new UltimateClient(alice.id, alice.contact, alice.type);
  const ultimateBob = new UltimateClient(bob.id, bob.contact, bob.type);

  const aliceUltimateContract = new UltimateContract(
    aliceContract1.id,
    aliceContract1.basePrice,
    aliceContract1.status,
    aliceContract1.reduction,
    aliceContract1.bonus
  );

  const bobUltimateContract = new UltimateContract(
    bobContract.id,
    bobContract.basePrice,
    bobContract.status
  );

  aliceUltimateContract.addAccident(aliceFireAccident);
  aliceUltimateContract.addAccident(aliceTheftAccident);
  aliceUltimateContract.addPayment(alicePayment1);
  aliceUltimateContract.addPayment(alicePayment2);
  aliceUltimateContract.addOption(tripAssistance);
  aliceUltimateContract.addOption(juridicalProtection);
  aliceUltimateContract.addBeneficiary(spouse, 50);
  aliceUltimateContract.addBeneficiary(child1, 25);
  aliceUltimateContract.addBeneficiary(child2, 20);

  bobUltimateContract.addAccident(bobWaterAccident);
  bobUltimateContract.addPayment(bobPayment1);
  bobUltimateContract.addOption(familyProtection);

  ultimateAlice.addUltimateContract(aliceUltimateContract);
  ultimateBob.addUltimateContract(bobUltimateContract);

  const aliceFireReimbursement =
    aliceUltimateContract.createAccidentReimbursement(
      aliceFireAccident.id,
      8000
    );
  console.log(
    `Created reimbursement for accident ${aliceFireAccident.id}: €${aliceFireReimbursement.totalClaimAmount}`
  );

  const reimbursement1 = new Reimbursement(
    1,
    aliceFireAccident.id,
    3000,
    new Date("2025-10-05"),
    ReimbursementMethod.BANK_TRANSFER,
    ReimbursementStatus.PENDING,
    true,
    "First partial reimbursement for fire damage"
  );

  aliceFireReimbursement.addReimbursement(reimbursement1);
  reimbursement1.process();
  console.log(
    `Reimbursement 1 processed: €${reimbursement1.amount} via ${reimbursement1.method}`
  );

  const reimbursement2 = new Reimbursement(
    2,
    aliceFireAccident.id,
    5000,
    new Date("2025-10-15"),
    ReimbursementMethod.CARD,
    ReimbursementStatus.PENDING,
    true,
    "Final reimbursement for fire damage"
  );

  aliceFireReimbursement.addReimbursement(reimbursement2);
  reimbursement2.process();
  console.log(
    `Reimbursement 2 processed: €${reimbursement2.amount} via ${reimbursement2.method}`
  );

  console.log(`  - Total claim: €${aliceFireReimbursement.totalClaimAmount}`);
  console.log(
    `  - Total reimbursed: €${aliceFireReimbursement.getTotalReimbursed()}`
  );
  console.log(`  - Remaining: €${aliceFireReimbursement.getRemainingAmount()}`);
  console.log(
    `  - Fully reimbursed: ${aliceFireReimbursement.isFullyReimbursed()}`
  );
  console.log(
    `  - Number of payments: ${
      aliceFireReimbursement.getReimbursements().length
    }`
  );

  try {
    const excessReimbursement = new Reimbursement(
      3,
      aliceFireAccident.id,
      1000,
      new Date(),
      ReimbursementMethod.CASH
    );
    aliceFireReimbursement.addReimbursement(excessReimbursement);
  } catch (error) {
    console.log(`Error (expected): ${error.message}`);
  }

  const audit = new Audit(
    1,
    new Date("2025-10-01"),
    new Date("2025-10-31"),
    "Comprehensive audit of contracts and payments for Q4 2025",
    "Auditor Marie Leclerc"
  );

  const contracts = [aliceUltimateContract, bobUltimateContract];
  const detectedAnomalies = AuditService.detectContractAnomalies(contracts);

  console.log(`Auto-detection found ${detectedAnomalies.length} anomalies`);
  detectedAnomalies.forEach((anomaly) => {
    audit.addAnomaly(
      anomaly.type,
      anomaly.entityId,
      anomaly.description,
      anomaly.severity
    );
  });

  const manualAnomaly1 = audit.addAnomaly(
    AnomalyType.PAYMENT,
    alicePayment2.id,
    "Payment failure requires investigation - possible fraud",
    AnomalySeverity.HIGH
  );

  const manualAnomaly2 = audit.addAnomaly(
    AnomalyType.REIMBURSEMENT,
    reimbursement1.id,
    "Reimbursement amount seems high for claimed damage",
    AnomalySeverity.MEDIUM
  );

  console.log(
    `  - Period: ${audit.startDate
      .toISOString()
      .slice(0, 10)} to ${audit.endDate.toISOString().slice(0, 10)}`
  );
  console.log(`  - Auditor: ${audit.auditorName}`);
  console.log(`  - Total anomalies: ${audit.getAnomalies().length}`);

  const statusCount = audit.getAnomalyCountByStatus();
  console.log(`  - Detected: ${statusCount.detected}`);
  console.log(`  - Investigating: ${statusCount.investigating}`);
  console.log(`  - Resolved: ${statusCount.resolved}`);
  console.log(`  - Completion rate: ${audit.getCompletionRate()}%`);

  manualAnomaly1.investigate();
  manualAnomaly2.investigate();
  manualAnomaly2.resolve();

  const updatedStatusCount = audit.getAnomalyCountByStatus();
  console.log(`  - Detected: ${updatedStatusCount.detected}`);
  console.log(`  - Investigating: ${updatedStatusCount.investigating}`);
  console.log(`  - Resolved: ${updatedStatusCount.resolved}`);
  console.log(`  - Completion rate: ${audit.getCompletionRate()}%`);

  aliceUltimateContract.addAudit(audit);

  const swissRe = new InsuranceCompany(
    1,
    "Swiss Re Ltd",
    "Switzerland",
    "AA-",
    "contact@swissre.com"
  );

  const munichRe = new InsuranceCompany(
    2,
    "Munich Re Group",
    "Germany",
    "AA",
    "info@munichre.com"
  );

  const lloydsSyndicates = new InsuranceCompany(
    3,
    "Lloyd's of London Syndicates",
    "United Kingdom",
    "A+",
    "underwriting@lloyds.com"
  );

  [swissRe, munichRe, lloydsSyndicates].forEach((company) => {
    console.log(
      `${company.name} (${company.country}) - Rating: ${
        company.rating
      } - Risk Level: ${company.getRiskLevel()}`
    );
  });

  const swissReContract = new ReinsuranceContract(
    1,
    swissRe,
    new Date("2025-01-01"),
    new Date("2025-12-31"),
    40, // 40% du risque
    50000 // Maximum 50k€ par sinistre
  );

  const munichReContract = new ReinsuranceContract(
    2,
    munichRe,
    new Date("2025-01-01"),
    new Date("2025-12-31"),
    35, // 35% du risque
    40000 // Maximum 40k€ par sinistre
  );

  const lloydsContract = new ReinsuranceContract(
    3,
    lloydsSyndicates,
    new Date("2025-06-01"),
    new Date("2026-05-31"),
    20, // 20% du risque
    25000 // Maximum 25k€ par sinistre
  );

  [swissReContract, munichReContract, lloydsContract].forEach((contract) => {
    console.log(
      `${contract.reinsurer.name}: ${contract.riskPercentage}% coverage, max €${contract.maxCoverageAmount}`
    );
  });

  const aliceCoverage = new ReinsuranceCoverage(aliceUltimateContract.id);

  try {
    aliceCoverage.addReinsurance(swissReContract);
    aliceCoverage.addReinsurance(munichReContract);
    aliceCoverage.addReinsurance(lloydsContract);

    console.log(
      `  - Total reinsurance coverage: ${aliceCoverage.getTotalCoveragePercentage()}%`
    );
    console.log(
      `  - Self retained: ${aliceCoverage.getSelfRetainedPercentage()}%`
    );

    const validation = aliceCoverage.validateCoverage();
    console.log(`  - Coverage valid: ${validation.isValid}`);
    if (validation.issues.length > 0) {
      console.log(`  - Issues: ${validation.issues.join(", ")}`);
    }
  } catch (error) {
    console.log(`Error setting up reinsurance: ${error.message}`);
  }

  aliceUltimateContract.setReinsuranceCoverage(aliceCoverage);

  const testClaims = [5000, 15000, 30000, 60000];

  testClaims.forEach((claimAmount) => {
    console.log(`\\nClaim amount: €${claimAmount}`);
    const distribution =
      aliceUltimateContract.calculateReinsuranceDistribution(claimAmount);

    if (distribution) {
      let totalDistributed = 0;
      distribution.forEach((share, key) => {
        console.log(
          `  - ${share.company}: €${share.amount} (${share.percentage.toFixed(
            1
          )}%)`
        );
        totalDistributed += share.amount;
      });
      console.log(
        `  Total distributed: €${totalDistributed} (${(
          (totalDistributed / claimAmount) *
          100
        ).toFixed(1)}%)`
      );
    }
  });

  const bobDistribution =
    bobUltimateContract.calculateReinsuranceDistribution(10000);
  console.log(
    `\\nBob's distribution (no reinsurance): ${
      bobDistribution
        ? "Has coverage"
        : "No reinsurance coverage - full self retention"
    }`
  );

  console.log(
    `  - Total contracts: ${ultimateAlice.getUltimateContracts().length}`
  );
  console.log(
    `  - Total reimbursements: €${ultimateAlice.getTotalReimbursements()}`
  );
  console.log(
    `  - Active reinsurance contracts: ${
      ultimateAlice.getActiveReinsuranceContracts().length
    }`
  );
  console.log(
    `  - Unresolved anomalies: ${
      ultimateAlice.getAllUnresolvedAnomalies().length
    }`
  );

  const riskOverview = ultimateAlice.getReinsuranceCoverageOverview();
  console.log(
    `  - Average reinsurance coverage: ${riskOverview.totalCoverage.toFixed(
      1
    )}%`
  );
  console.log(
    `  - Average self retained: ${riskOverview.selfRetained.toFixed(1)}%`
  );

  riskOverview.riskDistribution.forEach((percentage, company) => {
    console.log(`  - ${company}: ${percentage}% of total risk`);
  });

  console.log(
    `  - Total contracts: ${ultimateBob.getUltimateContracts().length}`
  );
  console.log(
    `  - Total reimbursements: €${ultimateBob.getTotalReimbursements()}`
  );
  console.log(
    `  - Active reinsurance contracts: ${
      ultimateBob.getActiveReinsuranceContracts().length
    }`
  );
  console.log(
    `  - Unresolved anomalies: ${
      ultimateBob.getAllUnresolvedAnomalies().length
    }`
  );

  const allAnomalies = audit.getAnomalies();
  const bySeverity = {
    critical: allAnomalies.filter(
      (a) => a.severity === AnomalySeverity.CRITICAL
    ).length,
    high: allAnomalies.filter((a) => a.severity === AnomalySeverity.HIGH)
      .length,
    medium: allAnomalies.filter((a) => a.severity === AnomalySeverity.MEDIUM)
      .length,
    low: allAnomalies.filter((a) => a.severity === AnomalySeverity.LOW).length,
  };

  console.log(`  - Critical: ${bySeverity.critical}`);
  console.log(`  - High: ${bySeverity.high}`);
  console.log(`  - Medium: ${bySeverity.medium}`);
  console.log(`  - Low: ${bySeverity.low}`);
}
