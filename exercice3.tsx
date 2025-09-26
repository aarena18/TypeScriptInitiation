// to see the console.logs, type:
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

console.log(alice.isVip());
console.log(bob.isVip());
console.log(alice.getActiveContracts().length);

alice.getActiveContracts().forEach((contract) => {
  console.log(
    `Contract ${contract.id}: BasePrice=${contract.basePrice}, Reduction=${
      contract.reduction
    }, Bonus=${contract.bonus}, Final=${contract.calculateFinalPrice()}`
  );
});
console.log(alice.getActiveContracts());
