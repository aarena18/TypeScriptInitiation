// to see the //console.logs, type:
// npx tsc exercice3.tsx --target es2020
// node exercice3.js
////
// ---- Partie 1 ----
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["ACTIVE"] = "actif";
    ContractStatus["TERMINATED"] = "r\u00E9sili\u00E9";
})(ContractStatus || (ContractStatus = {}));
var ClientType;
(function (ClientType) {
    ClientType["STANDARD"] = "standard";
    ClientType["VIP"] = "vip";
})(ClientType || (ClientType = {}));
class ContactInfo {
    constructor(email, phone) {
        this.email = email;
        this.phone = phone;
    }
}
class Contract {
    constructor(id, basePrice, status, reduction = 0, bonus = 0) {
        this.id = id;
        this.basePrice = basePrice;
        this.status = status;
        this.reduction = reduction;
        this.bonus = bonus;
    }
    calculateFinalPrice() {
        return this.basePrice - this.reduction + this.bonus;
    }
    isActive() {
        return this.status === ContractStatus.ACTIVE;
    }
}
class Client {
    constructor(id, contact, type = ClientType.STANDARD) {
        this.id = id;
        this.contact = contact;
        this.type = type;
        this.contracts = [];
    }
    isVip() {
        return this.type === ClientType.VIP;
    }
    addContract(contract) {
        if (this.isVip()) {
            contract.reduction += contract.basePrice * 0.1;
            contract.bonus += 50;
        }
        this.contracts.push(contract);
    }
    getActiveContracts() {
        return this.contracts.filter((contract) => contract.isActive());
    }
    getAllContracts() {
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
    console.log(`Contract ${contract.id}: BasePrice=€${contract.basePrice}, Reduction=€${contract.reduction}, Bonus=€${contract.bonus}, Final=€${contract.calculateFinalPrice()}`);
});
console.log("Alice active contracts details:", alice.getActiveContracts());
////
// ---- Partie 2 ----
var AccidentType;
(function (AccidentType) {
    AccidentType["FIRE"] = "fire";
    AccidentType["THEFT"] = "theft";
    AccidentType["WATER_DAMAGE"] = "water_damage";
    AccidentType["ACCIDENT"] = "accident";
    AccidentType["VANDALISM"] = "vandalism";
})(AccidentType || (AccidentType = {}));
class Accident {
    constructor(id, contractId, date, type, description, assignedExpertId) {
        this.id = id;
        this.contractId = contractId;
        this.date = date;
        this.type = type;
        this.description = description;
        this.assignedExpertId = assignedExpertId;
    }
    isAssigned() {
        return this.assignedExpertId !== undefined;
    }
}
class Expert {
    constructor(id, name, specialty) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
        this.assignedAccidents = [];
    }
    canHandle(accidentType) {
        return this.specialty === accidentType;
    }
    assignAccident(accidentId) {
        if (!this.assignedAccidents.includes(accidentId)) {
            this.assignedAccidents.push(accidentId);
        }
    }
    getAssignedAccidents() {
        return [...this.assignedAccidents];
    }
    getWorkload() {
        return this.assignedAccidents.length;
    }
}
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
})(PaymentMethod || (PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (PaymentStatus = {}));
class Payment {
    constructor(id, contractId, amount, method, date, status = PaymentStatus.PENDING) {
        this.id = id;
        this.contractId = contractId;
        this.amount = amount;
        this.method = method;
        this.date = date;
        this.status = status;
        this.retryCount = 0;
        this.maxRetries = 3;
    }
    canRetry() {
        return (this.status === PaymentStatus.FAILED && this.retryCount < this.maxRetries);
    }
    retry() {
        if (this.canRetry()) {
            this.retryCount++;
            this.status = PaymentStatus.PENDING;
            return true;
        }
        return false;
    }
    complete() {
        this.status = PaymentStatus.COMPLETED;
    }
    fail() {
        this.status = PaymentStatus.FAILED;
    }
    getRetryCount() {
        return this.retryCount;
    }
    isCompleted() {
        return this.status === PaymentStatus.COMPLETED;
    }
}
class UpdatedContract extends Contract {
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
// ---- Tests Partie 2 ----
const fireExpert = new Expert(1, "Jean Dupont", AccidentType.FIRE);
const theftExpert = new Expert(2, "Marie Martin", AccidentType.THEFT);
const waterExpert = new Expert(3, "Pierre Durand", AccidentType.WATER_DAMAGE);
const expertsList = [fireExpert, theftExpert, waterExpert];
const aliceUpdatedContract = new UpdatedContract(aliceContract1.id, aliceContract1.basePrice, aliceContract1.status, aliceContract1.reduction, aliceContract1.bonus);
//console.log(aliceUpdatedContract.basePrice);
const bobUpdatedContract = new UpdatedContract(bobContract.id, bobContract.basePrice, bobContract.status);
//console.log(bobUpdatedContract.basePrice);
const aliceFireAccident = new Accident(3001, aliceContract1.id, new Date("2025-09-25"), AccidentType.FIRE, "Kitchen fire at Alice's home - burnt pancackes");
const aliceTheftAccident = new Accident(3002, aliceContract1.id, new Date("2025-09-26"), AccidentType.THEFT, "Alice's laptop stolen from car");
const bobWaterAccident = new Accident(3003, bobContract.id, new Date("2025-09-26"), AccidentType.WATER_DAMAGE, "Bob's apartment - pipe burst in bathroom");
function assignExpertToAccident(accident, experts) {
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
const assignedFireExpert = assignExpertToAccident(aliceFireAccident, expertsList);
console.log("Fire accident assigned to expert:", assignedFireExpert?.name, "(ID:", aliceFireAccident.assignedExpertId, ")");
console.log("Fire expert workload:", fireExpert.name, fireExpert.getWorkload(), "accidents");
const assignedTheftExpert = assignExpertToAccident(aliceTheftAccident, expertsList);
console.log("Theft accident assigned to expert:", assignedTheftExpert?.name, "(ID:", aliceTheftAccident.assignedExpertId, ")");
console.log("Theft expert workload:", theftExpert.name, theftExpert.getWorkload(), "accidents");
const assignedWaterExpert = assignExpertToAccident(bobWaterAccident, expertsList);
console.log("Water accident assigned to expert:", assignedWaterExpert?.name, "(ID:", bobWaterAccident.assignedExpertId, ")");
console.log("Water expert workload:", waterExpert.name, waterExpert.getWorkload(), "accidents");
aliceUpdatedContract.addAccident(aliceFireAccident);
console.log("Added fire accident to Alice's contract. Total accidents:", aliceUpdatedContract.getAccidents().length);
aliceUpdatedContract.addAccident(aliceTheftAccident);
console.log("Added theft accident to Alice's contract. Total accidents:", aliceUpdatedContract.getAccidents().length);
bobUpdatedContract.addAccident(bobWaterAccident);
console.log("Added water accident to Bob's contract. Total accidents:", bobUpdatedContract.getAccidents().length);
const alicePayment1 = new Payment(4001, aliceContract1.id, aliceUpdatedContract.calculateFinalPrice(), PaymentMethod.CARD, new Date("2025-09-01"));
console.log("Alice payment 1 created:", alicePayment1.amount, "EUR via", alicePayment1.method);
const alicePayment2 = new Payment(4002, aliceContract1.id, aliceUpdatedContract.calculateFinalPrice(), PaymentMethod.BANK_TRANSFER, new Date("2025-10-01"));
console.log("Alice payment 2 created:", alicePayment2.amount, "EUR via", alicePayment2.method);
console.log("Alice payment 2 can retry:", alicePayment2.canRetry());
if (alicePayment2.canRetry()) {
    alicePayment2.retry();
    console.log("Alice payment 2 after retry - ID:", alicePayment2.id, "Status:", alicePayment2.status);
    console.log("Alice payment 2 retry count:", alicePayment2.getRetryCount());
}
const bobPayment1 = new Payment(4003, bobContract.id, bobUpdatedContract.calculateFinalPrice(), PaymentMethod.CASH, new Date("2025-09-15"));
console.log("Bob payment 1 created:", bobPayment1.amount, "EUR via", bobPayment1.method);
alicePayment1.complete();
console.log("Alice payment 1 completed. Status:", alicePayment1.status);
alicePayment2.fail();
console.log("Alice payment 2 failed. Status:", alicePayment2.status);
bobPayment1.complete();
console.log("Bob payment 1 completed. Status:", bobPayment1.status);
aliceUpdatedContract.addPayment(alicePayment1);
aliceUpdatedContract.addPayment(alicePayment2);
console.log("Alice contract total paid amount:", aliceUpdatedContract.getTotalPaidAmount(), "EUR");
console.log("Alice contract failed payments:", aliceUpdatedContract.getFailedPayments().length);
bobUpdatedContract.addPayment(bobPayment1);
console.log("Bob contract total paid amount:", bobUpdatedContract.getTotalPaidAmount(), "EUR");
////
// ---- Partie 3 ----
var OptionType;
(function (OptionType) {
    OptionType["TRIP_ASSISTANCE"] = "trip_assistance";
    OptionType["JURIDICAL_PROTECTION"] = "juridical_protection";
    OptionType["FAMILY_PROTECTION"] = "family_protection";
})(OptionType || (OptionType = {}));
class ContractOption {
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
var EventAction;
(function (EventAction) {
    EventAction["CONTRACT_CREATED"] = "contract_created";
    EventAction["CONTRACT_TERMINATED"] = "contract_terminated";
    EventAction["ACCIDENT_REPORTED"] = "accident_reported";
    EventAction["PAYMENT_SUCCESSFUL"] = "payment_successful";
    EventAction["PAYMENT_FAILED"] = "payment_failed";
    EventAction["EXPERT_ASSIGNED"] = "expert_assigned";
    EventAction["OPTION_ADDED"] = "option_added";
})(EventAction || (EventAction = {}));
var EntityType;
(function (EntityType) {
    EntityType["CLIENT"] = "client";
    EntityType["CONTRACT"] = "contract";
    EntityType["ACCIDENT"] = "accident";
    EntityType["PAYMENT"] = "payment";
    EntityType["EXPERT"] = "expert";
    EntityType["OPTION"] = "option";
})(EntityType || (EntityType = {}));
class SystemEvent {
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
class FullContract extends UpdatedContract {
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
class EventLogger {
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
class EnhancedClient extends Client {
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
// ---- Tests Partie 3 ----
const eventLogger = new EventLogger();
// Create available options
const tripAssistance = new ContractOption(1, OptionType.TRIP_ASSISTANCE, "Assistance Voyage", "Assistance 24h/24 en cas de panne ou d'accident en voyage", 25);
const juridicalProtection = new ContractOption(2, OptionType.JURIDICAL_PROTECTION, "Protection Juridique", "Assistance juridique et prise en charge des frais de procédure", 15);
const familyProtection = new ContractOption(3, OptionType.FAMILY_PROTECTION, "Protection Famille", "Extension de couverture pour tous les membres de la famille", 35);
console.log("\n=== Available Contract Options ===");
console.log(`- ${tripAssistance.name}: €${tripAssistance.monthlyCost}/month`);
console.log(`- ${juridicalProtection.name}: €${juridicalProtection.monthlyCost}/month`);
console.log(`- ${familyProtection.name}: €${familyProtection.monthlyCost}/month`);
// Convert to enhanced clients and full contracts
const enhancedAlice = new EnhancedClient(alice.id, alice.contact, alice.type);
const enhancedBob = new EnhancedClient(bob.id, bob.contact, bob.type);
// Create full contracts from existing data
const aliceFullContract = new FullContract(aliceContract1.id, aliceContract1.basePrice, aliceContract1.status, aliceContract1.reduction, aliceContract1.bonus);
const bobFullContract = new FullContract(bobContract.id, bobContract.basePrice, bobContract.status);
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
console.log("Alice base premium:", aliceFullContract.calculateFinalPrice(), "EUR");
console.log("Alice total with options:", aliceFullContract.calculateFinalPriceWithOptions(), "EUR");
console.log("Bob base premium:", bobFullContract.calculateFinalPrice(), "EUR");
console.log("Bob total with options:", bobFullContract.calculateFinalPriceWithOptions(), "EUR");
console.log("\n=== Quick Listing System ===");
console.log("Alice active contracts:", enhancedAlice.getActiveContractsSummary());
console.log("Alice ongoing accidents:", enhancedAlice.getOngoingAccidents().length);
console.log("Alice payment history:", enhancedAlice.getPaymentHistory().length, "payments");
console.log("Alice total monthly premium:", enhancedAlice.getTotalMonthlyPremium(), "EUR");
console.log("Bob active contracts:", enhancedBob.getActiveContractsSummary());
console.log("Bob ongoing accidents:", enhancedBob.getOngoingAccidents().length);
console.log("Bob payment history:", enhancedBob.getPaymentHistory().length, "payments");
console.log("Bob total monthly premium:", enhancedBob.getTotalMonthlyPremium(), "EUR");
// Log contract creation events
eventLogger.logEvent(EventAction.CONTRACT_CREATED, EntityType.CONTRACT, aliceFullContract.id, `Contract created for VIP client Alice`, enhancedAlice.id);
eventLogger.logEvent(EventAction.CONTRACT_CREATED, EntityType.CONTRACT, bobFullContract.id, `Contract created for standard client Bob`, enhancedBob.id);
// Alice adds options to her contract (VIP gets multiple options)
aliceFullContract.addOption(tripAssistance);
console.log("Added", tripAssistance.name, "to Alice's contract");
aliceFullContract.addOption(juridicalProtection);
console.log("Added", juridicalProtection.name, "to Alice's contract");
console.log("Alice's total options cost:", aliceFullContract.getTotalOptionsCost(), "EUR/month");
eventLogger.logEvent(EventAction.OPTION_ADDED, EntityType.OPTION, tripAssistance.id, `Alice added ${tripAssistance.name} to contract ${aliceFullContract.id}`, enhancedAlice.id);
eventLogger.logEvent(EventAction.OPTION_ADDED, EntityType.OPTION, juridicalProtection.id, `Alice added ${juridicalProtection.name} to contract ${aliceFullContract.id}`, enhancedAlice.id);
// Bob adds one option
bobFullContract.addOption(familyProtection);
console.log("Added", familyProtection.name, "to Bob's contract");
console.log("Bob's total options cost:", bobFullContract.getTotalOptionsCost(), "EUR/month");
eventLogger.logEvent(EventAction.OPTION_ADDED, EntityType.OPTION, familyProtection.id, `Bob added ${familyProtection.name} to contract ${bobFullContract.id}`, enhancedBob.id);
// Log existing accidents
eventLogger.logEvent(EventAction.ACCIDENT_REPORTED, EntityType.ACCIDENT, aliceFireAccident.id, `Fire accident reported by Alice: ${aliceFireAccident.description}`, enhancedAlice.id);
eventLogger.logEvent(EventAction.EXPERT_ASSIGNED, EntityType.EXPERT, assignedFireExpert.id, `Expert ${assignedFireExpert.name} assigned to Alice's fire accident`, enhancedAlice.id);
// Log payments
eventLogger.logEvent(EventAction.PAYMENT_SUCCESSFUL, EntityType.PAYMENT, alicePayment1.id, `Alice's payment of €${alicePayment1.amount} completed successfully`, enhancedAlice.id);
eventLogger.logEvent(EventAction.PAYMENT_FAILED, EntityType.PAYMENT, alicePayment2.id, `Alice's payment of €${alicePayment2.amount} failed`, enhancedAlice.id);
console.log("\n=== Event Logging System ===");
console.log("Recent system events:");
eventLogger.getRecentEvents(5).forEach((event) => {
    console.log(`[${event.date.toISOString().slice(0, 10)}] ${event.action}: ${event.description}`);
});
console.log("\nAlice's complete event history:");
eventLogger.getEventsByClient(enhancedAlice.id).forEach((event) => {
    console.log(`  - ${event.action}: ${event.description}`);
});
////
// ---- Partie 4 ----
// F. Système de bénéficiaires
var BeneficiaryRelation;
(function (BeneficiaryRelation) {
    BeneficiaryRelation["SPOUSE"] = "spouse";
    BeneficiaryRelation["CHILD"] = "child";
    BeneficiaryRelation["PARENT"] = "parent";
    BeneficiaryRelation["SIBLING"] = "sibling";
    BeneficiaryRelation["PARTNER_COMPANY"] = "partner_company";
    BeneficiaryRelation["OTHER"] = "other";
})(BeneficiaryRelation || (BeneficiaryRelation = {}));
class Beneficiary {
    constructor(id, name, relation, email, phone) {
        this.id = id;
        this.name = name;
        this.relation = relation;
        this.email = email;
        this.phone = phone;
    }
    getContactInfo() {
        const contact = [];
        if (this.email)
            contact.push(`Email: ${this.email}`);
        if (this.phone)
            contact.push(`Phone: ${this.phone}`);
        return contact.length > 0 ? contact.join(", ") : "No contact info";
    }
}
class ContractBeneficiary {
    constructor(beneficiary, sharePercentage, // Part du contrat en pourcentage
    contractId) {
        this.beneficiary = beneficiary;
        this.sharePercentage = sharePercentage;
        this.contractId = contractId;
        if (sharePercentage <= 0 || sharePercentage > 100) {
            throw new Error("Share percentage must be between 0 and 100");
        }
    }
    getShareAmount(contractValue) {
        return (contractValue * this.sharePercentage) / 100;
    }
}
// G. Système de procédures judiciaires
var LegalProcedureStatus;
(function (LegalProcedureStatus) {
    LegalProcedureStatus["OPEN"] = "open";
    LegalProcedureStatus["IN_PROGRESS"] = "in_progress";
    LegalProcedureStatus["SETTLED"] = "settled";
    LegalProcedureStatus["CANCELLED"] = "cancelled";
})(LegalProcedureStatus || (LegalProcedureStatus = {}));
var LawyerSpecialty;
(function (LawyerSpecialty) {
    LawyerSpecialty["INSURANCE_LAW"] = "insurance_law";
    LawyerSpecialty["CIVIL_LAW"] = "civil_law";
    LawyerSpecialty["COMMERCIAL_LAW"] = "commercial_law";
    LawyerSpecialty["CRIMINAL_LAW"] = "criminal_law";
})(LawyerSpecialty || (LawyerSpecialty = {}));
class Lawyer {
    constructor(id, name, specialty, barNumber // Numéro au barreau
    ) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
        this.barNumber = barNumber;
        this.assignedProcedures = [];
    }
    canHandle(procedureType) {
        return this.specialty === procedureType;
    }
    assignProcedure(procedureId) {
        if (!this.assignedProcedures.includes(procedureId)) {
            this.assignedProcedures.push(procedureId);
        }
    }
    getAssignedProcedures() {
        return [...this.assignedProcedures];
    }
    getWorkload() {
        return this.assignedProcedures.length;
    }
    removeProcedure(procedureId) {
        const index = this.assignedProcedures.indexOf(procedureId);
        if (index !== -1) {
            this.assignedProcedures.splice(index, 1);
            return true;
        }
        return false;
    }
}
class LegalProcedure {
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
// Extension des classes existantes pour la Partie 4
class AdvancedContract extends FullContract {
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
class ComprehensiveClient extends EnhancedClient {
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
// Fonction utilitaire pour assigner un avocat à une procédure
function assignLawyerToProcedure(procedure, lawyers, requiredSpecialty) {
    let availableLawyers = lawyers;
    // Filtrer par spécialité si requise
    if (requiredSpecialty) {
        availableLawyers = lawyers.filter(lawyer => lawyer.canHandle(requiredSpecialty));
    }
    // Trier par charge de travail (le moins chargé en premier)
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
// Créer des bénéficiaires
const spouse = new Beneficiary(1, "Marie Alice Martin", BeneficiaryRelation.SPOUSE, "marie.martin@email.com", "0607080910");
const child1 = new Beneficiary(2, "Lucas Martin", BeneficiaryRelation.CHILD, "lucas.martin@email.com");
const child2 = new Beneficiary(3, "Emma Martin", BeneficiaryRelation.CHILD);
const partnerCompany = new Beneficiary(4, "TechCorp Solutions", BeneficiaryRelation.PARTNER_COMPANY, "contact@techcorp.com", "0102030405");
console.log("\n=== Beneficiaries Created ===");
console.log(`Spouse: ${spouse.name} (${spouse.relation}) - ${spouse.getContactInfo()}`);
console.log(`Child 1: ${child1.name} (${child1.relation}) - ${child1.getContactInfo()}`);
console.log(`Child 2: ${child2.name} (${child2.relation}) - ${child2.getContactInfo()}`);
console.log(`Partner: ${partnerCompany.name} (${partnerCompany.relation}) - ${partnerCompany.getContactInfo()}`);
// Créer un client complet et un contrat avancé
const comprehensiveAlice = new ComprehensiveClient(alice.id, alice.contact, alice.type);
// Créer un contrat avancé basé sur le contrat d'Alice existant
const aliceAdvancedContract = new AdvancedContract(aliceContract1.id, aliceContract1.basePrice, aliceContract1.status, aliceContract1.reduction, aliceContract1.bonus);
// Ajouter les accidents et paiements existants
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
    console.log("\n=== Contract Beneficiaries Added ===");
    console.log(`${spouse.name}: ${spouseBeneficiary.sharePercentage}%`);
    console.log(`${child1.name}: ${child1Beneficiary.sharePercentage}%`);
    console.log(`${child2.name}: ${child2Beneficiary.sharePercentage}%`);
    console.log(`Total beneficiary shares: ${aliceAdvancedContract.getTotalBeneficiaryShares()}%`);
    // Essayer d'ajouter un autre bénéficiaire qui dépasserait 100%
    try {
        aliceAdvancedContract.addBeneficiary(partnerCompany, 10);
    }
    catch (error) {
        console.log(`Cannot add partner company: ${error.message}`);
    }
}
catch (error) {
    console.error(`Error adding beneficiaries: ${error.message}`);
}
// Créer des avocats
const insuranceLawyer = new Lawyer(1, "Maître Jean Dupuis", LawyerSpecialty.INSURANCE_LAW, "INS2025001");
const civilLawyer = new Lawyer(2, "Maître Sophie Martin", LawyerSpecialty.CIVIL_LAW, "CIV2025002");
const commercialLawyer = new Lawyer(3, "Maître Pierre Durand", LawyerSpecialty.COMMERCIAL_LAW, "COM2025003");
const lawyersList = [insuranceLawyer, civilLawyer, commercialLawyer];
console.log("\n=== Lawyers Created ===");
lawyersList.forEach(lawyer => {
    console.log(`${lawyer.name} - Specialty: ${lawyer.specialty} - Bar #: ${lawyer.barNumber}`);
});
// Créer des procédures judiciaires liées aux accidents
const fireDisputeProcedure = new LegalProcedure(1, new Date("2025-09-27"), LegalProcedureStatus.OPEN, [aliceFireAccident.id], "Dispute over fire damage coverage amount - Client contests the expert assessment");
const theftProcedure = new LegalProcedure(2, new Date("2025-09-28"), LegalProcedureStatus.OPEN, [aliceTheftAccident.id], "Third party claims involving the theft - Potential negligence case");
// Procédure complexe liée à plusieurs accidents
const multiAccidentProcedure = new LegalProcedure(3, new Date("2025-09-29"), LegalProcedureStatus.OPEN, [aliceFireAccident.id, aliceTheftAccident.id], "Class action involving multiple incidents - Potential fraud investigation");
console.log("\n=== Legal Procedures Created ===");
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
const assignedLawyer1 = assignLawyerToProcedure(fireDisputeProcedure, lawyersList, LawyerSpecialty.INSURANCE_LAW);
console.log(`\nFire dispute assigned to: ${assignedLawyer1?.name || "No lawyer available"}`);
if (assignedLawyer1) {
    console.log(`  - Lawyer workload: ${assignedLawyer1.getWorkload()} cases`);
    console.log(`  - Procedure status: ${fireDisputeProcedure.status}`);
}
const assignedLawyer2 = assignLawyerToProcedure(theftProcedure, lawyersList, LawyerSpecialty.CIVIL_LAW);
console.log(`\nTheft procedure assigned to: ${assignedLawyer2?.name || "No lawyer available"}`);
if (assignedLawyer2) {
    console.log(`  - Lawyer workload: ${assignedLawyer2.getWorkload()} cases`);
    console.log(`  - Procedure status: ${theftProcedure.status}`);
}
const assignedLawyer3 = assignLawyerToProcedure(multiAccidentProcedure, lawyersList);
console.log(`\nMulti-accident procedure assigned to: ${assignedLawyer3?.name || "No lawyer available"}`);
if (assignedLawyer3) {
    console.log(`  - Lawyer workload: ${assignedLawyer3.getWorkload()} cases`);
    console.log(`  - Procedure status: ${multiAccidentProcedure.status}`);
}
// Ajouter les procédures au contrat d'Alice
aliceAdvancedContract.addLegalProcedure(fireDisputeProcedure);
aliceAdvancedContract.addLegalProcedure(theftProcedure);
aliceAdvancedContract.addLegalProcedure(multiAccidentProcedure);
// Créer Bob avec un contrat avancé et des procédures supplémentaires
const comprehensiveBob = new ComprehensiveClient(bob.id, bob.contact, bob.type);
const bobAdvancedContract = new AdvancedContract(bobContract.id, bobContract.basePrice, bobContract.status);
bobAdvancedContract.addAccident(bobWaterAccident);
bobAdvancedContract.addPayment(bobPayment1);
bobAdvancedContract.addOption(familyProtection);
comprehensiveBob.addAdvancedContract(bobAdvancedContract);
// Créer des procédures pour Bob qui seront aussi gérées par des avocats existants
const bobWaterDisputeProcedure = new LegalProcedure(4, new Date("2025-09-30"), LegalProcedureStatus.OPEN, [bobWaterAccident.id], "Water damage dispute - Tenant vs Landlord responsibility");
const bobInsuranceProcedure = new LegalProcedure(5, new Date("2025-10-01"), LegalProcedureStatus.OPEN, [bobWaterAccident.id], "Insurance coverage dispute - Policy interpretation");
console.log("\n=== Bob's Legal Procedures Created ===");
console.log(`Procedure ${bobWaterDisputeProcedure.id}: ${bobWaterDisputeProcedure.description}`);
console.log(`Procedure ${bobInsuranceProcedure.id}: ${bobInsuranceProcedure.description}`);
// Assigner les procédures de Bob - certaines au même avocat qu'Alice
const bobAssignedLawyer1 = assignLawyerToProcedure(bobWaterDisputeProcedure, lawyersList, LawyerSpecialty.CIVIL_LAW // Même spécialité que Sophie Martin
);
console.log(`\nBob's water dispute assigned to: ${bobAssignedLawyer1?.name || "No lawyer available"}`);
if (bobAssignedLawyer1) {
    console.log(`  - Lawyer workload after assignment: ${bobAssignedLawyer1.getWorkload()} cases`);
}
const bobAssignedLawyer2 = assignLawyerToProcedure(bobInsuranceProcedure, lawyersList, LawyerSpecialty.INSURANCE_LAW // Même spécialité que Jean Dupuis
);
console.log(`\nBob's insurance dispute assigned to: ${bobAssignedLawyer2?.name || "No lawyer available"}`);
if (bobAssignedLawyer2) {
    console.log(`  - Lawyer workload after assignment: ${bobAssignedLawyer2.getWorkload()} cases`);
}
// Ajouter les procédures au contrat de Bob
bobAdvancedContract.addLegalProcedure(bobWaterDisputeProcedure);
bobAdvancedContract.addLegalProcedure(bobInsuranceProcedure);
// Afficher les statistiques finales
console.log("\n=== Alice's Comprehensive Profile ===");
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
console.log(`\nFire dispute procedure settled. Lawyer ${assignedLawyer1?.name} workload: ${assignedLawyer1?.getWorkload()} cases`);
const updatedLegalStats = comprehensiveAlice.getLegalProceduresCount();
console.log(`Updated legal procedures:`);
console.log(`  - Open/In Progress: ${updatedLegalStats.open}`);
console.log(`  - Settled: ${updatedLegalStats.settled}`);
console.log(`  - Cancelled: ${updatedLegalStats.cancelled}`);
// Afficher tous les avocats et leur charge de travail
console.log("\n=== Lawyers Workload Summary ===");
lawyersList.forEach(lawyer => {
    console.log(`${lawyer.name} (${lawyer.specialty}): ${lawyer.getWorkload()} active cases`);
    if (lawyer.getWorkload() > 0) {
        console.log(`  - Cases: ${lawyer.getAssignedProcedures().join(", ")}`);
    }
});
