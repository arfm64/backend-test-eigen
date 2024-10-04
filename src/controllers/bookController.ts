// src/controllers/bookController.ts
import { Request, Response } from 'express';
import Book from '../models/bookModel';

class BookController {
    private handleResponse(res: Response, status: number, success: boolean, message: string, data: any = null, total: number | null = null) {
        const response = { success, message, ...(data && { data }), ...(total !== null && { total }) };
        res.status(status).json(response);
    }

    /**
     * @swagger
     * /api/books:
     *   get:
     *     summary: Retrieve all books
     *     description: Retrieve a list of all books in the system along with total stock.
     *     responses:
     *       200:
     *         description: Books retrieved successfully.
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
     *                   example: Books retrieved successfully.
     *                 total:
     *                   type: number
     *                   example: 100
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       code:
     *                         type: string
     *                         example: "BK001"
     *                       title:
     *                         type: string
     *                         example: "The Great Gatsby"
     *                       stock:
     *                         type: number
     *                         example: 10
     *       500:
     *         description: An error occurred while retrieving books.
     */
    getAllBooks = async (req: Request, res: Response) => {
        try {
            const books = await Book.findAll();
            const totalStock = books.reduce((sum, book) => sum + book.stock, 0);
            this.handleResponse(res, 200, true, 'Books retrieved successfully.', books, totalStock);
        } catch (error) {
            this.handleResponse(res, 500, false, 'An error occurred while retrieving books.');
        }
    };

    /**
     * @swagger
     * /api/books:
     *   post:
     *     summary: Create a new book
     *     description: Create a new book with the provided data.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               code:
     *                 type: string
     *                 example: "BK001"
     *               title:
     *                 type: string
     *                 example: "The Great Gatsby"
     *               stock:
     *                 type: number
     *                 example: 10
     *               author:
     *                 type: string
     *                 example: "Gatsby"
     *     responses:
     *       201:
     *         description: Book created successfully.
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
     *                   example: Book created successfully.
     *                 data:
     *                   type: object
     *                   properties:
     *                     code:
     *                       type: string
     *                       example: "BK001"
     *                     title:
     *                       type: string
     *                       example: "The Great Gatsby"
     *                     stock:
     *                       type: number
     *                       example: 10
     *       400:
     *         description: Failed to create book.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Failed to create book.
     *                 error:
     *                   type: string
     *                   example: "Validation error"
     */
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
