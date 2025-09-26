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

// Enums pour les paiements
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