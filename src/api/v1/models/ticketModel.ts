/**
 * Represents a support ticket in the system.
 */

export interface Ticket {
    id: number; // Unique identifier for the ticket
    title: string; // Title of the ticket
    description: string; // Detailed description of the issue
    priority: string;
    status: string; // Status of the ticket
    createdAt: Date; // Timestamp when the ticket was created
    ticketAge: number; // Age of the ticket in days
    urgencyScore: number; // Calculated urgency score based on priority and age
    urgencyLevel: string; // Urgency level derived from the urgency score
}
