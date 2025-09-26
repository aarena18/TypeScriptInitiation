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
// Console.log right after each function
console.log('Alice is VIP:', alice.isVip());
console.log('Bob is VIP:', bob.isVip());
console.log('Alice active contracts:', alice.getActiveContracts().length);
alice.getActiveContracts().forEach((contract) => {
    console.log(`Contract ${contract.id}: BasePrice=€${contract.basePrice}, Reduction=€${contract.reduction}, Bonus=€${contract.bonus}, Final=€${contract.calculateFinalPrice()}`);
});
console.log('Alice active contracts details:', alice.getActiveContracts());
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
        return this.status === PaymentStatus.FAILED && this.retryCount < this.maxRetries;
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
        return this.accidents.filter(accident => !accident.isAssigned());
    }
    addPayment(payment) {
        this.payments.push(payment);
    }
    getPayments() {
        return [...this.payments];
    }
    getCompletedPayments() {
        return this.payments.filter(payment => payment.isCompleted());
    }
    getFailedPayments() {
        return this.payments.filter(payment => payment.status === PaymentStatus.FAILED);
    }
    getPendingPayments() {
        return this.payments.filter(payment => payment.status === PaymentStatus.PENDING);
    }
    getTotalPaidAmount() {
        return this.getCompletedPayments()
            .reduce((total, payment) => total + payment.amount, 0);
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
const aliceFireAccident = new Accident(3001, aliceContract1.id, new Date('2025-09-25'), AccidentType.FIRE, 'Kitchen fire at Alice\'s home - burnt pancackes');
const aliceTheftAccident = new Accident(3002, aliceContract1.id, new Date('2025-09-26'), AccidentType.THEFT, 'Alice\'s laptop stolen from car');
const bobWaterAccident = new Accident(3003, bobContract.id, new Date('2025-09-26'), AccidentType.WATER_DAMAGE, 'Bob\'s apartment - pipe burst in bathroom');
function assignExpertToAccident(accident, experts) {
    const availableExperts = experts
        .filter(expert => expert.canHandle(accident.type))
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
console.log('Fire accident assigned to expert:', assignedFireExpert?.name, '(ID:', aliceFireAccident.assignedExpertId, ')');
console.log('Fire expert workload:', fireExpert.name, fireExpert.getWorkload(), 'accidents');
const assignedTheftExpert = assignExpertToAccident(aliceTheftAccident, expertsList);
console.log('Theft accident assigned to expert:', assignedTheftExpert?.name, '(ID:', aliceTheftAccident.assignedExpertId, ')');
console.log('Theft expert workload:', theftExpert.name, theftExpert.getWorkload(), 'accidents');
const assignedWaterExpert = assignExpertToAccident(bobWaterAccident, expertsList);
console.log('Water accident assigned to expert:', assignedWaterExpert?.name, '(ID:', bobWaterAccident.assignedExpertId, ')');
console.log('Water expert workload:', waterExpert.name, waterExpert.getWorkload(), 'accidents');
aliceUpdatedContract.addAccident(aliceFireAccident);
console.log('Added fire accident to Alice\'s contract. Total accidents:', aliceUpdatedContract.getAccidents().length);
aliceUpdatedContract.addAccident(aliceTheftAccident);
console.log('Added theft accident to Alice\'s contract. Total accidents:', aliceUpdatedContract.getAccidents().length);
bobUpdatedContract.addAccident(bobWaterAccident);
console.log('Added water accident to Bob\'s contract. Total accidents:', bobUpdatedContract.getAccidents().length);
const alicePayment1 = new Payment(4001, aliceContract1.id, aliceUpdatedContract.calculateFinalPrice(), PaymentMethod.CARD, new Date('2025-09-01'));
console.log('Alice payment 1 created:', alicePayment1.amount, 'EUR via', alicePayment1.method);
const alicePayment2 = new Payment(4002, aliceContract1.id, aliceUpdatedContract.calculateFinalPrice(), PaymentMethod.BANK_TRANSFER, new Date('2025-10-01'));
console.log('Alice payment 2 created:', alicePayment2.amount, 'EUR via', alicePayment2.method);
console.log('Alice payment 2 can retry:', alicePayment2.canRetry());
if (alicePayment2.canRetry()) {
    alicePayment2.retry();
    console.log('Alice payment 2 after retry - ID:', alicePayment2.id, 'Status:', alicePayment2.status);
    console.log('Alice payment 2 retry count:', alicePayment2.getRetryCount());
}
const bobPayment1 = new Payment(4003, bobContract.id, bobUpdatedContract.calculateFinalPrice(), PaymentMethod.CASH, new Date('2025-09-15'));
console.log('Bob payment 1 created:', bobPayment1.amount, 'EUR via', bobPayment1.method);
alicePayment1.complete();
console.log('Alice payment 1 completed. Status:', alicePayment1.status);
alicePayment2.fail();
console.log('Alice payment 2 failed. Status:', alicePayment2.status);
bobPayment1.complete();
console.log('Bob payment 1 completed. Status:', bobPayment1.status);
aliceUpdatedContract.addPayment(alicePayment1);
aliceUpdatedContract.addPayment(alicePayment2);
console.log('Alice contract total paid amount:', aliceUpdatedContract.getTotalPaidAmount(), 'EUR');
console.log('Alice contract failed payments:', aliceUpdatedContract.getFailedPayments().length);
bobUpdatedContract.addPayment(bobPayment1);
console.log('Bob contract total paid amount:', bobUpdatedContract.getTotalPaidAmount(), 'EUR');
////
// ---- Partie 3 ----
// d. Contract Options System
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
// e. Event Logging System
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
// Enhanced Contract with Options
class FullContract extends UpdatedContract {
    constructor() {
        super(...arguments);
        this.options = [];
    }
    addOption(option) {
        // Check if option already exists
        const existingOption = this.options.find(opt => opt.id === option.id);
        if (!existingOption) {
            this.options.push(option);
        }
    }
    removeOption(optionId) {
        const index = this.options.findIndex(opt => opt.id === optionId);
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
        return this.options.filter(option => option.type === type);
    }
}
// Event Logger
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
        return this.events.filter(event => event.clientId === clientId);
    }
    getEventsByAction(action) {
        return this.events.filter(event => event.action === action);
    }
    getEventsByEntity(entityType, entityId) {
        return this.events.filter(event => event.entityType === entityType && event.entityId === entityId);
    }
    getAllEvents() {
        return [...this.events].sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    getRecentEvents(count = 10) {
        return this.getAllEvents().slice(0, count);
    }
}
// Enhanced Client with Quick Listing System
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
        return this.fullContracts.filter(contract => contract.isActive());
    }
    // Quick listing methods as requested in e.
    getActiveContractsSummary() {
        return this.getActiveFullContracts().map(contract => `Contract ${contract.id}: €${contract.calculateFinalPriceWithOptions()}/month (${contract.getOptions().length} options)`);
    }
    getOngoingAccidents() {
        const accidents = [];
        this.fullContracts.forEach(contract => {
            accidents.push(...contract.getAccidents().filter(acc => acc.isAssigned()));
        });
        return accidents;
    }
    getPaymentHistory() {
        const payments = [];
        this.fullContracts.forEach(contract => {
            payments.push(...contract.getPayments());
        });
        return payments.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    getTotalMonthlyPremium() {
        return this.getActiveFullContracts()
            .reduce((total, contract) => total + contract.calculateFinalPriceWithOptions(), 0);
    }
}
// ---- Data Setup Partie 3 ----
// Create event logger
const eventLogger = new EventLogger();
// Create available options
const tripAssistance = new ContractOption(1, OptionType.TRIP_ASSISTANCE, "Assistance Voyage", "Assistance 24h/24 en cas de panne ou d'accident en voyage", 25);
const juridicalProtection = new ContractOption(2, OptionType.JURIDICAL_PROTECTION, "Protection Juridique", "Assistance juridique et prise en charge des frais de procédure", 15);
const familyProtection = new ContractOption(3, OptionType.FAMILY_PROTECTION, "Protection Famille", "Extension de couverture pour tous les membres de la famille", 35);
console.log('\n=== Available Contract Options ===');
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
console.log('\n=== Final Contract Pricing ===');
console.log('Alice base premium:', aliceFullContract.calculateFinalPrice(), 'EUR');
console.log('Alice total with options:', aliceFullContract.calculateFinalPriceWithOptions(), 'EUR');
console.log('Bob base premium:', bobFullContract.calculateFinalPrice(), 'EUR');
console.log('Bob total with options:', bobFullContract.calculateFinalPriceWithOptions(), 'EUR');
console.log('\n=== Quick Listing System ===');
console.log('Alice active contracts:', enhancedAlice.getActiveContractsSummary());
console.log('Alice ongoing accidents:', enhancedAlice.getOngoingAccidents().length);
console.log('Alice payment history:', enhancedAlice.getPaymentHistory().length, 'payments');
console.log('Alice total monthly premium:', enhancedAlice.getTotalMonthlyPremium(), 'EUR');
console.log('Bob active contracts:', enhancedBob.getActiveContractsSummary());
console.log('Bob ongoing accidents:', enhancedBob.getOngoingAccidents().length);
console.log('Bob payment history:', enhancedBob.getPaymentHistory().length, 'payments');
console.log('Bob total monthly premium:', enhancedBob.getTotalMonthlyPremium(), 'EUR');
// Log contract creation events
eventLogger.logEvent(EventAction.CONTRACT_CREATED, EntityType.CONTRACT, aliceFullContract.id, `Contract created for VIP client Alice`, enhancedAlice.id);
eventLogger.logEvent(EventAction.CONTRACT_CREATED, EntityType.CONTRACT, bobFullContract.id, `Contract created for standard client Bob`, enhancedBob.id);
// Alice adds options to her contract (VIP gets multiple options)
aliceFullContract.addOption(tripAssistance);
console.log('Added', tripAssistance.name, 'to Alice\'s contract');
aliceFullContract.addOption(juridicalProtection);
console.log('Added', juridicalProtection.name, 'to Alice\'s contract');
console.log('Alice\'s total options cost:', aliceFullContract.getTotalOptionsCost(), 'EUR/month');
eventLogger.logEvent(EventAction.OPTION_ADDED, EntityType.OPTION, tripAssistance.id, `Alice added ${tripAssistance.name} to contract ${aliceFullContract.id}`, enhancedAlice.id);
eventLogger.logEvent(EventAction.OPTION_ADDED, EntityType.OPTION, juridicalProtection.id, `Alice added ${juridicalProtection.name} to contract ${aliceFullContract.id}`, enhancedAlice.id);
// Bob adds one option
bobFullContract.addOption(familyProtection);
console.log('Added', familyProtection.name, 'to Bob\'s contract');
console.log('Bob\'s total options cost:', bobFullContract.getTotalOptionsCost(), 'EUR/month');
eventLogger.logEvent(EventAction.OPTION_ADDED, EntityType.OPTION, familyProtection.id, `Bob added ${familyProtection.name} to contract ${bobFullContract.id}`, enhancedBob.id);
// Log existing accidents
eventLogger.logEvent(EventAction.ACCIDENT_REPORTED, EntityType.ACCIDENT, aliceFireAccident.id, `Fire accident reported by Alice: ${aliceFireAccident.description}`, enhancedAlice.id);
eventLogger.logEvent(EventAction.EXPERT_ASSIGNED, EntityType.EXPERT, assignedFireExpert.id, `Expert ${assignedFireExpert.name} assigned to Alice's fire accident`, enhancedAlice.id);
// Log payments
eventLogger.logEvent(EventAction.PAYMENT_SUCCESSFUL, EntityType.PAYMENT, alicePayment1.id, `Alice's payment of €${alicePayment1.amount} completed successfully`, enhancedAlice.id);
eventLogger.logEvent(EventAction.PAYMENT_FAILED, EntityType.PAYMENT, alicePayment2.id, `Alice's payment of €${alicePayment2.amount} failed`, enhancedAlice.id);
console.log('\n=== Event Logging System ===');
console.log('Recent system events:');
eventLogger.getRecentEvents(5).forEach(event => {
    console.log(`[${event.date.toISOString().slice(0, 10)}] ${event.action}: ${event.description}`);
});
console.log('\nAlice\'s complete event history:');
eventLogger.getEventsByClient(enhancedAlice.id).forEach(event => {
    console.log(`  - ${event.action}: ${event.description}`);
});
