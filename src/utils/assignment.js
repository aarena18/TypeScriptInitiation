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
