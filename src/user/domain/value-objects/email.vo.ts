export class Email {
  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  private readonly value: string;
  constructor(email: string) {
    if (!this.isValid(email)) throw new Error('No email provided');
    this.value = email;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
