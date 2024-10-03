// src/controllers/memberController.ts
import { Request, Response } from 'express';
import Member from '../models/memberModel';

class MemberController {
    private handleResponse(res: Response, status: number, success: boolean, message: string, data: any = null) {
        const response = { success, message, ...(data && { data }) };
        res.status(status).json(response);
    }

    getAllMembers = async (req: Request, res: Response) => {
        try {
            const members = await Member.findAll();
            this.handleResponse(res, 200, true, 'Members retrieved successfully.', members);
        } catch (error) {
            this.handleResponse(res, 500, false, 'An error occurred while retrieving members.');
        }
    };

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
