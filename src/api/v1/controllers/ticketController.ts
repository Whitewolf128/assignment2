import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ticketService from "../services/ticketService";
import { Ticket } from "../models/ticketModel";
import { createTicket, getAllTickets, updateTicket, deleteTicket } from "../services/ticketService";


export const getAllTicketsController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try 
    {
        const tickets: Ticket[] = await getAllTickets();
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

export const createTicketController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const{
            id,
            title,
            description,
            priority,
            baseScore,
            status,
            createdAt
        } = req.body;

        const ticket: Ticket =
        {
            id,
            title,
            description,
            priority,
            baseScore,
            status,
            createdAt
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
        const {title, description, priority, baseScore, status} = req.body;
        const updateData = {title, description, priority, baseScore, status};

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
