import { Ticket } from '../models/ticketModel';

const tickets: Ticket[] = [];
let nextTicketId = 1;
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

const getTicketAge = (ticket: Partial<Pick<Ticket, 'ticketAge' | 'createdAt'>>): number => {
  if (ticket.ticketAge !== undefined) {
    return ticket.ticketAge;
  }

  const createdAtTimestamp = Date.parse(String(ticket.createdAt));
  if (Number.isNaN(createdAtTimestamp)) {
    throw new Error(`Invalid ticket creation date: ${ticket.createdAt}`);
  }
  return Math.max(0, Math.floor((Date.now() - createdAtTimestamp) / MILLISECONDS_PER_DAY));
};

const getUrgencyLevel = (urgencyScore: number): string => {
  switch (true) {
    case urgencyScore <= 10:
      return 'Minimal. Ticket resolved.';
    case urgencyScore <= 25:
      return 'Low urgency. Address when capacity allows.';
    case urgencyScore <= 50:
      return 'Moderate urgency. Schedule for Attention.';
    case urgencyScore <= 75:
      return 'High urgency. Prioritize resolution.';
    default:
      return 'Critical urgency. Immediate attention required.';
  }
};

const getUrgency = (
  priority: string,
  status: string,
  ticketAge: number
): Pick<Ticket, 'urgencyScore' | 'urgencyLevel'> => {
  const priorityScore = PRIORITY_SCORES[priority];
  if (priorityScore === undefined) {
    throw new Error(`Invalid ticket priority: ${priority}`);
  }

  const statusLevel = STATUS_LEVELS[status];
  if (statusLevel === undefined) {
    throw new Error(`Invalid ticket status: ${status}`);
  }

  const urgencyScore = (ticketAge * TICKET_AGE_MULTIPLIER + priorityScore) * statusLevel;
  return { urgencyScore, urgencyLevel: getUrgencyLevel(urgencyScore) };
};

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

  const ticketAge = getTicketAge(ticket);
  const urgency = getUrgency(ticket.priority, ticket.status, ticketAge);

  return [{
    ...ticket,
    ticketAge,
    ...urgency
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
  const priority = ticketData.priority;
  if (priority === undefined) {
    throw new Error('Invalid ticket priority: undefined');
  }
  const status = ticketData.status ?? 'open';
  const createdAt = ticketData.createdAt
    ? new Date(ticketData.createdAt)
    : new Date();
  const ticketAge = getTicketAge({
    ticketAge: ticketData.ticketAge,
    createdAt,
  });
  const urgency = getUrgency(priority, status, ticketAge);
  const newTicket: Ticket = {
    ...ticketData,
    id: nextTicketId++,
    title: ticketData.title,
    description: ticketData.description,
    priority,
    status,
    createdAt,
    ticketAge,
    ...urgency,
  };

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
export const deleteTicket = async (id: number): Promise<boolean> => {
    const ticketIndex = tickets.findIndex((ticket: Ticket) => ticket.id === id);
    if (ticketIndex === -1) {
        throw new Error('Ticket not found');
    }
    tickets.splice(ticketIndex, 1);
    return true;
};