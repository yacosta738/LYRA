export interface Subscriber {
  readonly id: string,
  readonly email: string,
  readonly firstname: string,
  readonly lastname: string,
  readonly status: SubscriberStatus,
  readonly attributes: Record<string, string>,
  readonly organizationId: string,
  readonly createdAt: Date,
  readonly updatedAt: Date
}

/**
 * Subscriber status ['ENABLED', 'DISABLED', 'BLOCKLISTED']
 * @enum {string}
 */
export enum SubscriberStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
  BLOCKLISTED = "BLOCKLISTED"
}
