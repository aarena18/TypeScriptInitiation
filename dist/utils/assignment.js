import { LegalProcedureStatus } from '../types/index.js';
export function assignExpertToAccident(accident, experts) {
    const availableExperts = experts
        .filter((expert) => expert.canHandle(accident.type))
        .sort((a, b) => a.getWorkload() - b.getWorkload());
    if (availableExperts.length > 0) {
        const assignedExpert = availableExperts[0];
        accident.assignedExpertId = assignedExpert.id;
        assignedExpert.assignAccident(accident.id);
        return assignedExpert;
    }
    return null;
}
export function assignLawyerToProcedure(procedure, lawyers, requiredSpecialty) {
    let availableLawyers = lawyers;
    if (requiredSpecialty) {
        availableLawyers = lawyers.filter(lawyer => lawyer.canHandle(requiredSpecialty));
    }
    availableLawyers.sort((a, b) => a.getWorkload() - b.getWorkload());
    if (availableLawyers.length > 0) {
        const assignedLawyer = availableLawyers[0];
        procedure.assignedLawyerId = assignedLawyer.id;
        assignedLawyer.assignProcedure(procedure.id);
        procedure.status = LegalProcedureStatus.IN_PROGRESS;
        return assignedLawyer;
    }
    return null;
}
