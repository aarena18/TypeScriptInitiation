import { 
  ContractStatus, 
  ClientType, 
  AccidentType, 
  PaymentMethod,
  OptionType,
  BeneficiaryRelation,
  LegalProcedureStatus,
  LawyerSpecialty
} from '../types/index.js';
import { ContactInfo, Contract } from '../models/contract.js';
import { Client } from '../models/client.js';
import { Accident, Expert } from '../models/accident.js';
import { Payment } from '../models/payment.js';
import { ContractOption } from '../models/extended.js';
import { Beneficiary, ContractBeneficiary } from '../models/beneficiary.js';
import { Lawyer } from '../models/lawyer.js';
import { LegalProcedure } from '../models/legal-procedure.js';
import { AdvancedContract, ComprehensiveClient } from '../models/extended.js';
import { assignExpertToAccident, assignLawyerToProcedure } from '../utils/assignment.js';

// ---- Tests Partie 4 ----

export function runPartie4Tests(): void {
  console.log('\n=== TESTS PARTIE 4: Bénéficiaires et Procédures ===');

  // Réutiliser les données des parties précédentes
  const aliceContact = new ContactInfo("alice@example.com", "0601020304");
  const bobContact = new ContactInfo("bob@example.com");
  const alice = new Client(101, aliceContact, ClientType.VIP);
  const bob = new Client(102, bobContact, ClientType.STANDARD);
  const aliceContract1 = new Contract(1001, 500, ContractStatus.ACTIVE);
  const bobContract = new Contract(1003, 300, ContractStatus.ACTIVE);
  
  alice.addContract(aliceContract1);
  bob.addContract(bobContract);

  // Créer les accidents et paiements nécessaires
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

  // Créer les experts et assigner les accidents
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

  // Créer les options de contrat
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

  // Créer des bénéficiaires
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

  const child2 = new Beneficiary(
    3,
    "Emma Martin",
    BeneficiaryRelation.CHILD
  );

  const partnerCompany = new Beneficiary(
    4,
    "TechCorp Solutions",
    BeneficiaryRelation.PARTNER_COMPANY,
    "contact@techcorp.com",
    "0102030405"
  );

  console.log("\\n=== Beneficiaries Created ===");
  console.log(`Spouse: ${spouse.name} (${spouse.relation}) - ${spouse.getContactInfo()}`);
  console.log(`Child 1: ${child1.name} (${child1.relation}) - ${child1.getContactInfo()}`);
  console.log(`Child 2: ${child2.name} (${child2.relation}) - ${child2.getContactInfo()}`);
  console.log(`Partner: ${partnerCompany.name} (${partnerCompany.relation}) - ${partnerCompany.getContactInfo()}`);

  // Créer un client complet et un contrat avancé
  const comprehensiveAlice = new ComprehensiveClient(
    alice.id,
    alice.contact,
    alice.type
  );

  // Créer un contrat avancé basé sur le contrat d'Alice existant
  const aliceAdvancedContract = new AdvancedContract(
    aliceContract1.id,
    aliceContract1.basePrice,
    aliceContract1.status,
    aliceContract1.reduction,
    aliceContract1.bonus
  );

  // Ajouter les accidents, paiements et options existants
  aliceAdvancedContract.addAccident(aliceFireAccident);
  aliceAdvancedContract.addAccident(aliceTheftAccident);
  aliceAdvancedContract.addPayment(alicePayment1);
  aliceAdvancedContract.addPayment(alicePayment2);
  aliceAdvancedContract.addOption(tripAssistance);
  aliceAdvancedContract.addOption(juridicalProtection);

  comprehensiveAlice.addAdvancedContract(aliceAdvancedContract);

  // Ajouter des bénéficiaires au contrat
  try {
    const spouseBeneficiary = aliceAdvancedContract.addBeneficiary(spouse, 50); // 50% pour le conjoint
    const child1Beneficiary = aliceAdvancedContract.addBeneficiary(child1, 25); // 25% pour l'enfant 1
    const child2Beneficiary = aliceAdvancedContract.addBeneficiary(child2, 20); // 20% pour l'enfant 2
    
    console.log("\\n=== Contract Beneficiaries Added ===");
    console.log(`${spouse.name}: ${spouseBeneficiary.sharePercentage}%`);
    console.log(`${child1.name}: ${child1Beneficiary.sharePercentage}%`);
    console.log(`${child2.name}: ${child2Beneficiary.sharePercentage}%`);
    console.log(`Total beneficiary shares: ${aliceAdvancedContract.getTotalBeneficiaryShares()}%`);
    
    // Essayer d'ajouter un autre bénéficiaire qui dépasserait 100%
    try {
      aliceAdvancedContract.addBeneficiary(partnerCompany, 10);
    } catch (error) {
      console.log(`Cannot add partner company: ${error.message}`);
    }

  } catch (error) {
    console.error(`Error adding beneficiaries: ${error.message}`);
  }

  // Créer des avocats
  const insuranceLawyer = new Lawyer(
    1,
    "Maître Jean Dupuis",
    LawyerSpecialty.INSURANCE_LAW,
    "INS2025001"
  );

  const civilLawyer = new Lawyer(
    2,
    "Maître Sophie Martin",
    LawyerSpecialty.CIVIL_LAW,
    "CIV2025002"
  );

  const commercialLawyer = new Lawyer(
    3,
    "Maître Pierre Durand",
    LawyerSpecialty.COMMERCIAL_LAW,
    "COM2025003"
  );

  const lawyersList = [insuranceLawyer, civilLawyer, commercialLawyer];

  console.log("\\n=== Lawyers Created ===");
  lawyersList.forEach(lawyer => {
    console.log(`${lawyer.name} - Specialty: ${lawyer.specialty} - Bar #: ${lawyer.barNumber}`);
  });

  // Créer des procédures judiciaires liées aux accidents
  const fireDisputeProcedure = new LegalProcedure(
    1,
    new Date("2025-09-27"),
    LegalProcedureStatus.OPEN,
    [aliceFireAccident.id],
    "Dispute over fire damage coverage amount - Client contests the expert assessment"
  );

  const theftProcedure = new LegalProcedure(
    2,
    new Date("2025-09-28"),
    LegalProcedureStatus.OPEN,
    [aliceTheftAccident.id],
    "Third party claims involving the theft - Potential negligence case"
  );

  // Procédure complexe liée à plusieurs accidents
  const multiAccidentProcedure = new LegalProcedure(
    3,
    new Date("2025-09-29"),
    LegalProcedureStatus.OPEN,
    [aliceFireAccident.id, aliceTheftAccident.id],
    "Class action involving multiple incidents - Potential fraud investigation"
  );

  console.log("\\n=== Legal Procedures Created ===");
  console.log(`Procedure ${fireDisputeProcedure.id}: ${fireDisputeProcedure.description}`);
  console.log(`  - Status: ${fireDisputeProcedure.status}`);
  console.log(`  - Related accidents: ${fireDisputeProcedure.accidentIds.join(", ")}`);

  console.log(`Procedure ${theftProcedure.id}: ${theftProcedure.description}`);
  console.log(`  - Status: ${theftProcedure.status}`);
  console.log(`  - Related accidents: ${theftProcedure.accidentIds.join(", ")}`);

  console.log(`Procedure ${multiAccidentProcedure.id}: ${multiAccidentProcedure.description}`);
  console.log(`  - Status: ${multiAccidentProcedure.status}`);
  console.log(`  - Related accidents: ${multiAccidentProcedure.accidentIds.join(", ")}`);

  // Assigner des avocats aux procédures
  const assignedLawyer1 = assignLawyerToProcedure(
    fireDisputeProcedure,
    lawyersList,
    LawyerSpecialty.INSURANCE_LAW
  );
  console.log(`\\nFire dispute assigned to: ${assignedLawyer1?.name || "No lawyer available"}`);
  if (assignedLawyer1) {
    console.log(`  - Lawyer workload: ${assignedLawyer1.getWorkload()} cases`);
    console.log(`  - Procedure status: ${fireDisputeProcedure.status}`);
  }

  const assignedLawyer2 = assignLawyerToProcedure(
    theftProcedure,
    lawyersList,
    LawyerSpecialty.CIVIL_LAW
  );
  console.log(`\\nTheft procedure assigned to: ${assignedLawyer2?.name || "No lawyer available"}`);
  if (assignedLawyer2) {
    console.log(`  - Lawyer workload: ${assignedLawyer2.getWorkload()} cases`);
    console.log(`  - Procedure status: ${theftProcedure.status}`);
  }

  const assignedLawyer3 = assignLawyerToProcedure(
    multiAccidentProcedure,
    lawyersList
  );
  console.log(`\\nMulti-accident procedure assigned to: ${assignedLawyer3?.name || "No lawyer available"}`);
  if (assignedLawyer3) {
    console.log(`  - Lawyer workload: ${assignedLawyer3.getWorkload()} cases`);
    console.log(`  - Procedure status: ${multiAccidentProcedure.status}`);
  }

  // Ajouter les procédures au contrat d'Alice
  aliceAdvancedContract.addLegalProcedure(fireDisputeProcedure);
  aliceAdvancedContract.addLegalProcedure(theftProcedure);
  aliceAdvancedContract.addLegalProcedure(multiAccidentProcedure);

  // Créer Bob avec un contrat avancé et des procédures supplémentaires
  const comprehensiveBob = new ComprehensiveClient(
    bob.id,
    bob.contact,
    bob.type
  );

  const bobAdvancedContract = new AdvancedContract(
    bobContract.id,
    bobContract.basePrice,
    bobContract.status
  );

  bobAdvancedContract.addAccident(bobWaterAccident);
  bobAdvancedContract.addPayment(bobPayment1);
  bobAdvancedContract.addOption(familyProtection);

  comprehensiveBob.addAdvancedContract(bobAdvancedContract);

  // Créer des procédures pour Bob qui seront aussi gérées par des avocats existants
  const bobWaterDisputeProcedure = new LegalProcedure(
    4,
    new Date("2025-09-30"),
    LegalProcedureStatus.OPEN,
    [bobWaterAccident.id],
    "Water damage dispute - Tenant vs Landlord responsibility"
  );

  const bobInsuranceProcedure = new LegalProcedure(
    5,
    new Date("2025-10-01"),
    LegalProcedureStatus.OPEN,
    [bobWaterAccident.id],
    "Insurance coverage dispute - Policy interpretation"
  );

  console.log("\\n=== Bob's Legal Procedures Created ===");
  console.log(`Procedure ${bobWaterDisputeProcedure.id}: ${bobWaterDisputeProcedure.description}`);
  console.log(`Procedure ${bobInsuranceProcedure.id}: ${bobInsuranceProcedure.description}`);

  // Assigner les procédures de Bob - certaines au même avocat qu'Alice
  const bobAssignedLawyer1 = assignLawyerToProcedure(
    bobWaterDisputeProcedure,
    lawyersList,
    LawyerSpecialty.CIVIL_LAW // Même spécialité que Sophie Martin
  );
  console.log(`\\nBob's water dispute assigned to: ${bobAssignedLawyer1?.name || "No lawyer available"}`);
  if (bobAssignedLawyer1) {
    console.log(`  - Lawyer workload after assignment: ${bobAssignedLawyer1.getWorkload()} cases`);
  }

  const bobAssignedLawyer2 = assignLawyerToProcedure(
    bobInsuranceProcedure,
    lawyersList,
    LawyerSpecialty.INSURANCE_LAW // Même spécialité que Jean Dupuis
  );
  console.log(`\\nBob's insurance dispute assigned to: ${bobAssignedLawyer2?.name || "No lawyer available"}`);
  if (bobAssignedLawyer2) {
    console.log(`  - Lawyer workload after assignment: ${bobAssignedLawyer2.getWorkload()} cases`);
  }

  // Ajouter les procédures au contrat de Bob
  bobAdvancedContract.addLegalProcedure(bobWaterDisputeProcedure);
  bobAdvancedContract.addLegalProcedure(bobInsuranceProcedure);

  // Afficher les statistiques finales
  console.log("\\n=== Alice's Comprehensive Profile ===");
  console.log(`Client: ${comprehensiveAlice.contact.email} (${comprehensiveAlice.type})`);
  console.log(`Active contracts: ${comprehensiveAlice.getActiveFullContracts().length}`);
  console.log(`Total beneficiaries: ${comprehensiveAlice.getAllBeneficiaries().length}`);

  const beneficiaryStats = {
    spouse: comprehensiveAlice.getBeneficiariesByRelation(BeneficiaryRelation.SPOUSE).length,
    children: comprehensiveAlice.getBeneficiariesByRelation(BeneficiaryRelation.CHILD).length,
    companies: comprehensiveAlice.getBeneficiariesByRelation(BeneficiaryRelation.PARTNER_COMPANY).length
  };
  console.log(`  - Spouses: ${beneficiaryStats.spouse}`);
  console.log(`  - Children: ${beneficiaryStats.children}`);
  console.log(`  - Partner companies: ${beneficiaryStats.companies}`);

  const legalStats = comprehensiveAlice.getLegalProceduresCount();
  console.log(`Legal procedures: ${comprehensiveAlice.getAllLegalProcedures().length} total`);
  console.log(`  - Open/In Progress: ${legalStats.open}`);
  console.log(`  - Settled: ${legalStats.settled}`);
  console.log(`  - Cancelled: ${legalStats.cancelled}`);

  // Résoudre une procédure
  fireDisputeProcedure.close(LegalProcedureStatus.SETTLED);
  if (assignedLawyer1) {
    assignedLawyer1.removeProcedure(fireDisputeProcedure.id);
  }

  console.log(`\\nFire dispute procedure settled. Lawyer ${assignedLawyer1?.name} workload: ${assignedLawyer1?.getWorkload()} cases`);

  const updatedLegalStats = comprehensiveAlice.getLegalProceduresCount();
  console.log(`Updated legal procedures:`);
  console.log(`  - Open/In Progress: ${updatedLegalStats.open}`);
  console.log(`  - Settled: ${updatedLegalStats.settled}`);
  console.log(`  - Cancelled: ${updatedLegalStats.cancelled}`);

  // Afficher tous les avocats et leur charge de travail
  console.log("\\n=== Lawyers Workload Summary ===");
  lawyersList.forEach(lawyer => {
    console.log(`${lawyer.name} (${lawyer.specialty}): ${lawyer.getWorkload()} active cases`);
    if (lawyer.getWorkload() > 0) {
      console.log(`  - Cases: ${lawyer.getAssignedProcedures().join(", ")}`);
    }
  });
}