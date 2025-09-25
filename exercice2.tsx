// to see the console.logs, type :
// npx tsc exercice2.tsx --target es2020
// node exercice2.js

// --- Partie 1 ---
interface UserConfig {
  id: number;
  name: string;
  email: string;
  phone?: string;
  vip: boolean;
}

// --- Test creation user ---

const alice: UserConfig = {
  id: 101,
  name: "Alice",
  email: "alice@example.com",
  phone: "0601020304",
  vip: true,
};
// console.log(alice);

////
// --- Partie 2 ---

interface User {
  id: number;
  name: string;
}

interface Driver extends User {}

interface Taxi {
  id: number;
  client: User;
  driver: Driver;
  startLocation: String;
  endLocation: String;
  distanceKm: number;
  price: number;
}

// --- Tests interface taxi ---

const driverBob: Driver = {
  id: 201,
  name: "Bob",
};
console.log(driverBob);

const clientUser: User = {
  id: alice.id,
  name: alice.name,
};

const taxiTrip: Taxi = {
  id: 1001,
  client: clientUser,
  driver: driverBob,
  startLocation: "Paris",
  endLocation: "Versailles",
  distanceKm: 20,
  price: 35.5,
};
// console.log(taxiTrip);

////
// --- Partie 3 ---

enum PaymentMethod {
  CARD = "card",
}

enum PaymentStatus {
  PAID = "Paid",
  UNPAID = "UnPaid",
}

interface Card {
  number: string;
  expiration: Date;
}

interface Method {
  method: PaymentMethod;
}

interface Trip {
  id: number;
  taxi: Taxi;
  method: Method;
  status: PaymentStatus;
  card: Card;
}

// --- Tests partie 3 ---

const aliceCard: Card = {
  number: "**** **** 1234",
  expiration: new Date(2026, 12),
};
// console.log(aliceCard);

const cardPayment: Method = {
  method: PaymentMethod.CARD,
};
// console.log(cardPayment);

const completeTrip: Trip = {
  id: 2001,
  taxi: taxiTrip, //-> trouver comment recuper l'id de taxiTrip (ligne60)
  method: cardPayment,
  status: PaymentStatus.PAID,
  card: aliceCard,
};
// console.log(completeTrip);

////
// --- Partie 4 ---

enum Currency {
  EUR = "EUR",
  USD = "USD",
  GBP = "GBP",
}

interface InvoiceItem {
  label: string;
  amount: number;
}

interface Invoice {
  id: number;
  paymentId: number;
  issuedAt: string;
  items: InvoiceItem[];
  total: number;
  currency: Currency;
}

// --- Tests partie 4 ---

const invoiceItems: InvoiceItem[] = [
  { label: "Base Fare", amount: 5.0 },
  { label: "Distance (20 km)", amount: 25.0 },
  { label: "Service Fee", amount: 5.5 },
];
// console.log(invoiceItems);

const tripInvoice: Invoice = {
  id: 7001,
  paymentId: 5001,
  issuedAt: "2025-09-25T08:25:00Z",
  items: invoiceItems,
  total: 35.5,
  currency: Currency.EUR,
};
// console.log(tripInvoice);

////
// --- Partie 5 ---

enum LoyaltyTier {
  GOLD = "gold",
}

enum BenefitType {
  DISCOUNT = "discount",
  PRIORITY_SUPPORT = "prioritySupport",
}

interface Benefit {
  type: BenefitType;
  value?: number;
}

interface LoyaltyProgram {
  clientId: number;
  tier: LoyaltyTier;
  points: number;
  benefits: Benefit[];
  validUntil: string;
}

// --- Tests partie 5 ---

const loyaltyBenefits: Benefit[] = [
  { type: BenefitType.DISCOUNT, value: 10 },
  { type: BenefitType.PRIORITY_SUPPORT },
];
// console.log(loyaltyBenefits);

const aliceLoyalty: LoyaltyProgram = {
  clientId: 101,
  tier: LoyaltyTier.GOLD,
  points: 1200,
  benefits: loyaltyBenefits,
  validUntil: "2026-01-01",
};
// console.log(aliceLoyalty);

////
// --- Partie 6 ---

interface Passenger {
  id: string;
  name: string;
  pickup: string;
}

interface Stop {
  location: string;
  eta: string;
}

interface Route {
  stops: Stop[];
}

interface SharedRide {
  id: number;
  driver: Driver;
  passengers: Passenger[];
  route: Route;
  farePerPassenger: number;
}

// --- Tests partie 6 ---

const routeStops: Stop[] = [
  { location: "Paris", eta: "2025-09-24T08:00:00Z" },
  { location: "La Défense", eta: "2025-09-24T08:20:00Z" },
  { location: "Versailles", eta: "2025-09-24T09:00:00Z" },
];
// console.log(routeStops);

const sharedRideRoute: Route = {
  stops: routeStops,
};

const passengers: Passenger[] = [
  { id: "101", name: "Alice", pickup: "Paris" },
  { id: "102", name: "Charlie", pickup: "La Défense" },
];
// console.log(passengers);

const sharedRide: SharedRide = {
  id: 1002,
  driver: driverBob,
  passengers: passengers,
  route: sharedRideRoute, //-> à changer pour ne plus avoir [object] mais les stops (ligne 233)
  farePerPassenger: 18.0,
};
// console.log(sharedRide);

////
// --- Partie 7 ---

enum TicketCategory {
  PAYMENT = "payment",
}

enum TicketStatus {
  OPEN = "open",
}

enum MessageSender {
  CLIENT = "client",
  SUPPORT = "support",
}

interface Agent {
  id: number;
  name: string;
}

interface Message {
  from: MessageSender;
  text: string;
  sentAt: string;
  agent?: Agent;
}

interface SupportTicket {
  id: number;
  clientId: number;
  category: TicketCategory;
  messages: Message[];
  status: TicketStatus;
}

// --- Tests partie 7 ---

const supportAgent: Agent = {
  id: 301,
  name: "Sophie",
};
// console.log(supportAgent);

const ticketMessages: Message[] = [
  {
    from: MessageSender.CLIENT,
    text: "My payment didn't go through yesterday",
    sentAt: "2025-09-24T09:00:00Z",
  },
  {
    from: MessageSender.SUPPORT,
    text: "We are checking the issue",
    sentAt: "2025-09-24T09:05:00Z",
    agent: supportAgent,
  },
];
// console.log(ticketMessages);

const supportTicket: SupportTicket = {
  id: 9001,
  clientId: 101,
  category: TicketCategory.PAYMENT,
  messages: ticketMessages,
  status: TicketStatus.OPEN,
};
// console.log(supportTicket);

////
// --- Partie 8 ---

enum TransactionType {
  TOPUP = "topup",
  PAYMENT = "payment",
}

interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
}

interface Wallet {
  balance: number;
  currency: Currency;
  transactions: Transaction[];
}

interface ClientWallet {
  clientId: number;
  wallet: Wallet;
}

// --- Tests partie 8 ---

const walletTransactions: Transaction[] = [
  {
    id: 6001,
    type: TransactionType.TOPUP,
    amount: 20.0,
    date: "2025-09-20",
  },
  {
    id: 6002,
    type: TransactionType.PAYMENT,
    amount: -15.0,
    date: "2025-09-21",
  },
];
// console.log(walletTransactions);

const aliceWallet: Wallet = {
  balance: 50.0,
  currency: Currency.EUR,
  transactions: walletTransactions, //-> trouver comment recuper inside transactions (ligne357)
};
// console.log(aliceWallet);

const clientWallet: ClientWallet = {
  clientId: 101,
  wallet: aliceWallet,
};
// console.log(clientWallet);

////
// --- Partie 9 ---

enum ActivityType {
  RIDE = "ride",
  PAYMENT = "payment",
  SUPPORT = "support",
  WALLET = "wallet"
}

interface BaseActivity {
  type: ActivityType;
  date: string;
}

interface RideActivity extends BaseActivity {
  type: ActivityType.RIDE;
  courseId: number;
}

interface PaymentActivity extends BaseActivity {
  type: ActivityType.PAYMENT;
  paymentId: number;
  amount: number;
}

interface SupportActivity extends BaseActivity {
  type: ActivityType.SUPPORT;
  ticketId: number;
  resolved: boolean;
}

interface WalletActivity extends BaseActivity {
  type: ActivityType.WALLET;
  transactionId: number;
  amount: number;
}

type Activity = RideActivity | PaymentActivity | SupportActivity | WalletActivity;

interface ClientHistory {
  clientId: number;
  history: Activity[];
}

// --- Tests partie 9 ---

const clientActivities: Activity[] = [
  {
    type: ActivityType.RIDE,
    courseId: 1001,
    date: "2025-09-20"
  },
  {
    type: ActivityType.PAYMENT,
    paymentId: 5001,
    amount: 35.5,
    date: "2025-09-20"
  },
  {
    type: ActivityType.SUPPORT,
    ticketId: 9001,
    resolved: false,
    date: "2025-09-21"
  }
];
// console.log(clientActivities);

const aliceHistory: ClientHistory = {
  clientId: 101,
  history: clientActivities
};
// console.log(aliceHistory);
