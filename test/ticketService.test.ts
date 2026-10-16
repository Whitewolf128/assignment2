import { describe, expect, it } from '@jest/globals';
import { createTicket, deleteTicket, getAllTickets, getTicketById } from '../src/api/v1/services/ticketService';

describe('getTicketById urgency score', () => {
  it.each([
    ['open', 20],
    ['in-progress', 20],
    ['resolved', 0],
  ])('applies the status multiplier for %s tickets', async (status, expectedScore) => {
    const ticket = await createTicket({
      title: `${status} ticket`,
      description: 'Verify status affects urgency score',
      priority: 'low',
      status,
      ticketAge: 2,
    });

    const [retrievedTicket] = await getTicketById(ticket.id);

    expect(retrievedTicket.urgencyScore).toBe(expectedScore);
    if (status === 'resolved') {
      expect(retrievedTicket.urgencyLevel).toBe('Minimal. Ticket resolved.');
    }
  });

  it.each([
    [0, 10, 'Minimal. Ticket resolved.'],
    [1, 15, 'Low urgency. Address when capacity allows.'],
    [4, 30, 'Moderate urgency. Schedule for Attention.'],
    [10, 60, 'High urgency. Prioritize resolution.'],
    [14, 80, 'Critical urgency. Immediate attention required.'],
  ])('returns the urgency message after score %s', async (ticketAge, expectedScore, expectedLevel) => {
    const ticket = await createTicket({
      title: 'Urgency level test',
      description: 'Verify the level is derived from the calculated score',
      priority: 'low',
      ticketAge,
    });

    const [retrievedTicket] = await getTicketById(ticket.id);

    expect(retrievedTicket.urgencyScore).toBe(expectedScore);
    expect(retrievedTicket.urgencyLevel).toBe(expectedLevel);
    expect(Object.keys(retrievedTicket)).toEqual(
      expect.arrayContaining(['urgencyScore', 'urgencyLevel'])
    );
    expect(Object.keys(retrievedTicket).indexOf('urgencyLevel')).toBe(
      Object.keys(retrievedTicket).indexOf('urgencyScore') + 1
    );
  });

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
    expect(retrievedTicket.urgencyLevel).toBe(
      retrievedTicket.urgencyScore <= 25
        ? 'Low urgency. Address when capacity allows.'
        : retrievedTicket.urgencyScore <= 50
          ? 'Moderate urgency. Schedule for Attention.'
          : 'High urgency. Prioritize resolution.'
    );
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

    expect(storedTicket).not.toHaveProperty('urgencyScore');
  });
});

describe('getAllTickets', () => {
  it('returns all tickets without urgency properties', async () => {
    await createTicket({
      title: 'Ticket 1',
      description: 'First ticket',
      priority: 'low',
      ticketAge: 1,
    });
    await createTicket({
      title: 'Ticket 2',
      description: 'Second ticket',
      priority: 'medium',
      ticketAge: 2,
    });
    const tickets = await getAllTickets();
    expect(tickets).toHaveLength(2);
    expect(tickets[0]).not.toHaveProperty('urgencyScore');
    expect(tickets[1]).not.toHaveProperty('urgencyScore');
  });
});

describe('createTicket', () => {
  it('creates a ticket and returns it with urgency properties', async () => {
    const ticket = await createTicket({
      title: 'New Ticket',
      description: 'Creating a new ticket',
      priority: 'high',
      ticketAge: 3,
    });
    expect(ticket).toHaveProperty('urgencyScore');
    expect(ticket).toHaveProperty('urgencyLevel');
  });
});

describe('getTicketById', () => {
  it('returns an empty array for a non-existent ticket', async () => {
    const tickets = await getTicketById(5);
    expect(tickets).toEqual([]);
  });
});

describe('createTicket with invalid priority', () => {
  it('throws an error for invalid priority', async () => {
    await expect(
      createTicket({
        title: 'Invalid Priority Ticket',
        description: 'This ticket has an invalid priority',
        priority: 'invalid-priority',
        ticketAge: 1,
      })
    ).rejects.toThrow('Invalid ticket priority: invalid-priority');
  });
});

describe('createTicket with invalid status', () => {
  it('throws an error for invalid status', async () => {
    await expect(
      createTicket({
        title: 'Invalid Status Ticket',
        description: 'This ticket has an invalid status',
        priority: 'low',
        status: 'invalid-status',
        ticketAge: 1,
      })
    ).rejects.toThrow('Invalid ticket status: invalid-status');
  });
});

describe('deleteTicket', () => {
  it('deletes a ticket and returns true', async () => {
    const ticket = await createTicket({
      title: 'Ticket to Delete',
      description: 'This ticket will be deleted',
      priority: 'low',
      ticketAge: 1,
    });
    const deleteResult = await deleteTicket(ticket.id);
    expect(deleteResult).toBe(true);
    const tickets = await getAllTickets();
    expect(tickets.find((t) => t.id === ticket.id)).toBeUndefined();
  });
});
