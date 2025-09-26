import { Accident, Expert } from '../models/accident.js';

export function assignExpertToAccident(
  accident: Accident,
  experts: Expert[]
): Expert | null {
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