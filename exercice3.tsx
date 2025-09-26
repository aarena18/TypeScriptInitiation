// to see the //console.logs, type:
// npx tsc exercice3.tsx --target es2020
// node exercice3.js

////
// ---- Partie 1 ----

enum ContractStatus {
  ACTIVE = "actif",
  TERMINATED = "résilié",
}

enum ClientType {
  STANDARD = "standard",
  VIP = "vip",
}

class ContactInfo {
  constructor(public email: string, public phone?: string) {}
}

class Contract {
  constructor(
    public id: number,
    public basePrice: number,
    public status: ContractStatus,
    public reduction: number = 0,
    public bonus: number = 0
  ) {}

  calculateFinalPrice(): number {
    return this.basePrice - this.reduction + this.bonus;
  }

  isActive(): boolean {
    return this.status === ContractStatus.ACTIVE;
  }
}

class Client {
  private contracts: Contract[] = [];

  constructor(
    public id: number,
    public contact: ContactInfo,
    public type: ClientType = ClientType.STANDARD
  ) {}

  isVip(): boolean {
    return this.type === ClientType.VIP;
  }

  addContract(contract: Contract): void {
    if (this.isVip()) {
      contract.reduction += contract.basePrice * 0.1;
      contract.bonus += 50;
    }
    this.contracts.push(contract);
  }

  getActiveContracts(): Contract[] {
    return this.contracts.filter((contract) => contract.isActive());
  }

  getAllContracts(): Contract[] {
    return [...this.contracts];
  }
}

// ---- Test Partie 1

const aliceContact = new ContactInfo("alice@example.com", "0601020304");
const bobContact = new ContactInfo("bob@example.com");

const alice = new Client(101, aliceContact, ClientType.VIP);
const bob = new Client(102, bobContact, ClientType.STANDARD);

const aliceContract1 = new Contract(1001, 500, ContractStatus.ACTIVE);
const aliceContract2 = new Contract(1002, 800, ContractStatus.TERMINATED);
const bobContract = new Contract(1003, 300, ContractStatus.ACTIVE);

alice.addContract(aliceContract1);
alice.addContract(aliceContract2);
bob.addContract(bobContract);

console.log("Alice is VIP:", alice.isVip());
console.log("Bob is VIP:", bob.isVip());
console.log("Alice active contracts:", alice.getActiveContracts().length);

alice.getActiveContracts().forEach((contract) => {
  console.log(
    `Contract ${contract.id}: BasePrice=€${contract.basePrice}, Reduction=€${
      contract.reduction
    }, Bonus=€${contract.bonus}, Final=€${contract.calculateFinalPrice()}`
  );
});
console.log("Alice active contracts details:", alice.getActiveContracts());

////
// ---- Partie 2 ----

enum AccidentType {
  FIRE = "fire",
  THEFT = "theft",
  WATER_DAMAGE = "water_damage",
  ACCIDENT = "accident",
  VANDALISM = "vandalism",
}

type ExpertSpecialty = AccidentType;

class Accident {
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

class Expert {
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

enum PaymentMethod {
  CARD = "card",
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
}

enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

class Payment {
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor(
    public id: number,
    public contractId: number,
    public amount: number,
    public method: PaymentMethod,
    public date: Date,
    public status: PaymentStatus = PaymentStatus.PENDING
  ) {}

  canRetry(): boolean {
    return (
      this.status === PaymentStatus.FAILED && this.retryCount < this.maxRetries
    );
  }

  retry(): boolean {
    if (this.canRetry()) {
      this.retryCount++;
      this.status = PaymentStatus.PENDING;
      return true;
    }
    return false;
  }

  complete(): void {
    this.status = PaymentStatus.COMPLETED;
  }

  fail(): void {
    this.status = PaymentStatus.FAILED;
  }

  getRetryCount(): number {
    return this.retryCount;
  }

  isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }
}

class UpdatedContract extends Contract {
  private accidents: Accident[] = [];
  private payments: Payment[] = [];

  addAccident(accident: Accident): void {
    this.accidents.push(accident);
  }

  getAccidents(): Accident[] {
    return [...this.accidents];
  }

  getUnassignedAccidents(): Accident[] {
    return this.accidents.filter((accident) => !accident.isAssigned());
  }

  addPayment(payment: Payment): void {
    this.payments.push(payment);
  }

  getPayments(): Payment[] {
    return [...this.payments];
  }

  getCompletedPayments(): Payment[] {
    return this.payments.filter((payment) => payment.isCompleted());
  }

  getFailedPayments(): Payment[] {
    return this.payments.filter(
      (payment) => payment.status === PaymentStatus.FAILED
    );
  }

  getPendingPayments(): Payment[] {
    return this.payments.filter(
      (payment) => payment.status === PaymentStatus.PENDING
    );
  }

  getTotalPaidAmount(): number {
    return this.getCompletedPayments().reduce(
      (total, payment) => total + payment.amount,
      0
    );
  }
}

// ---- Tests Partie 2 ----

const fireExpert = new Expert(1, "Jean Dupont", AccidentType.FIRE);
const theftExpert = new Expert(2, "Marie Martin", AccidentType.THEFT);
const waterExpert = new Expert(3, "Pierre Durand", AccidentType.WATER_DAMAGE);
const expertsList = [fireExpert, theftExpert, waterExpert];

const aliceUpdatedContract = new UpdatedContract(
  aliceContract1.id,
  aliceContract1.basePrice,
  aliceContract1.status,
  aliceContract1.reduction,
  aliceContract1.bonus
);
//console.log(aliceUpdatedContract.basePrice);

const bobUpdatedContract = new UpdatedContract(
  bobContract.id,
  bobContract.basePrice,
  bobContract.status
);
//console.log(bobUpdatedContract.basePrice);

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

function assignExpertToAccident(
  accident: Accident,
  experts: Expert[]
): Expert | null {
  const availableExperts = experts
    .filter((expert) => expert.canHandle(accident.type))
    .sort((a, b) => a.getWorkload() - b.getWorkload());

  if (availableExperts.length > 0) {
    const assignedExpert = availableExperts[0];
    accident.assignedExpertId = assignedExpert.id;
    assignedExpert.assignAccident(accident.id);
    return assignedExpert;
  }
  return null;
}

const assignedFireExpert = assignExpertToAccident(
  aliceFireAccident,
  expertsList
);
console.log(
  "Fire accident assigned to expert:",
  assignedFireExpert?.name,
  "(ID:",
  aliceFireAccident.assignedExpertId,
  ")"
);
console.log(
  "Fire expert workload:",
  fireExpert.name,
  fireExpert.getWorkload(),
  "accidents"
);

const assignedTheftExpert = assignExpertToAccident(
  aliceTheftAccident,
  expertsList
);
console.log(
  "Theft accident assigned to expert:",
  assignedTheftExpert?.name,
  "(ID:",
  aliceTheftAccident.assignedExpertId,
  ")"
);
console.log(
  "Theft expert workload:",
  theftExpert.name,
  theftExpert.getWorkload(),
  "accidents"
);

const assignedWaterExpert = assignExpertToAccident(
  bobWaterAccident,
  expertsList
);
console.log(
  "Water accident assigned to expert:",
  assignedWaterExpert?.name,
  "(ID:",
  bobWaterAccident.assignedExpertId,
  ")"
);
console.log(
  "Water expert workload:",
  waterExpert.name,
  waterExpert.getWorkload(),
  "accidents"
);

aliceUpdatedContract.addAccident(aliceFireAccident);
console.log(
  "Added fire accident to Alice's contract. Total accidents:",
  aliceUpdatedContract.getAccidents().length
);

aliceUpdatedContract.addAccident(aliceTheftAccident);
console.log(
  "Added theft accident to Alice's contract. Total accidents:",
  aliceUpdatedContract.getAccidents().length
);

bobUpdatedContract.addAccident(bobWaterAccident);
console.log(
  "Added water accident to Bob's contract. Total accidents:",
  bobUpdatedContract.getAccidents().length
);

const alicePayment1 = new Payment(
  4001,
  aliceContract1.id,
  aliceUpdatedContract.calculateFinalPrice(),
  PaymentMethod.CARD,
  new Date("2025-09-01")
);
console.log(
  "Alice payment 1 created:",
  alicePayment1.amount,
  "EUR via",
  alicePayment1.method
);

const alicePayment2 = new Payment(
  4002,
  aliceContract1.id,
  aliceUpdatedContract.calculateFinalPrice(),
  PaymentMethod.BANK_TRANSFER,
  new Date("2025-10-01")
);
console.log(
  "Alice payment 2 created:",
  alicePayment2.amount,
  "EUR via",
  alicePayment2.method
);
console.log("Alice payment 2 can retry:", alicePayment2.canRetry());
if (alicePayment2.canRetry()) {
  alicePayment2.retry();
  console.log(
    "Alice payment 2 after retry - ID:",
    alicePayment2.id,
    "Status:",
    alicePayment2.status
  );
  console.log("Alice payment 2 retry count:", alicePayment2.getRetryCount());
}

const bobPayment1 = new Payment(
  4003,
  bobContract.id,
  bobUpdatedContract.calculateFinalPrice(),
  PaymentMethod.CASH,
  new Date("2025-09-15")
);
console.log(
  "Bob payment 1 created:",
  bobPayment1.amount,
  "EUR via",
  bobPayment1.method
);

alicePayment1.complete();
console.log("Alice payment 1 completed. Status:", alicePayment1.status);

alicePayment2.fail();
console.log("Alice payment 2 failed. Status:", alicePayment2.status);

bobPayment1.complete();
console.log("Bob payment 1 completed. Status:", bobPayment1.status);

aliceUpdatedContract.addPayment(alicePayment1);
aliceUpdatedContract.addPayment(alicePayment2);
console.log(
  "Alice contract total paid amount:",
  aliceUpdatedContract.getTotalPaidAmount(),
  "EUR"
);
console.log(
  "Alice contract failed payments:",
  aliceUpdatedContract.getFailedPayments().length
);

bobUpdatedContract.addPayment(bobPayment1);
console.log(
  "Bob contract total paid amount:",
  bobUpdatedContract.getTotalPaidAmount(),
  "EUR"
);

////
// ---- Partie 3 ----

enum OptionType {
  TRIP_ASSISTANCE = "trip_assistance",
  JURIDICAL_PROTECTION = "juridical_protection",
  FAMILY_PROTECTION = "family_protection",
}

class ContractOption {
  constructor(
    public id: number,
    public type: OptionType,
    public name: string,
    public description: string,
    public monthlyCost: number
  ) {}

  getAnnualCost(): number {
    return this.monthlyCost * 12;
  }
}

enum EventAction {
  CONTRACT_CREATED = "contract_created",
  CONTRACT_TERMINATED = "contract_terminated",
  ACCIDENT_REPORTED = "accident_reported",
  PAYMENT_SUCCESSFUL = "payment_successful",
  PAYMENT_FAILED = "payment_failed",
  EXPERT_ASSIGNED = "expert_assigned",
  OPTION_ADDED = "option_added",
}

enum EntityType {
  CLIENT = "client",
  CONTRACT = "contract",
  ACCIDENT = "accident",
  PAYMENT = "payment",
  EXPERT = "expert",
  OPTION = "option",
}

class SystemEvent {
  constructor(
    public id: number,
    public date: Date,
    public action: EventAction,
    public entityType: EntityType,
    public entityId: number,
    public description: string,
    public clientId?: number // To easily filter events by client
  ) {}
}

class FullContract extends UpdatedContract {
  private options: ContractOption[] = [];

  addOption(option: ContractOption): void {
    // Check if option already exists
    const existingOption = this.options.find((opt) => opt.id === option.id);
    if (!existingOption) {
      this.options.push(option);
    }
  }

  removeOption(optionId: number): boolean {
    const index = this.options.findIndex((opt) => opt.id === optionId);
    if (index !== -1) {
      this.options.splice(index, 1);
      return true;
    }
    return false;
  }

  getOptions(): ContractOption[] {
    return [...this.options];
  }

  getTotalOptionsCost(): number {
    return this.options.reduce(
      (total, option) => total + option.monthlyCost,
      0
    );
  }

  calculateFinalPriceWithOptions(): number {
    return this.calculateFinalPrice() + this.getTotalOptionsCost();
  }

  getOptionsByType(type: OptionType): ContractOption[] {
    return this.options.filter((option) => option.type === type);
  }
}

class EventLogger {
  private events: SystemEvent[] = [];
  private eventIdCounter: number = 1;

  logEvent(
    action: EventAction,
    entityType: EntityType,
    entityId: number,
    description: string,
    clientId?: number
  ): SystemEvent {
    const event = new SystemEvent(
      this.eventIdCounter++,
      new Date(),
      action,
      entityType,
      entityId,
      description,
      clientId
    );
    this.events.push(event);
    return event;
  }

  getEventsByClient(clientId: number): SystemEvent[] {
    return this.events.filter((event) => event.clientId === clientId);
  }

  getEventsByAction(action: EventAction): SystemEvent[] {
    return this.events.filter((event) => event.action === action);
  }

  getEventsByEntity(entityType: EntityType, entityId: number): SystemEvent[] {
    return this.events.filter(
      (event) => event.entityType === entityType && event.entityId === entityId
    );
  }

  getAllEvents(): SystemEvent[] {
    return [...this.events].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getRecentEvents(count: number = 10): SystemEvent[] {
    return this.getAllEvents().slice(0, count);
  }
}

class EnhancedClient extends Client {
  private fullContracts: FullContract[] = [];

  addFullContract(contract: FullContract): void {
    this.fullContracts.push(contract);
    // Also add to base client for compatibility
    super.addContract(contract);
  }

  getFullContracts(): FullContract[] {
    return [...this.fullContracts];
  }

  getActiveFullContracts(): FullContract[] {
    return this.fullContracts.filter((contract) => contract.isActive());
  }

  getActiveContractsSummary(): string[] {
    return this.getActiveFullContracts().map(
      (contract) =>
        `Contract ${
          contract.id
        }: €${contract.calculateFinalPriceWithOptions()}/month (${
          contract.getOptions().length
        } options)`
    );
  }

  getOngoingAccidents(): Accident[] {
    const accidents: Accident[] = [];
    this.fullContracts.forEach((contract) => {
      accidents.push(
        ...contract.getAccidents().filter((acc) => acc.isAssigned())
      );
    });
    return accidents;
  }

  getPaymentHistory(): Payment[] {
    const payments: Payment[] = [];
    this.fullContracts.forEach((contract) => {
      payments.push(...contract.getPayments());
    });
    return payments.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getTotalMonthlyPremium(): number {
    return this.getActiveFullContracts().reduce(
      (total, contract) => total + contract.calculateFinalPriceWithOptions(),
      0
    );
  }
}

// ---- Tests Partie 3 ----

const eventLogger = new EventLogger();

// Create available options
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

console.log("\n=== Available Contract Options ===");
console.log(`- ${tripAssistance.name}: €${tripAssistance.monthlyCost}/month`);
console.log(
  `- ${juridicalProtection.name}: €${juridicalProtection.monthlyCost}/month`
);
console.log(
  `- ${familyProtection.name}: €${familyProtection.monthlyCost}/month`
);

// Convert to enhanced clients and full contracts
const enhancedAlice = new EnhancedClient(alice.id, alice.contact, alice.type);

const enhancedBob = new EnhancedClient(bob.id, bob.contact, bob.type);

// Create full contracts from existing data
const aliceFullContract = new FullContract(
  aliceContract1.id,
  aliceContract1.basePrice,
  aliceContract1.status,
  aliceContract1.reduction,
  aliceContract1.bonus
);

const bobFullContract = new FullContract(
  bobContract.id,
  bobContract.basePrice,
  bobContract.status
);

// Add existing accidents and payments
aliceFullContract.addAccident(aliceFireAccident);
aliceFullContract.addAccident(aliceTheftAccident);
aliceFullContract.addPayment(alicePayment1);
aliceFullContract.addPayment(alicePayment2);

bobFullContract.addAccident(bobWaterAccident);
bobFullContract.addPayment(bobPayment1);

// Add contracts to enhanced clients
enhancedAlice.addFullContract(aliceFullContract);
enhancedBob.addFullContract(bobFullContract);

console.log("\n=== Final Contract Pricing ===");
console.log(
  "Alice base premium:",
  aliceFullContract.calculateFinalPrice(),
  "EUR"
);
console.log(
  "Alice total with options:",
  aliceFullContract.calculateFinalPriceWithOptions(),
  "EUR"
);
console.log("Bob base premium:", bobFullContract.calculateFinalPrice(), "EUR");
console.log(
  "Bob total with options:",
  bobFullContract.calculateFinalPriceWithOptions(),
  "EUR"
);

console.log("\n=== Quick Listing System ===");
console.log(
  "Alice active contracts:",
  enhancedAlice.getActiveContractsSummary()
);
console.log(
  "Alice ongoing accidents:",
  enhancedAlice.getOngoingAccidents().length
);
console.log(
  "Alice payment history:",
  enhancedAlice.getPaymentHistory().length,
  "payments"
);
console.log(
  "Alice total monthly premium:",
  enhancedAlice.getTotalMonthlyPremium(),
  "EUR"
);

console.log("Bob active contracts:", enhancedBob.getActiveContractsSummary());
console.log("Bob ongoing accidents:", enhancedBob.getOngoingAccidents().length);
console.log(
  "Bob payment history:",
  enhancedBob.getPaymentHistory().length,
  "payments"
);
console.log(
  "Bob total monthly premium:",
  enhancedBob.getTotalMonthlyPremium(),
  "EUR"
);

// Log contract creation events
eventLogger.logEvent(
  EventAction.CONTRACT_CREATED,
  EntityType.CONTRACT,
  aliceFullContract.id,
  `Contract created for VIP client Alice`,
  enhancedAlice.id
);

eventLogger.logEvent(
  EventAction.CONTRACT_CREATED,
  EntityType.CONTRACT,
  bobFullContract.id,
  `Contract created for standard client Bob`,
  enhancedBob.id
);

// Alice adds options to her contract (VIP gets multiple options)
aliceFullContract.addOption(tripAssistance);
console.log("Added", tripAssistance.name, "to Alice's contract");

aliceFullContract.addOption(juridicalProtection);
console.log("Added", juridicalProtection.name, "to Alice's contract");
console.log(
  "Alice's total options cost:",
  aliceFullContract.getTotalOptionsCost(),
  "EUR/month"
);
eventLogger.logEvent(
  EventAction.OPTION_ADDED,
  EntityType.OPTION,
  tripAssistance.id,
  `Alice added ${tripAssistance.name} to contract ${aliceFullContract.id}`,
  enhancedAlice.id
);
eventLogger.logEvent(
  EventAction.OPTION_ADDED,
  EntityType.OPTION,
  juridicalProtection.id,
  `Alice added ${juridicalProtection.name} to contract ${aliceFullContract.id}`,
  enhancedAlice.id
);

// Bob adds one option
bobFullContract.addOption(familyProtection);
console.log("Added", familyProtection.name, "to Bob's contract");
console.log(
  "Bob's total options cost:",
  bobFullContract.getTotalOptionsCost(),
  "EUR/month"
);
eventLogger.logEvent(
  EventAction.OPTION_ADDED,
  EntityType.OPTION,
  familyProtection.id,
  `Bob added ${familyProtection.name} to contract ${bobFullContract.id}`,
  enhancedBob.id
);

// Log existing accidents
eventLogger.logEvent(
  EventAction.ACCIDENT_REPORTED,
  EntityType.ACCIDENT,
  aliceFireAccident.id,
  `Fire accident reported by Alice: ${aliceFireAccident.description}`,
  enhancedAlice.id
);

eventLogger.logEvent(
  EventAction.EXPERT_ASSIGNED,
  EntityType.EXPERT,
  assignedFireExpert!.id,
  `Expert ${assignedFireExpert!.name} assigned to Alice's fire accident`,
  enhancedAlice.id
);

// Log payments
eventLogger.logEvent(
  EventAction.PAYMENT_SUCCESSFUL,
  EntityType.PAYMENT,
  alicePayment1.id,
  `Alice's payment of €${alicePayment1.amount} completed successfully`,
  enhancedAlice.id
);

eventLogger.logEvent(
  EventAction.PAYMENT_FAILED,
  EntityType.PAYMENT,
  alicePayment2.id,
  `Alice's payment of €${alicePayment2.amount} failed`,
  enhancedAlice.id
);

console.log("\n=== Event Logging System ===");
console.log("Recent system events:");
eventLogger.getRecentEvents(5).forEach((event) => {
  console.log(
    `[${event.date.toISOString().slice(0, 10)}] ${event.action}: ${
      event.description
    }`
  );
});

console.log("\nAlice's complete event history:");
eventLogger.getEventsByClient(enhancedAlice.id).forEach((event) => {
  console.log(`  - ${event.action}: ${event.description}`);
});

////
// ---- Partie 4 ----

enum BeneficiaryRelation {
  SPOUSE = "spouse",
  CHILD = "child",
  PARENT = "parent",
  SIBLING = "sibling",
  PARTNER_COMPANY = "partner_company",
  OTHER = "other",
}

class Beneficiary {
  constructor(
    public id: number,
    public name: string,
    public relation: BeneficiaryRelation,
    public email?: string,
    public phone?: string
  ) {}

  getContactInfo(): string {
    const contact = [];
    if (this.email) contact.push(`Email: ${this.email}`);
    if (this.phone) contact.push(`Phone: ${this.phone}`);
    return contact.length > 0 ? contact.join(", ") : "No contact info";
  }
}

class ContractBeneficiary {
  constructor(
    public beneficiary: Beneficiary,
    public sharePercentage: number, // Part du contrat en pourcentage
    public contractId: number
  ) {
    if (sharePercentage <= 0 || sharePercentage > 100) {
      throw new Error("Share percentage must be between 0 and 100");
    }
  }

  getShareAmount(contractValue: number): number {
    return (contractValue * this.sharePercentage) / 100;
  }
}

enum LegalProcedureStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  SETTLED = "settled",
  CANCELLED = "cancelled",
}

enum LawyerSpecialty {
  INSURANCE_LAW = "insurance_law",
  CIVIL_LAW = "civil_law",
  COMMERCIAL_LAW = "commercial_law",
  CRIMINAL_LAW = "criminal_law",
}

class Lawyer {
  private assignedProcedures: number[] = [];

  constructor(
    public id: number,
    public name: string,
    public specialty: LawyerSpecialty,
    public barNumber: string // Numéro au barreau
  ) {}

  canHandle(procedureType: LawyerSpecialty): boolean {
    return this.specialty === procedureType;
  }

  assignProcedure(procedureId: number): void {
    if (!this.assignedProcedures.includes(procedureId)) {
      this.assignedProcedures.push(procedureId);
    }
  }

  getAssignedProcedures(): number[] {
    return [...this.assignedProcedures];
  }

  getWorkload(): number {
    return this.assignedProcedures.length;
  }

  removeProcedure(procedureId: number): boolean {
    const index = this.assignedProcedures.indexOf(procedureId);
    if (index !== -1) {
      this.assignedProcedures.splice(index, 1);
      return true;
    }
    return false;
  }
}

class LegalProcedure {
  constructor(
    public id: number,
    public openingDate: Date,
    public status: LegalProcedureStatus,
    public accidentIds: number[], // Peut être lié à plusieurs accidents
    public description: string,
    public assignedLawyerId?: number
  ) {}

  isAssigned(): boolean {
    return this.assignedLawyerId !== undefined;
  }

  addAccident(accidentId: number): void {
    if (!this.accidentIds.includes(accidentId)) {
      this.accidentIds.push(accidentId);
    }
  }

  removeAccident(accidentId: number): boolean {
    const index = this.accidentIds.indexOf(accidentId);
    if (index !== -1) {
      this.accidentIds.splice(index, 1);
      return true;
    }
    return false;
  }

  close(
    status: LegalProcedureStatus.SETTLED | LegalProcedureStatus.CANCELLED
  ): void {
    this.status = status;
  }

  isOpen(): boolean {
    return (
      this.status === LegalProcedureStatus.OPEN ||
      this.status === LegalProcedureStatus.IN_PROGRESS
    );
  }
}

class AdvancedContract extends FullContract {
  private beneficiaries: ContractBeneficiary[] = [];
  private legalProcedures: LegalProcedure[] = [];

  addBeneficiary(
    beneficiary: Beneficiary,
    sharePercentage: number
  ): ContractBeneficiary {
    const contractBeneficiary = new ContractBeneficiary(
      beneficiary,
      sharePercentage,
      this.id
    );

    // Vérifier que le total des parts ne dépasse pas 100%
    const totalShares = this.getTotalBeneficiaryShares() + sharePercentage;
    if (totalShares > 100) {
      throw new Error(
        `Cannot add beneficiary: total shares would exceed 100% (current: ${this.getTotalBeneficiaryShares()}%, trying to add: ${sharePercentage}%)`
      );
    }

    this.beneficiaries.push(contractBeneficiary);
    return contractBeneficiary;
  }

  removeBeneficiary(beneficiaryId: number): boolean {
    const index = this.beneficiaries.findIndex(
      (cb) => cb.beneficiary.id === beneficiaryId
    );
    if (index !== -1) {
      this.beneficiaries.splice(index, 1);
      return true;
    }
    return false;
  }

  getBeneficiaries(): ContractBeneficiary[] {
    return [...this.beneficiaries];
  }

  getTotalBeneficiaryShares(): number {
    return this.beneficiaries.reduce(
      (total, cb) => total + cb.sharePercentage,
      0
    );
  }

  getBeneficiaryByRelation(
    relation: BeneficiaryRelation
  ): ContractBeneficiary[] {
    return this.beneficiaries.filter(
      (cb) => cb.beneficiary.relation === relation
    );
  }

  addLegalProcedure(procedure: LegalProcedure): void {
    this.legalProcedures.push(procedure);
  }

  getLegalProcedures(): LegalProcedure[] {
    return [...this.legalProcedures];
  }

  getOpenLegalProcedures(): LegalProcedure[] {
    return this.legalProcedures.filter((proc) => proc.isOpen());
  }

  getLegalProceduresByStatus(status: LegalProcedureStatus): LegalProcedure[] {
    return this.legalProcedures.filter((proc) => proc.status === status);
  }
}

class ComprehensiveClient extends EnhancedClient {
  private advancedContracts: AdvancedContract[] = [];

  addAdvancedContract(contract: AdvancedContract): void {
    this.advancedContracts.push(contract);
    // Also add to parent classes for compatibility
    super.addFullContract(contract);
  }

  getAdvancedContracts(): AdvancedContract[] {
    return [...this.advancedContracts];
  }

  getAllBeneficiaries(): ContractBeneficiary[] {
    const allBeneficiaries: ContractBeneficiary[] = [];
    this.advancedContracts.forEach((contract) => {
      allBeneficiaries.push(...contract.getBeneficiaries());
    });
    return allBeneficiaries;
  }

  getBeneficiariesByRelation(
    relation: BeneficiaryRelation
  ): ContractBeneficiary[] {
    return this.getAllBeneficiaries().filter(
      (cb) => cb.beneficiary.relation === relation
    );
  }

  getAllLegalProcedures(): LegalProcedure[] {
    const allProcedures: LegalProcedure[] = [];
    this.advancedContracts.forEach((contract) => {
      allProcedures.push(...contract.getLegalProcedures());
    });
    return allProcedures;
  }

  getOpenLegalProcedures(): LegalProcedure[] {
    return this.getAllLegalProcedures().filter((proc) => proc.isOpen());
  }

  getLegalProceduresCount(): {
    open: number;
    settled: number;
    cancelled: number;
  } {
    const procedures = this.getAllLegalProcedures();
    return {
      open: procedures.filter(
        (p) =>
          p.status === LegalProcedureStatus.OPEN ||
          p.status === LegalProcedureStatus.IN_PROGRESS
      ).length,
      settled: procedures.filter(
        (p) => p.status === LegalProcedureStatus.SETTLED
      ).length,
      cancelled: procedures.filter(
        (p) => p.status === LegalProcedureStatus.CANCELLED
      ).length,
    };
  }
}

function assignLawyerToProcedure(
  procedure: LegalProcedure,
  lawyers: Lawyer[],
  requiredSpecialty?: LawyerSpecialty
): Lawyer | null {
  let availableLawyers = lawyers;

  if (requiredSpecialty) {
    availableLawyers = lawyers.filter((lawyer) =>
      lawyer.canHandle(requiredSpecialty)
    );
  }

  availableLawyers.sort((a, b) => a.getWorkload() - b.getWorkload());

  if (availableLawyers.length > 0) {
    const assignedLawyer = availableLawyers[0];
    procedure.assignedLawyerId = assignedLawyer.id;
    assignedLawyer.assignProcedure(procedure.id);
    procedure.status = LegalProcedureStatus.IN_PROGRESS;
    return assignedLawyer;
  }

  return null;
}

// ---- Tests Partie 4 ----

console.log("\n=== TESTS PARTIE 4: Bénéficiaires et Procédures ===");

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

const partnerCompany = new Beneficiary(
  4,
  "TechCorp Solutions",
  BeneficiaryRelation.PARTNER_COMPANY,
  "contact@techcorp.com",
  "0102030405"
);

console.log("\n=== Beneficiaries Created ===");
console.log(
  `Spouse: ${spouse.name} (${spouse.relation}) - ${spouse.getContactInfo()}`
);
console.log(
  `Child 1: ${child1.name} (${child1.relation}) - ${child1.getContactInfo()}`
);
console.log(
  `Child 2: ${child2.name} (${child2.relation}) - ${child2.getContactInfo()}`
);
console.log(
  `Partner: ${partnerCompany.name} (${
    partnerCompany.relation
  }) - ${partnerCompany.getContactInfo()}`
);

const comprehensiveAlice = new ComprehensiveClient(
  alice.id,
  alice.contact,
  alice.type
);

const aliceAdvancedContract = new AdvancedContract(
  aliceContract1.id,
  aliceContract1.basePrice,
  aliceContract1.status,
  aliceContract1.reduction,
  aliceContract1.bonus
);

aliceAdvancedContract.addAccident(aliceFireAccident);
aliceAdvancedContract.addAccident(aliceTheftAccident);
aliceAdvancedContract.addPayment(alicePayment1);
aliceAdvancedContract.addPayment(alicePayment2);
aliceAdvancedContract.addOption(tripAssistance);
aliceAdvancedContract.addOption(juridicalProtection);

comprehensiveAlice.addAdvancedContract(aliceAdvancedContract);

try {
  const spouseBeneficiary = aliceAdvancedContract.addBeneficiary(spouse, 50); // 50% pour le conjoint
  const child1Beneficiary = aliceAdvancedContract.addBeneficiary(child1, 25); // 25% pour l'enfant 1
  const child2Beneficiary = aliceAdvancedContract.addBeneficiary(child2, 20); // 20% pour l'enfant 2

  console.log(`${spouse.name}: ${spouseBeneficiary.sharePercentage}%`);
  console.log(`${child1.name}: ${child1Beneficiary.sharePercentage}%`);
  console.log(`${child2.name}: ${child2Beneficiary.sharePercentage}%`);
  console.log(
    `Total beneficiary shares: ${aliceAdvancedContract.getTotalBeneficiaryShares()}%`
  );

  try {
    aliceAdvancedContract.addBeneficiary(partnerCompany, 10);
  } catch (error) {
    console.log(`Cannot add partner company: ${error.message}`);
  }
} catch (error) {
  console.error(`Error adding beneficiaries: ${error.message}`);
}

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

console.log("\n=== Lawyers Created ===");
lawyersList.forEach((lawyer) => {
  console.log(
    `${lawyer.name} - Specialty: ${lawyer.specialty} - Bar #: ${lawyer.barNumber}`
  );
});

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

console.log("\n=== Legal Procedures Created ===");
console.log(
  `Procedure ${fireDisputeProcedure.id}: ${fireDisputeProcedure.description}`
);
console.log(`  - Status: ${fireDisputeProcedure.status}`);
console.log(
  `  - Related accidents: ${fireDisputeProcedure.accidentIds.join(", ")}`
);

console.log(`Procedure ${theftProcedure.id}: ${theftProcedure.description}`);
console.log(`  - Status: ${theftProcedure.status}`);
console.log(`  - Related accidents: ${theftProcedure.accidentIds.join(", ")}`);

console.log(
  `Procedure ${multiAccidentProcedure.id}: ${multiAccidentProcedure.description}`
);
console.log(`  - Status: ${multiAccidentProcedure.status}`);
console.log(
  `  - Related accidents: ${multiAccidentProcedure.accidentIds.join(", ")}`
);

const assignedLawyer1 = assignLawyerToProcedure(
  fireDisputeProcedure,
  lawyersList,
  LawyerSpecialty.INSURANCE_LAW
);
console.log(
  `\nFire dispute assigned to: ${
    assignedLawyer1?.name || "No lawyer available"
  }`
);
if (assignedLawyer1) {
  console.log(`  - Lawyer workload: ${assignedLawyer1.getWorkload()} cases`);
  console.log(`  - Procedure status: ${fireDisputeProcedure.status}`);
}

const assignedLawyer2 = assignLawyerToProcedure(
  theftProcedure,
  lawyersList,
  LawyerSpecialty.CIVIL_LAW
);
console.log(
  `\nTheft procedure assigned to: ${
    assignedLawyer2?.name || "No lawyer available"
  }`
);
if (assignedLawyer2) {
  console.log(`  - Lawyer workload: ${assignedLawyer2.getWorkload()} cases`);
  console.log(`  - Procedure status: ${theftProcedure.status}`);
}

const assignedLawyer3 = assignLawyerToProcedure(
  multiAccidentProcedure,
  lawyersList
);
console.log(
  `\nMulti-accident procedure assigned to: ${
    assignedLawyer3?.name || "No lawyer available"
  }`
);
if (assignedLawyer3) {
  console.log(`  - Lawyer workload: ${assignedLawyer3.getWorkload()} cases`);
  console.log(`  - Procedure status: ${multiAccidentProcedure.status}`);
}

aliceAdvancedContract.addLegalProcedure(fireDisputeProcedure);
aliceAdvancedContract.addLegalProcedure(theftProcedure);
aliceAdvancedContract.addLegalProcedure(multiAccidentProcedure);

const comprehensiveBob = new ComprehensiveClient(bob.id, bob.contact, bob.type);

const bobAdvancedContract = new AdvancedContract(
  bobContract.id,
  bobContract.basePrice,
  bobContract.status
);

bobAdvancedContract.addAccident(bobWaterAccident);
bobAdvancedContract.addPayment(bobPayment1);
bobAdvancedContract.addOption(familyProtection);

comprehensiveBob.addAdvancedContract(bobAdvancedContract);

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

console.log("\n=== Bob's Legal Procedures Created ===");
console.log(
  `Procedure ${bobWaterDisputeProcedure.id}: ${bobWaterDisputeProcedure.description}`
);
console.log(
  `Procedure ${bobInsuranceProcedure.id}: ${bobInsuranceProcedure.description}`
);

const bobAssignedLawyer1 = assignLawyerToProcedure(
  bobWaterDisputeProcedure,
  lawyersList,
  LawyerSpecialty.CIVIL_LAW // Même spécialité que Sophie Martin
);
console.log(
  `\nBob's water dispute assigned to: ${
    bobAssignedLawyer1?.name || "No lawyer available"
  }`
);
if (bobAssignedLawyer1) {
  console.log(
    `  - Lawyer workload after assignment: ${bobAssignedLawyer1.getWorkload()} cases`
  );
}

const bobAssignedLawyer2 = assignLawyerToProcedure(
  bobInsuranceProcedure,
  lawyersList,
  LawyerSpecialty.INSURANCE_LAW // Même spécialité que Jean Dupuis
);
console.log(
  `\nBob's insurance dispute assigned to: ${
    bobAssignedLawyer2?.name || "No lawyer available"
  }`
);
if (bobAssignedLawyer2) {
  console.log(
    `  - Lawyer workload after assignment: ${bobAssignedLawyer2.getWorkload()} cases`
  );
}

bobAdvancedContract.addLegalProcedure(bobWaterDisputeProcedure);
bobAdvancedContract.addLegalProcedure(bobInsuranceProcedure);

console.log("\n=== Alice's Comprehensive Profile ===");
console.log(
  `Client: ${comprehensiveAlice.contact.email} (${comprehensiveAlice.type})`
);
console.log(
  `Active contracts: ${comprehensiveAlice.getActiveFullContracts().length}`
);
console.log(
  `Total beneficiaries: ${comprehensiveAlice.getAllBeneficiaries().length}`
);

const beneficiaryStats = {
  spouse: comprehensiveAlice.getBeneficiariesByRelation(
    BeneficiaryRelation.SPOUSE
  ).length,
  children: comprehensiveAlice.getBeneficiariesByRelation(
    BeneficiaryRelation.CHILD
  ).length,
  companies: comprehensiveAlice.getBeneficiariesByRelation(
    BeneficiaryRelation.PARTNER_COMPANY
  ).length,
};
console.log(`  - Spouses: ${beneficiaryStats.spouse}`);
console.log(`  - Children: ${beneficiaryStats.children}`);
console.log(`  - Partner companies: ${beneficiaryStats.companies}`);

const legalStats = comprehensiveAlice.getLegalProceduresCount();
console.log(
  `Legal procedures: ${comprehensiveAlice.getAllLegalProcedures().length} total`
);
console.log(`  - Open/In Progress: ${legalStats.open}`);
console.log(`  - Settled: ${legalStats.settled}`);
console.log(`  - Cancelled: ${legalStats.cancelled}`);

fireDisputeProcedure.close(LegalProcedureStatus.SETTLED);
if (assignedLawyer1) {
  assignedLawyer1.removeProcedure(fireDisputeProcedure.id);
}

console.log(
  `\nFire dispute procedure settled. Lawyer ${
    assignedLawyer1?.name
  } workload: ${assignedLawyer1?.getWorkload()} cases`
);

const updatedLegalStats = comprehensiveAlice.getLegalProceduresCount();
console.log(`Updated legal procedures:`);
console.log(`  - Open/In Progress: ${updatedLegalStats.open}`);
console.log(`  - Settled: ${updatedLegalStats.settled}`);
console.log(`  - Cancelled: ${updatedLegalStats.cancelled}`);

// Afficher tous les avocats et leur charge de travail
console.log("\n=== Lawyers Workload Summary ===");
lawyersList.forEach((lawyer) => {
  console.log(
    `${lawyer.name} (${lawyer.specialty}): ${lawyer.getWorkload()} active cases`
  );
  if (lawyer.getWorkload() > 0) {
    console.log(`  - Cases: ${lawyer.getAssignedProcedures().join(", ")}`);
  }
});

////
// ---- Partie 5 ----

enum ReimbursementMethod {
  BANK_TRANSFER = "bank_transfer",
  CASH = "cash",
  CARD = "card",
}

enum ReimbursementStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  FAILED = "failed",
}

class Reimbursement {
  constructor(
    public id: number,
    public accidentId: number,
    public amount: number,
    public date: Date,
    public method: ReimbursementMethod,
    public status: ReimbursementStatus = ReimbursementStatus.PENDING,
    public isPartial: boolean = false,
    public description?: string
  ) {}

  process(): void {
    this.status = ReimbursementStatus.PROCESSED;
  }

  fail(): void {
    this.status = ReimbursementStatus.FAILED;
  }

  isProcessed(): boolean {
    return this.status === ReimbursementStatus.PROCESSED;
  }
}

class AccidentReimbursement {
  private reimbursements: Reimbursement[] = [];

  constructor(public accidentId: number, public totalClaimAmount: number) {}

  addReimbursement(reimbursement: Reimbursement): void {
    if (reimbursement.accidentId !== this.accidentId) {
      throw new Error("Reimbursement must be for the same accident");
    }

    const currentTotal = this.getTotalReimbursed();
    if (currentTotal + reimbursement.amount > this.totalClaimAmount) {
      throw new Error(
        `Reimbursement amount exceeds claim total. Available: €${
          this.totalClaimAmount - currentTotal
        }`
      );
    }

    this.reimbursements.push(reimbursement);
  }

  getReimbursements(): Reimbursement[] {
    return [...this.reimbursements];
  }

  getTotalReimbursed(): number {
    return this.reimbursements.reduce((total, reimbursement) => {
      return reimbursement.isProcessed() ? total + reimbursement.amount : total;
    }, 0);
  }

  getRemainingAmount(): number {
    return this.totalClaimAmount - this.getTotalReimbursed();
  }

  isFullyReimbursed(): boolean {
    return this.getRemainingAmount() === 0;
  }

  getProcessedReimbursements(): Reimbursement[] {
    return this.reimbursements.filter((r) => r.isProcessed());
  }

  getPendingReimbursements(): Reimbursement[] {
    return this.reimbursements.filter(
      (r) => r.status === ReimbursementStatus.PENDING
    );
  }
}

enum AnomalyStatus {
  DETECTED = "detected",
  INVESTIGATING = "investigating",
  RESOLVED = "resolved",
}

enum AnomalyType {
  CONTRACT = "contract",
  PAYMENT = "payment",
  ACCIDENT = "accident",
  REIMBURSEMENT = "reimbursement",
}

enum AnomalySeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

class Anomaly {
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

class Audit {
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

class AuditService {
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

////
// ---- Partie 6 ----

enum ReinsuranceStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  SUSPENDED = "suspended",
}

class InsuranceCompany {
  constructor(
    public id: number,
    public name: string,
    public country: string,
    public rating: string, // ex: "AA+", "A", "BBB"
    public contactEmail: string
  ) {}

  getRiskLevel(): string {
    const ratingLevel = this.rating.toLowerCase();
    if (ratingLevel.includes("aa")) return "Very Low";
    if (ratingLevel.includes("a")) return "Low";
    if (ratingLevel.includes("bb")) return "Medium";
    return "High";
  }
}

class ReinsuranceContract {
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

class ReinsuranceCoverage {
  private reinsuranceContracts: ReinsuranceContract[] = [];

  constructor(public contractId: number) {}

  addReinsurance(contract: ReinsuranceContract): void {
    // Vérifier que le total ne dépasse pas 100%
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

    // Calculer les parts des réassureurs
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

class UltimateContract extends AdvancedContract {
  private accidentReimbursements: Map<number, AccidentReimbursement> =
    new Map();
  private reinsuranceCoverage?: ReinsuranceCoverage;
  private audits: Audit[] = [];

  constructor(
    id: number,
    basePrice: number,
    status: ContractStatus,
    reduction: number = 0,
    bonus: number = 0
  ) {
    super(id, basePrice, status, reduction, bonus);
  }

  createAccidentReimbursement(
    accidentId: number,
    claimAmount: number
  ): AccidentReimbursement {
    if (this.accidentReimbursements.has(accidentId)) {
      throw new Error(
        `Reimbursement already exists for accident ${accidentId}`
      );
    }

    const reimbursement = new AccidentReimbursement(accidentId, claimAmount);
    this.accidentReimbursements.set(accidentId, reimbursement);
    return reimbursement;
  }

  getAccidentReimbursement(
    accidentId: number
  ): AccidentReimbursement | undefined {
    return this.accidentReimbursements.get(accidentId);
  }

  getAllAccidentReimbursements(): AccidentReimbursement[] {
    return Array.from(this.accidentReimbursements.values());
  }

  getTotalReimbursements(): number {
    return Array.from(this.accidentReimbursements.values()).reduce(
      (total, ar) => {
        return total + ar.getTotalReimbursed();
      },
      0
    );
  }

  setReinsuranceCoverage(coverage: ReinsuranceCoverage): void {
    this.reinsuranceCoverage = coverage;
  }

  getReinsuranceCoverage(): ReinsuranceCoverage | undefined {
    return this.reinsuranceCoverage;
  }

  calculateReinsuranceDistribution(
    claimAmount: number
  ): Map<
    string,
    { company: string; amount: number; percentage: number }
  > | null {
    if (!this.reinsuranceCoverage) {
      return null;
    }
    return this.reinsuranceCoverage.calculateReinsuranceShares(claimAmount);
  }

  addAudit(audit: Audit): void {
    this.audits.push(audit);
  }

  getAudits(): Audit[] {
    return [...this.audits];
  }

  getLatestAudit(): Audit | undefined {
    return this.audits.sort(
      (a, b) => b.startDate.getTime() - a.startDate.getTime()
    )[0];
  }

  getUnresolvedAnomalies(): Anomaly[] {
    const allAnomalies: Anomaly[] = [];
    this.audits.forEach((audit) => {
      allAnomalies.push(...audit.getUnresolvedAnomalies());
    });
    return allAnomalies;
  }
}

class UltimateClient extends ComprehensiveClient {
  private ultimateContracts: UltimateContract[] = [];

  addUltimateContract(contract: UltimateContract): void {
    this.ultimateContracts.push(contract);
    super.addAdvancedContract(contract);
  }

  getUltimateContracts(): UltimateContract[] {
    return [...this.ultimateContracts];
  }

  getTotalReimbursements(): number {
    return this.ultimateContracts.reduce((total, contract) => {
      return total + contract.getTotalReimbursements();
    }, 0);
  }

  getActiveReinsuranceContracts(): ReinsuranceContract[] {
    const allContracts: ReinsuranceContract[] = [];
    this.ultimateContracts.forEach((contract) => {
      const coverage = contract.getReinsuranceCoverage();
      if (coverage) {
        allContracts.push(...coverage.getActiveReinsuranceContracts());
      }
    });
    return allContracts;
  }

  getAllUnresolvedAnomalies(): Anomaly[] {
    const allAnomalies: Anomaly[] = [];
    this.ultimateContracts.forEach((contract) => {
      allAnomalies.push(...contract.getUnresolvedAnomalies());
    });
    return allAnomalies;
  }

  getReinsuranceCoverageOverview(): {
    totalCoverage: number;
    selfRetained: number;
    riskDistribution: Map<string, number>;
  } {
    const riskDistribution = new Map<string, number>();
    let totalCoverage = 0;
    let contractCount = 0;

    this.ultimateContracts.forEach((contract) => {
      const coverage = contract.getReinsuranceCoverage();
      if (coverage) {
        contractCount++;
        totalCoverage += coverage.getTotalCoveragePercentage();

        coverage.getActiveReinsuranceContracts().forEach((reinsContract) => {
          const existing =
            riskDistribution.get(reinsContract.reinsurer.name) || 0;
          riskDistribution.set(
            reinsContract.reinsurer.name,
            existing + reinsContract.riskPercentage
          );
        });
      }
    });

    const avgCoverage = contractCount > 0 ? totalCoverage / contractCount : 0;

    return {
      totalCoverage: avgCoverage,
      selfRetained: 100 - avgCoverage,
      riskDistribution,
    };
  }
}

// ---- Tests Parties 5 et 6 ----

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
  aliceUltimateContract.createAccidentReimbursement(aliceFireAccident.id, 8000);
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
  `  - Number of payments: ${aliceFireReimbursement.getReimbursements().length}`
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

console.log(`\nAudit ${audit.id} summary:`);
console.log(
  `  - Period: ${audit.startDate.toISOString().slice(0, 10)} to ${audit.endDate
    .toISOString()
    .slice(0, 10)}`
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

console.log(`\nAfter investigation:`);
const updatedStatusCount = audit.getAnomalyCountByStatus();
console.log(`  - Detected: ${updatedStatusCount.detected}`);
console.log(`  - Investigating: ${updatedStatusCount.investigating}`);
console.log(`  - Resolved: ${updatedStatusCount.resolved}`);
console.log(`  - Completion rate: ${audit.getCompletionRate()}%`);

aliceUltimateContract.addAudit(audit);

const assurOne = new InsuranceCompany(
  1,
  "assure One Ltd",
  "paris",
  "AA-",
  "contact@assurOne.com"
);

const assurTwo = new InsuranceCompany(
  2,
  "assure two Group",
  "Versailles",
  "AA",
  "info@assurtwo.com"
);

const assurThree = new InsuranceCompany(
  3,
  "assure Three Group",
  "London",
  "A+",
  "question@three.com"
);

[assurOne, assurTwo, assurThree].forEach((company) => {
  console.log(
    `${company.name} (${company.country}) - Rating: ${
      company.rating
    } - Risk Level: ${company.getRiskLevel()}`
  );
});

const assurOneContract = new ReinsuranceContract(
  1,
  assurOne,
  new Date("2025-01-01"),
  new Date("2025-12-31"),
  40, // 40% du risque
  50000
);

const munichReContract = new ReinsuranceContract(
  2,
  assurTwo,
  new Date("2025-01-01"),
  new Date("2025-12-31"),
  35,
  40000
);

const lloydsContract = new ReinsuranceContract(
  3,
  assurThree,
  new Date("2025-06-01"),
  new Date("2026-05-31"),
  20,
  25000
);

[assurOneContract, munichReContract, lloydsContract].forEach((contract) => {
  console.log(
    `${contract.reinsurer.name}: ${contract.riskPercentage}% coverage, max €${contract.maxCoverageAmount}`
  );
});

const aliceCoverage = new ReinsuranceCoverage(aliceUltimateContract.id);

try {
  aliceCoverage.addReinsurance(assurOneContract);
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
  console.log(`\nClaim amount: €${claimAmount}`);
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
  `\nBob's distribution (no reinsurance): ${
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
  `  - Average reinsurance coverage: ${riskOverview.totalCoverage.toFixed(1)}%`
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
  `  - Unresolved anomalies: ${ultimateBob.getAllUnresolvedAnomalies().length}`
);

const bySeverity = {
  critical: allAnomalies.filter((a) => a.severity === AnomalySeverity.CRITICAL)
    .length,
  high: allAnomalies.filter((a) => a.severity === AnomalySeverity.HIGH).length,
  medium: allAnomalies.filter((a) => a.severity === AnomalySeverity.MEDIUM)
    .length,
  low: allAnomalies.filter((a) => a.severity === AnomalySeverity.LOW).length,
};

console.log(`  - Critical: ${bySeverity.critical}`);
console.log(`  - High: ${bySeverity.high}`);
console.log(`  - Medium: ${bySeverity.medium}`);
console.log(`  - Low: ${bySeverity.low}`);
