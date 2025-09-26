import {
  ContractStatus,
  ClientType,
  AccidentType,
  PaymentMethod,
  OptionType,
  EventAction,
  EntityType,
} from "../types/index.js";
import { ContactInfo, Contract } from "../models/contract.js";
import { Client } from "../models/client.js";
import { Accident, Expert } from "../models/accident.js";
import { Payment } from "../models/payment.js";
import {
  ContractOption,
  FullContract,
  EnhancedClient,
  EventLogger,
} from "../models/extended.js";
import { assignExpertToAccident } from "../utils/assignment.js";

// ---- Tests Partie 3 ----

export function runPartie3Tests(): void {
  const eventLogger = new EventLogger();

  const aliceContact = new ContactInfo("alice@example.com", "0601020304");
  const bobContact = new ContactInfo("bob@example.com");
  const alice = new Client(101, aliceContact, ClientType.VIP);
  const bob = new Client(102, bobContact, ClientType.STANDARD);
  const aliceContract1 = new Contract(1001, 500, ContractStatus.ACTIVE);
  const bobContract = new Contract(1003, 300, ContractStatus.ACTIVE);

  alice.addContract(aliceContract1);
  bob.addContract(bobContract);

  const tripAssistance = new ContractOption(
    1,
    OptionType.TRIP_ASSISTANCE,
    "Trip Assistance",
    "24h/24 Assistance in case of accident while traveling",
    25
  );

  const juridicalProtection = new ContractOption(
    2,
    OptionType.JURIDICAL_PROTECTION,
    "Legal protection",
    "Legal Assistance taken care of",
    15
  );

  const familyProtection = new ContractOption(
    3,
    OptionType.FAMILY_PROTECTION,
    "Family Protection",
    "Protection Extension for the family",
    35
  );

  console.log(`- ${tripAssistance.name}: €${tripAssistance.monthlyCost}/month`);
  console.log(
    `- ${juridicalProtection.name}: €${juridicalProtection.monthlyCost}/month`
  );
  console.log(
    `- ${familyProtection.name}: €${familyProtection.monthlyCost}/month`
  );

  const enhancedAlice = new EnhancedClient(alice.id, alice.contact, alice.type);
  const enhancedBob = new EnhancedClient(bob.id, bob.contact, bob.type);

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

  const fireExpert = new Expert(1, "Jean Dupont", AccidentType.FIRE);
  const expertsList = [fireExpert];

  const aliceFireAccident = new Accident(
    3001,
    aliceContract1.id,
    new Date("2025-09-25"),
    AccidentType.FIRE,
    "Kitchen fire at Alice's home - burnt pancackes"
  );

  const assignedFireExpert = assignExpertToAccident(
    aliceFireAccident,
    expertsList
  );

  const alicePayment1 = new Payment(
    4001,
    aliceContract1.id,
    aliceFullContract.calculateFinalPrice(),
    PaymentMethod.CARD,
    new Date("2025-09-01")
  );

  const alicePayment2 = new Payment(
    4002,
    aliceContract1.id,
    aliceFullContract.calculateFinalPrice(),
    PaymentMethod.BANK_TRANSFER,
    new Date("2025-10-01")
  );

  alicePayment1.complete();
  alicePayment2.fail();

  aliceFullContract.addAccident(aliceFireAccident);
  aliceFullContract.addPayment(alicePayment1);
  aliceFullContract.addPayment(alicePayment2);

  enhancedAlice.addFullContract(aliceFullContract);
  enhancedBob.addFullContract(bobFullContract);

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
  console.log(
    "Bob base premium:",
    bobFullContract.calculateFinalPrice(),
    "EUR"
  );
  console.log(
    "Bob total with options:",
    bobFullContract.calculateFinalPriceWithOptions(),
    "EUR"
  );

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
  console.log(
    "Bob ongoing accidents:",
    enhancedBob.getOngoingAccidents().length
  );
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

  eventLogger.logEvent(
    EventAction.ACCIDENT_REPORTED,
    EntityType.ACCIDENT,
    aliceFireAccident.id,
    `Fire accident reported by Alice: ${aliceFireAccident.description}`,
    enhancedAlice.id
  );

  if (assignedFireExpert) {
    eventLogger.logEvent(
      EventAction.EXPERT_ASSIGNED,
      EntityType.EXPERT,
      assignedFireExpert.id,
      `Expert ${assignedFireExpert.name} assigned to Alice's fire accident`,
      enhancedAlice.id
    );
  }

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

  eventLogger.getRecentEvents(5).forEach((event) => {
    console.log(
      `[${event.date.toISOString().slice(0, 10)}] ${event.action}: ${
        event.description
      }`
    );
  });

  eventLogger.getEventsByClient(enhancedAlice.id).forEach((event) => {
    console.log(`  - ${event.action}: ${event.description}`);
  });
}
