import { ContractStatus, ClientType, AccidentType, PaymentMethod, OptionType, EventAction, EntityType } from '../types/index.js';
import { ContactInfo, Contract } from '../models/contract.js';
import { Client } from '../models/client.js';
import { Accident, Expert } from '../models/accident.js';
import { Payment } from '../models/payment.js';
import { ContractOption, FullContract, EnhancedClient, EventLogger } from '../models/extended.js';
import { assignExpertToAccident } from '../utils/assignment.js';
// ---- Tests Partie 3 ----
export function runPartie3Tests() {
    console.log('\n=== TESTS PARTIE 3: Options et Événements ===');
    const eventLogger = new EventLogger();
    const aliceContact = new ContactInfo("alice@example.com", "0601020304");
    const bobContact = new ContactInfo("bob@example.com");
    const alice = new Client(101, aliceContact, ClientType.VIP);
    const bob = new Client(102, bobContact, ClientType.STANDARD);
    const aliceContract1 = new Contract(1001, 500, ContractStatus.ACTIVE);
    const bobContract = new Contract(1003, 300, ContractStatus.ACTIVE);
    alice.addContract(aliceContract1);
    bob.addContract(bobContract);
    // Create available options
    const tripAssistance = new ContractOption(1, OptionType.TRIP_ASSISTANCE, "Assistance Voyage", "Assistance 24h/24 en cas de panne ou d'accident en voyage", 25);
    const juridicalProtection = new ContractOption(2, OptionType.JURIDICAL_PROTECTION, "Protection Juridique", "Assistance juridique et prise en charge des frais de procédure", 15);
    const familyProtection = new ContractOption(3, OptionType.FAMILY_PROTECTION, "Protection Famille", "Extension de couverture pour tous les membres de la famille", 35);
    console.log("\\n=== Available Contract Options ===");
    console.log(`- ${tripAssistance.name}: €${tripAssistance.monthlyCost}/month`);
    console.log(`- ${juridicalProtection.name}: €${juridicalProtection.monthlyCost}/month`);
    console.log(`- ${familyProtection.name}: €${familyProtection.monthlyCost}/month`);
    // Convert to enhanced clients and full contracts
    const enhancedAlice = new EnhancedClient(alice.id, alice.contact, alice.type);
    const enhancedBob = new EnhancedClient(bob.id, bob.contact, bob.type);
    // Create full contracts from existing data
    const aliceFullContract = new FullContract(aliceContract1.id, aliceContract1.basePrice, aliceContract1.status, aliceContract1.reduction, aliceContract1.bonus);
    const bobFullContract = new FullContract(bobContract.id, bobContract.basePrice, bobContract.status);
    // Create accidents and payments (réutiliser la logique des parties précédentes)
    const fireExpert = new Expert(1, "Jean Dupont", AccidentType.FIRE);
    const expertsList = [fireExpert];
    const aliceFireAccident = new Accident(3001, aliceContract1.id, new Date("2025-09-25"), AccidentType.FIRE, "Kitchen fire at Alice's home - burnt pancackes");
    const assignedFireExpert = assignExpertToAccident(aliceFireAccident, expertsList);
    const alicePayment1 = new Payment(4001, aliceContract1.id, aliceFullContract.calculateFinalPrice(), PaymentMethod.CARD, new Date("2025-09-01"));
    const alicePayment2 = new Payment(4002, aliceContract1.id, aliceFullContract.calculateFinalPrice(), PaymentMethod.BANK_TRANSFER, new Date("2025-10-01"));
    alicePayment1.complete();
    alicePayment2.fail();
    // Add existing accidents and payments
    aliceFullContract.addAccident(aliceFireAccident);
    aliceFullContract.addPayment(alicePayment1);
    aliceFullContract.addPayment(alicePayment2);
    // Add contracts to enhanced clients
    enhancedAlice.addFullContract(aliceFullContract);
    enhancedBob.addFullContract(bobFullContract);
    console.log("\\n=== Final Contract Pricing ===");
    console.log("Alice base premium:", aliceFullContract.calculateFinalPrice(), "EUR");
    console.log("Alice total with options:", aliceFullContract.calculateFinalPriceWithOptions(), "EUR");
    console.log("Bob base premium:", bobFullContract.calculateFinalPrice(), "EUR");
    console.log("Bob total with options:", bobFullContract.calculateFinalPriceWithOptions(), "EUR");
    console.log("\\n=== Quick Listing System ===");
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
    if (assignedFireExpert) {
        eventLogger.logEvent(EventAction.EXPERT_ASSIGNED, EntityType.EXPERT, assignedFireExpert.id, `Expert ${assignedFireExpert.name} assigned to Alice's fire accident`, enhancedAlice.id);
    }
    // Log payments
    eventLogger.logEvent(EventAction.PAYMENT_SUCCESSFUL, EntityType.PAYMENT, alicePayment1.id, `Alice's payment of €${alicePayment1.amount} completed successfully`, enhancedAlice.id);
    eventLogger.logEvent(EventAction.PAYMENT_FAILED, EntityType.PAYMENT, alicePayment2.id, `Alice's payment of €${alicePayment2.amount} failed`, enhancedAlice.id);
    console.log("\\n=== Event Logging System ===");
    console.log("Recent system events:");
    eventLogger.getRecentEvents(5).forEach((event) => {
        console.log(`[${event.date.toISOString().slice(0, 10)}] ${event.action}: ${event.description}`);
    });
    console.log("\\nAlice's complete event history:");
    eventLogger.getEventsByClient(enhancedAlice.id).forEach((event) => {
        console.log(`  - ${event.action}: ${event.description}`);
    });
}
