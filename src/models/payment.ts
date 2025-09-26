import { PaymentMethod, PaymentStatus } from '../types/index.js';

export class Payment {
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor(
    public id: number,
    public contractId: number,
    public amount: number,
    public method: PaymentMethod,
    public date: Date,
    public status: PaymentStatus = PaymentStatus.PENDING
  ) {}

  canRetry(): boolean {
    return (
      this.status === PaymentStatus.FAILED && this.retryCount < this.maxRetries
    );
  }

  retry(): boolean {
    if (this.canRetry()) {
      this.retryCount++;
      this.status = PaymentStatus.PENDING;
      return true;
    }
    return false;
  }

  complete(): void {
    this.status = PaymentStatus.COMPLETED;
  }

  fail(): void {
    this.status = PaymentStatus.FAILED;
  }

  getRetryCount(): number {
    return this.retryCount;
  }

  isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }
}