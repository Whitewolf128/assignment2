import express, { Router } from "express";
import * as ticketController from "../controllers/ticketController";

const ticketRouter: Router = express.Router();

ticketRouter.get("/", ticketController.getAllTicketsController);
ticketRouter.get("/:id/urgency", ticketController.getTicketByIdController);
ticketRouter.post("/", ticketController.createTicketController);
ticketRouter.put("/:id", ticketController.updateTicketController);
ticketRouter.delete("/:id", ticketController.deleteTicketController);

export default ticketRouter;