export class ItemId {
  static create(): string {
    return `item-${crypto.randomUUID()}`;
  }
}
