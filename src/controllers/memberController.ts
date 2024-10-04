// src/controllers/memberController.ts
import { Request, Response } from 'express';
import Member from '../models/memberModel';

class MemberController {
    private handleResponse(res: Response, status: number, success: boolean, message: string, data: any = null) {
        const response = { success, message, ...(data && { data }) };
        res.status(status).json(response);
    }

    /**
     * @swagger
     * /api/members:
     *   get:
     *     summary: Retrieve all members
     *     description: Fetches all members from the system.
     *     responses:
     *       200:
     *         description: Members retrieved successfully.
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
     *                   example: Members retrieved successfully.
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       memberCode:
     *                         type: string
     *                         example: "M001"
     *                       name:
     *                         type: string
     *                         example: "John Doe"
     *                       email:
     *                         type: string
     *                         example: "john.doe@example.com"
     *       500:
     *         description: An error occurred while retrieving members.
     */
    getAllMembers = async (req: Request, res: Response) => {
        try {
            const members = await Member.findAll();
            this.handleResponse(res, 200, true, 'Members retrieved successfully.', members);
        } catch (error) {
            this.handleResponse(res, 500, false, 'An error occurred while retrieving members.');
        }
    };

    /**
     * @swagger
     * /api/members:
     *   post:
     *     summary: Create a new member
     *     description: Adds a new member to the system.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               memberCode:
     *                 type: string
     *                 example: "M002"
     *               name:
     *                 type: string
     *                 example: "Jane Doe"
     *               email:
     *                 type: string
     *                 example: "jane.doe@example.com"
     *     responses:
     *       201:
     *         description: Member created successfully.
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
     *                   example: Member created successfully.
     *                 data:
     *                   type: object
     *                   properties:
     *                     memberCode:
     *                       type: string
     *                       example: "M002"
     *                     name:
     *                       type: string
     *                       example: "Jane Doe"
     *       400:
     *         description: Failed to create member.
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
     *                   example: Failed to create member.
     *                 error:
     *                   type: string
     *                   example: "Validation error: email must be unique."
     *       500:
     *         description: An error occurred while creating member.
     */
    createMember = async (req: Request, res: Response) => {
        try {
            const member = await Member.create(req.body);
            this.handleResponse(res, 201, true, 'Member created successfully.', member);
        } catch (error) {
            this.handleResponse(res, 400, false, 'Failed to create member.', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };
}

export default new MemberController();
