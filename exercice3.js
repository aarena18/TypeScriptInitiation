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
