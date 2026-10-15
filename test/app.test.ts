import { describe, expect, it } from '@jest/globals';
import { createTicket, getAllTickets, getTicketById } from '../src/api/v1/services/ticketService';

describe('getTicketById urgency score', () => {
  it.each([
    ['low', 10],
    ['medium', 20],
    ['high', 30],
    ['critical', 50],
  ] as const)('calculates the score for %s priority', async (priority: string, priorityScore: number) => {
    const ticket = await createTicket({
      title: `${priority} priority ticket`,
      description: 'Urgency score test',
      priority,
      ticketAge: 2,
    });

    const [retrievedTicket] = await getTicketById(ticket.id);

    expect(retrievedTicket.ticketAge).toBe(2);
    expect(retrievedTicket.urgencyScore).toBe(2 * 5 + priorityScore);
  });

  it('derives ticket age from createdAt when age was not provided', async () => {
    const ticket = await createTicket({
      title: 'Ticket without an explicit age',
      description: 'Derived age test',
      priority: 'low',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    const [retrievedTicket] = await getTicketById(ticket.id);

    expect(retrievedTicket.ticketAge).toBe(2);
    expect(retrievedTicket.urgencyScore).toBe(20);
  });

  it('does not change the stored ticket score when retrieving it', async () => {
    const ticket = await createTicket({
      title: 'Stored ticket',
      description: 'Stored score test',
      priority: 'low',
      ticketAge: 1,
    });

    await getTicketById(ticket.id);
    const storedTicket = (await getAllTickets()).find(({ id }) => id === ticket.id);

    expect(storedTicket?.urgencyScore).toBeUndefined();
  });
});