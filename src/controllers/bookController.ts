// src/controllers/bookController.ts
import { Request, Response } from 'express';
import Book from '../models/bookModel';

class BookController {
    private handleResponse(res: Response, status: number, success: boolean, message: string, data: any = null, total: number | null = null) {
        const response = { success, message, ...(data && { data }), ...(total !== null && { total }) };
        res.status(status).json(response);
    }

    getAllBooks = async (req: Request, res: Response) => {
        try {
            const books = await Book.findAll();
            const totalStock = books.reduce((sum, book) => sum + book.stock, 0);
            this.handleResponse(res, 200, true, 'Books retrieved successfully.', books, totalStock);
        } catch (error) {
            this.handleResponse(res, 500, false, 'An error occurred while retrieving books.');
        }
    };

    createBook = async (req: Request, res: Response) => {
        try {
            const book = await Book.create(req.body);
            this.handleResponse(res, 201, true, 'Book created successfully.', book);
        } catch (error) {
            this.handleResponse(res, 400, false, 'Failed to create book.', { error: error instanceof Error ? error.message : 'Unknown error' });
        }
    };
}

export default new BookController();
