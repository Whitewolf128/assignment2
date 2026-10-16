import { Ticket } from '../models/ticketModel';

const tickets: Ticket[] = [];
const PRIORITY_SCORES: Record<string, number> = {
  low: 10,
  medium: 20,
  high: 30,
  critical: 50,
};
const STATUS_LEVELS: Record<string, number> = {
  open: 1,
  'in-progress': 1,
  resolved: 0,
};

const TICKET_AGE_MULTIPLIER = 5;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Retrieves all tickets from storage
 * @returns Array of all tickets
 */
type OmitAge = Omit<Ticket, 'ticketAge' | 'urgencyScore' | 'urgencyLevel'>;
export const getAllTickets = async (): Promise<OmitAge[]> => {
  return tickets.map(({ ticketAge, urgencyScore, urgencyLevel, ...ticket }) => ticket);
};

export const getTicketById = async (id: number): Promise<Ticket[]> => {
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) {
    return [];
  }

  const priorityScore = PRIORITY_SCORES[ticket.priority];
  if (priorityScore === undefined) {
    throw new Error(`Invalid ticket priority: ${ticket.priority}`);
  }

  const statusLevel = STATUS_LEVELS[ticket.status];
  if (statusLevel === undefined) {
    throw new Error(`Invalid ticket status: ${ticket.status}`);
  }

  const ticketAge = ticket.ticketAge ?? (() => {
    const createdAtTimestamp = Date.parse(String(ticket.createdAt));
    if (Number.isNaN(createdAtTimestamp)) {
      throw new Error(`Invalid ticket creation date: ${ticket.createdAt}`);
    }
    return Math.max(0, Math.floor((Date.now() - createdAtTimestamp) / MILLISECONDS_PER_DAY));
  })();
  const urgencyScore = (ticketAge * TICKET_AGE_MULTIPLIER + priorityScore) * statusLevel;
  let urgencyLevel: string;

  switch (true) {
    case urgencyScore <= 10:
      urgencyLevel = 'Minimal. Ticket resolved.';
      break;
    case urgencyScore <= 25:
      urgencyLevel = 'Low urgency. Address when capacity allows.';
      break;
    case urgencyScore <= 50:
      urgencyLevel = 'Moderate urgency. Schedule for Attention.';
      break;
    case urgencyScore <= 75:
      urgencyLevel = 'High urgency. Prioritize resolution.';
      break;
    default:
      urgencyLevel = 'Critical urgency. Immediate attention required.';
      break;
  }

  return [{
    ...ticket,
    ticketAge,
    urgencyScore,
    urgencyLevel
  }];
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

/**
 * Updates an existing ticket
 * @param id - The ID of the ticket to update
 * @param ticketData - The fields to update
 * @returns The updated ticket
 * @throws Error if ticket with given ID is not found
 */
export const updateTicket = async (
  id: number,
  ticketData: Partial<Ticket> 
): Promise<Ticket | null> => {
  const ticketIndex = tickets.findIndex((t) => t.id === id);
  if (ticketIndex <= -1) {
    throw new Error('Ticket not found');
}

  tickets[ticketIndex] = { ...tickets[ticketIndex], ...ticketData };
  return tickets[ticketIndex];
};

/**
 * Deletes an event from storage
 * @param id - The ID of the event to delete
 * @throws Error if event with given ID is not found
 */
export const deleteTicket = async (id: number): Promise<void> => {
    const ticketIndex = tickets.findIndex((ticket: Ticket) => ticket.id === id);
    if (ticketIndex === -1) {
        throw new Error('Ticket not found');
    }
    tickets.splice(ticketIndex, 1);
}