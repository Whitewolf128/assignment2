/**
 * Represents a support ticket in the system.
 */

export interface Ticket {
    id: number; // Unique identifier for the ticket
    title: string; // Title of the ticket
    description: string; // Detailed description of the issue
    priority: string;
    baseScore: number; // Base score of the ticket
    status: string; // Status of the ticket
    createdAt: Date; // Timestamp when the ticket was created
}
