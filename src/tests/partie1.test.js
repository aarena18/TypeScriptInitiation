import { ContractStatus, ClientType } from '../types/index.js';
import { ContactInfo, Contract } from '../models/contract.js';
import { Client } from '../models/client.js';
// ---- Test Partie 1 ----
export function runPartie1Tests() {
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
    console.log('Alice is VIP:', alice.isVip());
    console.log('Bob is VIP:', bob.isVip());
    console.log('Alice active contracts:', alice.getActiveContracts().length);
    alice.getActiveContracts().forEach((contract) => {
        console.log(`Contract ${contract.id}: BasePrice=€${contract.basePrice}, Reduction=€${contract.reduction}, Bonus=€${contract.bonus}, Final=€${contract.calculateFinalPrice()}`);
    });
    console.log("Alice active contracts details:", alice.getActiveContracts());
}
