import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ticketService from "../services/ticketService";
import { Ticket } from "../models/ticketModel";
import { createTicket, getAllTickets } from "../services/ticketService";


export const getAllTicketsController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try 
    {
        const tickets = await getAllTickets();
        res.status(HTTP_STATUS.OK).json
        ({
            
            "message": "tickets Retrieved",
            count: tickets.length,
            data: tickets
        })
    } 
    catch (error: unknown) 
    {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to retrieve tickets"
        });
    }
};

export const getTicketByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const tickets = await ticketService.getTicketById(Number(id));
        if (tickets.length === 0) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Ticket not found"
            });
            return;
        }
        res.status(HTTP_STATUS.OK).json({
            message: "Ticket retrieved",
            data: tickets[0]
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const createTicketController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const{
            id,
            title,
            description,
            priority,
            status,
            createdAt,
            ticketAge,
            urgencyScore,
            urgencyLevel
        } = req.body;

        const ticket: Ticket =
        {
            id,
            title,
            description,
            priority,
            status,
            createdAt,
            ticketAge,
            urgencyScore,
            urgencyLevel
        };
        const createdTicket: Ticket = await createTicket(ticket);

        res.status(HTTP_STATUS.CREATED).json({
            message: "Ticket created successfully",
            data: createdTicket
        });
    }
    catch (error: unknown)
    {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to create ticket"
        });
    }
};

export const updateTicketController = async (req: Request, res: Response): Promise<void> => {
    try{
        const {id} = req.params;
        const {title, description, priority, status} = req.body;
        const updateData = {title, description, priority, status};

        const updateTicket = await ticketService.updateTicket(Number(id), updateData);
        if (updateTicket === null) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Ticket not found"
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Ticket updated successfully",
            data: updateTicket
        });
    }
    catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to update ticket"
        });
    }
};

export const deleteTicketController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params;
        await ticketService.deleteTicket(Number(id));
        res.status(HTTP_STATUS.OK).json({
            message: "Ticket deleted successfully",
        });
    } catch (error: unknown) {
        next(error);
    }
};
