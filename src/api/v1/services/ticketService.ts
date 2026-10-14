import { Ticket } from '../models/ticketModel';

const tickets: Ticket[] = [];

/**
 * Retrieves all tickets from storage
 * @returns Array of all tickets
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
  return [...tickets];
};

/**
 * Creates a new ticket
 * @param ticketData - The data for the new ticket (title, description, etc.)
 * @returns The created ticket with generated ID
 */
export const createTicket = async (
  ticketData: Partial<Ticket> & Pick<Ticket, 'title' | 'description'>
): Promise<Ticket> => {
  const newTicket: Ticket = {
    ...ticketData,
    id: tickets.length + 1, // Simple ID generation based on array length
    title: ticketData.title,
    description: ticketData.description,
    status: ticketData.status ?? 'open',
    createdAt: ticketData.createdAt ?? new Date().toISOString(),
} as Ticket;

  tickets.push(newTicket);
  return newTicket;
};

