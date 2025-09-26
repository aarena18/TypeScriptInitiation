export var ContractStatus;
(function (ContractStatus) {
    ContractStatus["ACTIVE"] = "actif";
    ContractStatus["TERMINATED"] = "r\u00E9sili\u00E9";
})(ContractStatus || (ContractStatus = {}));
export var ClientType;
(function (ClientType) {
    ClientType["STANDARD"] = "standard";
    ClientType["VIP"] = "vip";
})(ClientType || (ClientType = {}));
export var AccidentType;
(function (AccidentType) {
    AccidentType["FIRE"] = "fire";
    AccidentType["THEFT"] = "theft";
    AccidentType["WATER_DAMAGE"] = "water_damage";
    AccidentType["ACCIDENT"] = "accident";
    AccidentType["VANDALISM"] = "vandalism";
})(AccidentType || (AccidentType = {}));
export var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
})(PaymentMethod || (PaymentMethod = {}));
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (PaymentStatus = {}));
export var OptionType;
(function (OptionType) {
    OptionType["TRIP_ASSISTANCE"] = "trip_assistance";
    OptionType["JURIDICAL_PROTECTION"] = "juridical_protection";
    OptionType["FAMILY_PROTECTION"] = "family_protection";
})(OptionType || (OptionType = {}));
export var EventAction;
(function (EventAction) {
    EventAction["CONTRACT_CREATED"] = "contract_created";
    EventAction["CONTRACT_TERMINATED"] = "contract_terminated";
    EventAction["ACCIDENT_REPORTED"] = "accident_reported";
    EventAction["PAYMENT_SUCCESSFUL"] = "payment_successful";
    EventAction["PAYMENT_FAILED"] = "payment_failed";
    EventAction["EXPERT_ASSIGNED"] = "expert_assigned";
    EventAction["OPTION_ADDED"] = "option_added";
})(EventAction || (EventAction = {}));
export var EntityType;
(function (EntityType) {
    EntityType["CLIENT"] = "client";
    EntityType["CONTRACT"] = "contract";
    EntityType["ACCIDENT"] = "accident";
    EntityType["PAYMENT"] = "payment";
    EntityType["EXPERT"] = "expert";
    EntityType["OPTION"] = "option";
})(EntityType || (EntityType = {}));
export var BeneficiaryRelation;
(function (BeneficiaryRelation) {
    BeneficiaryRelation["SPOUSE"] = "spouse";
    BeneficiaryRelation["CHILD"] = "child";
    BeneficiaryRelation["PARENT"] = "parent";
    BeneficiaryRelation["SIBLING"] = "sibling";
    BeneficiaryRelation["PARTNER_COMPANY"] = "partner_company";
    BeneficiaryRelation["OTHER"] = "other";
})(BeneficiaryRelation || (BeneficiaryRelation = {}));
export var LegalProcedureStatus;
(function (LegalProcedureStatus) {
    LegalProcedureStatus["OPEN"] = "open";
    LegalProcedureStatus["IN_PROGRESS"] = "in_progress";
    LegalProcedureStatus["SETTLED"] = "settled";
    LegalProcedureStatus["CANCELLED"] = "cancelled";
})(LegalProcedureStatus || (LegalProcedureStatus = {}));
export var LawyerSpecialty;
(function (LawyerSpecialty) {
    LawyerSpecialty["INSURANCE_LAW"] = "insurance_law";
    LawyerSpecialty["CIVIL_LAW"] = "civil_law";
    LawyerSpecialty["COMMERCIAL_LAW"] = "commercial_law";
    LawyerSpecialty["CRIMINAL_LAW"] = "criminal_law";
})(LawyerSpecialty || (LawyerSpecialty = {}));
