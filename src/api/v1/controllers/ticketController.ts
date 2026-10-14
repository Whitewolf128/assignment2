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
