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

    /**
     * @swagger
     * /api/borrows:
     *   get:
     *     summary: Retrieve all borrow records
     *     description: Fetches all borrowing transactions from the system.
     *     responses:
     *       200:
     *         description: Data borrows retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Data borrows retrieved successfully.
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       memberCode:
     *                         type: string
     *                         example: "M001"
     *                       bookCode:
     *                         type: string
     *                         example: "BK001"
     *                       borrowDate:
     *                         type: string
     *                         example: "2023-09-01"
     *                       returnDate:
     *                         type: string
     *                         example: "2023-09-15"
     *       500:
     *         description: An unexpected error occurred.
     */
    getAllBorrows = async (req: Request, res: Response) => {
        try {
            const borrows = await Borrow.getAllBorrows();
            this.handleResponse(res, 200, true, 'Data borrows retrieved successfully.', borrows);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * @swagger
     * /api/borrows/:
     *   post:
     *     summary: Borrow a book
     *     description: Borrows a book for a member.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               memberCode:
     *                 type: string
     *                 example: "M001"
     *               bookCode:
     *                 type: string
     *                 example: "BK001"
     *     responses:
     *       201:
     *         description: Book borrowed successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Book borrowed successfully.
     *                 data:
     *                   type: object
     *                   properties:
     *                     memberCode:
     *                       type: string
     *                       example: "M001"
     *                     bookCode:
     *                       type: string
     *                       example: "BK001"
     *                     borrowDate:
     *                       type: string
     *                       example: "2023-09-01"
     *       400:
     *         description: Invalid request data.
     *       500:
     *         description: An unexpected error occurred.
     */
    borrowBook = async (req: Request, res: Response) => {
        const { memberCode, bookCode } = req.body;
        try {
            const borrow = await Borrow.borrowBook(memberCode, bookCode);
            this.handleResponse(res, 201, true, 'Book borrowed successfully.', borrow);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * @swagger
     * /api/borrows/return:
     *   post:
     *     summary: Return a borrowed book
     *     description: Returns a book that was previously borrowed by a member.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               memberCode:
     *                 type: string
     *                 example: "M001"
     *               bookCode:
     *                 type: string
     *                 example: "BK001"
     *     responses:
     *       200:
     *         description: Book returned successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Book returned successfully.
     *                 data:
     *                   type: object
     *                   properties:
     *                     memberCode:
     *                       type: string
     *                       example: "M001"
     *                     bookCode:
     *                       type: string
     *                       example: "BK001"
     *                     returnDate:
     *                       type: string
     *                       example: "2023-09-15"
     *       400:
     *         description: Invalid request data.
     *       500:
     *         description: An unexpected error occurred.
     */
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
