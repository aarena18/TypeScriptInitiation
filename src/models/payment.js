import { PaymentStatus } from '../types/index.js';
export class Payment {
    constructor(id, contractId, amount, method, date, status = PaymentStatus.PENDING) {
        this.id = id;
        this.contractId = contractId;
        this.amount = amount;
        this.method = method;
        this.date = date;
        this.status = status;
        this.retryCount = 0;
        this.maxRetries = 3;
    }
    canRetry() {
        return (this.status === PaymentStatus.FAILED && this.retryCount < this.maxRetries);
    }
    retry() {
        if (this.canRetry()) {
            this.retryCount++;
            this.status = PaymentStatus.PENDING;
            return true;
        }
        return false;
    }
    complete() {
        this.status = PaymentStatus.COMPLETED;
    }
    fail() {
        this.status = PaymentStatus.FAILED;
    }
    getRetryCount() {
        return this.retryCount;
    }
    isCompleted() {
        return this.status === PaymentStatus.COMPLETED;
    }
}
