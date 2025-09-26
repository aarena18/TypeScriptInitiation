export enum ContractStatus {
  ACTIVE = "actif",
  TERMINATED = "résilié",
}

export enum ClientType {
  STANDARD = "standard",
  VIP = "vip",
}

export enum AccidentType {
  FIRE = "fire",
  THEFT = "theft",
  WATER_DAMAGE = "water_damage",
  ACCIDENT = "accident",
  VANDALISM = "vandalism",
}

export type ExpertSpecialty = AccidentType;

export enum PaymentMethod {
  CARD = "card",
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum OptionType {
  TRIP_ASSISTANCE = "trip_assistance",
  JURIDICAL_PROTECTION = "juridical_protection",
  FAMILY_PROTECTION = "family_protection",
}

export enum EventAction {
  CONTRACT_CREATED = "contract_created",
  CONTRACT_TERMINATED = "contract_terminated",
  ACCIDENT_REPORTED = "accident_reported",
  PAYMENT_SUCCESSFUL = "payment_successful",
  PAYMENT_FAILED = "payment_failed",
  EXPERT_ASSIGNED = "expert_assigned",
  OPTION_ADDED = "option_added",
}

export enum EntityType {
  CLIENT = "client",
  CONTRACT = "contract",
  ACCIDENT = "accident",
  PAYMENT = "payment",
  EXPERT = "expert",
  OPTION = "option",
}

export enum BeneficiaryRelation {
  SPOUSE = "spouse",
  CHILD = "child",
  PARENT = "parent",
  SIBLING = "sibling",
  PARTNER_COMPANY = "partner_company",
  OTHER = "other",
}

export enum LegalProcedureStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  SETTLED = "settled",
  CANCELLED = "cancelled",
}

export enum LawyerSpecialty {
  INSURANCE_LAW = "insurance_law",
  CIVIL_LAW = "civil_law",
  COMMERCIAL_LAW = "commercial_law",
  CRIMINAL_LAW = "criminal_law",
}

// Enums pour la Partie 5 - Remboursements et Audits
export enum ReimbursementMethod {
  BANK_TRANSFER = "bank_transfer",
  CASH = "cash",
  CARD = "card",
}

export enum ReimbursementStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  FAILED = "failed",
}

export enum AnomalyStatus {
  DETECTED = "detected",
  INVESTIGATING = "investigating",
  RESOLVED = "resolved",
}

export enum AnomalyType {
  CONTRACT = "contract",
  PAYMENT = "payment",
  ACCIDENT = "accident",
  REIMBURSEMENT = "reimbursement",
}

export enum AnomalySeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Enums pour la Partie 6 - Réassurance
export enum ReinsuranceStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  SUSPENDED = "suspended",
}
