import { Ticket } from '../models/ticketModel';

const tickets: Ticket[] = [];

/**
 * Retrieves all tickets from storage
 * @returns Array of all tickets
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
  return [...tickets];
};

