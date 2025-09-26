// to see the console.logs, type:
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
console.log(alice.isVip());
console.log(bob.isVip());
console.log(alice.getActiveContracts().length);
alice.getActiveContracts().forEach((contract) => {
    console.log(`Contract ${contract.id}: BasePrice=${contract.basePrice}, Reduction=${contract.reduction}, Bonus=${contract.bonus}, Final=${contract.calculateFinalPrice()}`);
});
console.log(alice.getActiveContracts());
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
console.log(aliceUpdatedContract.basePrice);
const bobUpdatedContract = new UpdatedContract(bobContract.id, bobContract.basePrice, bobContract.status);
console.log(bobUpdatedContract.basePrice);
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
console.log(assignedFireExpert?.name, aliceFireAccident.assignedExpertId);
console.log(fireExpert.name, fireExpert.getWorkload());
const assignedTheftExpert = assignExpertToAccident(aliceTheftAccident, expertsList);
console.log(assignedTheftExpert?.name, aliceTheftAccident.assignedExpertId);
console.log(theftExpert.name, theftExpert.getWorkload());
const assignedWaterExpert = assignExpertToAccident(bobWaterAccident, expertsList);
console.log(assignedWaterExpert?.name, bobWaterAccident.assignedExpertId);
console.log(waterExpert.name, waterExpert.getWorkload());
aliceUpdatedContract.addAccident(aliceFireAccident);
aliceUpdatedContract.addAccident(aliceTheftAccident);
bobUpdatedContract.addAccident(bobWaterAccident);
const alicePayment1 = new Payment(4001, aliceContract1.id, aliceUpdatedContract.calculateFinalPrice(), PaymentMethod.CARD, new Date('2025-09-01'));
console.log(alicePayment1);
const alicePayment2 = new Payment(4002, aliceContract1.id, aliceUpdatedContract.calculateFinalPrice(), PaymentMethod.BANK_TRANSFER, new Date('2025-10-01'));
console.log(alicePayment2.canRetry());
if (alicePayment2.canRetry()) {
    alicePayment2.retry();
    console.log(alicePayment2.id, alicePayment2.status);
    console.log(alicePayment2.getRetryCount());
}
const bobPayment1 = new Payment(4003, bobContract.id, bobUpdatedContract.calculateFinalPrice(), PaymentMethod.CASH, new Date('2025-09-15'));
console.log(bobPayment1);
alicePayment1.complete();
alicePayment2.fail();
bobPayment1.complete();
aliceUpdatedContract.addPayment(alicePayment1);
aliceUpdatedContract.addPayment(alicePayment2);
bobUpdatedContract.addPayment(bobPayment1);
