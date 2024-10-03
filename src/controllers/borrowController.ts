// src/controllers/borrowController.ts
import { Request, Response } from 'express';
import Borrow from '../models/borrowModel';
import { CustomError } from '../errors/CustomError';

class BorrowController {
    private handleResponse(res: Response, status: number, success: boolean, message: string, data: any = null) {
        res.status(status).json({ success, message, ...(data && { data }) });
    }

    private handleError(res: Response, error: unknown) {
        if (error instanceof CustomError) {
            this.handleResponse(res, 200, false, error.message, error.data || null);
        } else {
            this.handleResponse(res, 500, false, 'An unexpected error occurred.');
        }
    }

    getAllBorrows = async (req: Request, res: Response) => {
        try {
            const borrows = await Borrow.getAllBorrows();
            this.handleResponse(res, 200, true, 'Data borrows retrieved successfully.', borrows);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    borrowBook = async (req: Request, res: Response) => {
        const { memberCode, bookCode } = req.body;
        try {
            const borrow = await Borrow.borrowBook(memberCode, bookCode);
            this.handleResponse(res, 201, true, 'Book borrowed successfully.', borrow);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    returnBook = async (req: Request, res: Response) => {
        const { memberCode, bookCode } = req.body;
        try {
            const borrow = await Borrow.returnBook(memberCode, bookCode);
            this.handleResponse(res, 200, true, 'Book returned successfully.', borrow);
        } catch (error) {
            this.handleError(res, error);
        }
    };
}

export default new BorrowController();
