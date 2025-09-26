export class Lawyer {
    constructor(id, name, specialty, barNumber // Numéro au barreau
    ) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
        this.barNumber = barNumber;
        this.assignedProcedures = [];
    }
    canHandle(procedureType) {
        return this.specialty === procedureType;
    }
    assignProcedure(procedureId) {
        if (!this.assignedProcedures.includes(procedureId)) {
            this.assignedProcedures.push(procedureId);
        }
    }
    getAssignedProcedures() {
        return [...this.assignedProcedures];
    }
    getWorkload() {
        return this.assignedProcedures.length;
    }
    removeProcedure(procedureId) {
        const index = this.assignedProcedures.indexOf(procedureId);
        if (index !== -1) {
            this.assignedProcedures.splice(index, 1);
            return true;
        }
        return false;
    }
}
