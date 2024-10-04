// src/routes/index.ts
import { Router } from 'express';
import BorrowController from '../controllers/borrowController';
import BookController from '../controllers/bookController';
import MemberController from '../controllers/memberController';

const router = Router();

// Borrow Routes
router.route('/borrows')
    .get(BorrowController.getAllBorrows)
    .post(BorrowController.borrowBook);
router.post('/borrows/return', BorrowController.returnBook);

// Book Routes
router.route('/books')
    .get(BookController.getAllBooks)
    .post(BookController.createBook);

// Member Routes
router.route('/members')
    .get(MemberController.getAllMembers)
    .post(MemberController.createMember);

export default router;
