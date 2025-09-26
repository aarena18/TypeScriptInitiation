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

//console.log(alice.isVip());
//console.log(bob.isVip());
//console.log(alice.getActiveContracts().length);

alice.getActiveContracts().forEach((contract) => {
  //console.log(
    `Contract ${contract.id}: BasePrice=${contract.basePrice}, Reduction=${
      contract.reduction
    }, Bonus=${contract.bonus}, Final=${contract.calculateFinalPrice()}`
  );
});
//console.log(alice.getActiveContracts());

////
// ---- Partie 2 ----

enum AccidentType {
  FIRE = "fire",
  THEFT = "theft",
  WATER_DAMAGE = "water_damage",
  ACCIDENT = "accident",
  VANDALISM = "vandalism"
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
  BANK_TRANSFER = "bank_transfer"
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
    return this.status === PaymentStatus.FAILED && this.retryCount < this.maxRetries;
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
    return this.accidents.filter(accident => !accident.isAssigned());
  }

  addPayment(payment: Payment): void {
    this.payments.push(payment);
  }

  getPayments(): Payment[] {
    return [...this.payments];
  }

  getCompletedPayments(): Payment[] {
    return this.payments.filter(payment => payment.isCompleted());
  }

  getFailedPayments(): Payment[] {
    return this.payments.filter(payment => payment.status === PaymentStatus.FAILED);
  }

  getPendingPayments(): Payment[] {
    return this.payments.filter(payment => payment.status === PaymentStatus.PENDING);
  }

  getTotalPaidAmount(): number {
    return this.getCompletedPayments()
      .reduce((total, payment) => total + payment.amount, 0);
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
  new Date('2025-09-25'), 
  AccidentType.FIRE, 
  'Kitchen fire at Alice\'s home - burnt pancackes'
);

const aliceTheftAccident = new Accident(
  3002, 
  aliceContract1.id, 
  new Date('2025-09-26'), 
  AccidentType.THEFT, 
  'Alice\'s laptop stolen from car'
);

const bobWaterAccident = new Accident(
  3003, 
  bobContract.id, 
  new Date('2025-09-26'), 
  AccidentType.WATER_DAMAGE,
  'Bob\'s apartment - pipe burst in bathroom'
);

function assignExpertToAccident(accident: Accident, experts: Expert[]): Expert | null {
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
//console.log(assignedFireExpert?.name, aliceFireAccident.assignedExpertId);
//console.log(fireExpert.name, fireExpert.getWorkload());

const assignedTheftExpert = assignExpertToAccident(aliceTheftAccident, expertsList);
//console.log(assignedTheftExpert?.name, aliceTheftAccident.assignedExpertId);
//console.log(theftExpert.name, theftExpert.getWorkload());

const assignedWaterExpert = assignExpertToAccident(bobWaterAccident, expertsList);
//console.log(assignedWaterExpert?.name, bobWaterAccident.assignedExpertId);
//console.log(waterExpert.name, waterExpert.getWorkload());

aliceUpdatedContract.addAccident(aliceFireAccident);

aliceUpdatedContract.addAccident(aliceTheftAccident);
bobUpdatedContract.addAccident(bobWaterAccident);

const alicePayment1 = new Payment(
  4001, 
  aliceContract1.id, 
  aliceUpdatedContract.calculateFinalPrice(), 
  PaymentMethod.CARD, 
  new Date('2025-09-01')
);
//console.log(alicePayment1);

const alicePayment2 = new Payment(
  4002, 
  aliceContract1.id, 
  aliceUpdatedContract.calculateFinalPrice(), 
  PaymentMethod.BANK_TRANSFER, 
  new Date('2025-10-01')
);
//console.log(alicePayment2.canRetry());
if (alicePayment2.canRetry()) {
  alicePayment2.retry();
  //console.log(alicePayment2.id, alicePayment2.status);
  //console.log(alicePayment2.getRetryCount());
}

const bobPayment1 = new Payment(
  4003, 
  bobContract.id, 
  bobUpdatedContract.calculateFinalPrice(), 
  PaymentMethod.CASH, 
  new Date('2025-09-15')
);
//console.log(bobPayment1);

alicePayment1.complete(); 
alicePayment2.fail(); 
bobPayment1.complete(); 

aliceUpdatedContract.addPayment(alicePayment1);
aliceUpdatedContract.addPayment(alicePayment2);
bobUpdatedContract.addPayment(bobPayment1);
