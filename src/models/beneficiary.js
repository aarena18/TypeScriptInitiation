export class Beneficiary {
    constructor(id, name, relation, email, phone) {
        this.id = id;
        this.name = name;
        this.relation = relation;
        this.email = email;
        this.phone = phone;
    }
    getContactInfo() {
        const contact = [];
        if (this.email)
            contact.push(`Email: ${this.email}`);
        if (this.phone)
            contact.push(`Phone: ${this.phone}`);
        return contact.length > 0 ? contact.join(", ") : "No contact info";
    }
}
export class ContractBeneficiary {
    constructor(beneficiary, sharePercentage, // Part du contrat en pourcentage
    contractId) {
        this.beneficiary = beneficiary;
        this.sharePercentage = sharePercentage;
        this.contractId = contractId;
        if (sharePercentage <= 0 || sharePercentage > 100) {
            throw new Error("Share percentage must be between 0 and 100");
        }
    }
    getShareAmount(contractValue) {
        return (contractValue * this.sharePercentage) / 100;
    }
}
