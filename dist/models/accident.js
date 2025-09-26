export class Accident {
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
export class Expert {
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
