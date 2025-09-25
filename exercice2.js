// to see the console.logs, type :
// npx tsc exercice2.tsx --target es2020
// node exercice2.js
// --- Test creation user ---
const alice = {
    id: 101,
    name: "Alice",
    email: "alice@example.com",
    phone: "0601020304",
    vip: true
};
console.log(alice);
// --- Tests interface taxi ---
const driverBob = {
    id: 201,
    name: "Bob",
};
console.log(driverBob);
const clientUser = {
    id: alice.id,
    name: alice.name,
};
const taxiTrip = {
    id: 1001,
    client: clientUser,
    driver: driverBob,
    startLocation: "Paris",
    endLocation: "Versailles",
    distanceKm: 20,
    price: 35.5,
};
console.log(taxiTrip);
////
// --- Partie 3 ---
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
})(PaymentMethod || (PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PAID"] = "Paid";
    PaymentStatus["UNPAID"] = "UnPaid";
})(PaymentStatus || (PaymentStatus = {}));
// --- Tests partie 3 ---
const aliceCard = {
    number: "**** **** 1234",
    expiration: new Date(2026, 12),
};
console.log(aliceCard);
const cardPayment = {
    method: PaymentMethod.CARD,
};
console.log(cardPayment);
const completeTrip = {
    id: 2001,
    taxi: taxiTrip, //-> trouver comment recuper l'id de taxiTrip (ligne60)
    method: cardPayment,
    status: PaymentStatus.PAID,
    card: aliceCard,
};
console.log(completeTrip);
////
// --- Partie 4 ---
var Currency;
(function (Currency) {
    Currency["EUR"] = "EUR";
    Currency["USD"] = "USD";
    Currency["GBP"] = "GBP";
})(Currency || (Currency = {}));
// --- Tests partie 4 ---
const invoiceItems = [
    { label: "Base Fare", amount: 5.0 },
    { label: "Distance (20 km)", amount: 25.0 },
    { label: "Service Fee", amount: 5.5 }
];
console.log(invoiceItems);
const tripInvoice = {
    id: 7001,
    paymentId: 5001,
    issuedAt: "2025-09-25T08:25:00Z",
    items: invoiceItems,
    total: 35.5,
    currency: Currency.EUR
};
console.log(tripInvoice);
////
// --- Partie 5 ---
var LoyaltyTier;
(function (LoyaltyTier) {
    LoyaltyTier["GOLD"] = "gold";
})(LoyaltyTier || (LoyaltyTier = {}));
var BenefitType;
(function (BenefitType) {
    BenefitType["DISCOUNT"] = "discount";
    BenefitType["PRIORITY_SUPPORT"] = "prioritySupport";
})(BenefitType || (BenefitType = {}));
// --- Tests partie 5 ---
const loyaltyBenefits = [
    { type: BenefitType.DISCOUNT, value: 10 },
    { type: BenefitType.PRIORITY_SUPPORT }
];
console.log(loyaltyBenefits);
const aliceLoyalty = {
    clientId: 101,
    tier: LoyaltyTier.GOLD,
    points: 1200,
    benefits: loyaltyBenefits,
    validUntil: "2026-01-01"
};
console.log(aliceLoyalty);
// --- Tests partie 6 ---
const routeStops = [
    { location: "Paris", eta: "2025-09-24T08:00:00Z" },
    { location: "La Défense", eta: "2025-09-24T08:20:00Z" },
    { location: "Versailles", eta: "2025-09-24T09:00:00Z" }
];
console.log(routeStops);
const sharedRideRoute = {
    stops: routeStops
};
const passengers = [
    { id: "101", name: "Alice", pickup: "Paris" },
    { id: "102", name: "Charlie", pickup: "La Défense" }
];
console.log(passengers);
const sharedRide = {
    id: 1002,
    driver: driverBob, // Reuse driver from part 2
    passengers: passengers,
    route: sharedRideRoute,
    farePerPassenger: 18.0
};
console.log(sharedRide);
console.log("Route stops:", sharedRide.route.stops);
