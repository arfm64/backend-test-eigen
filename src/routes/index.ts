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
router.get('/books', BookController.getAllBooks);

// Member Routes
router.get('/members', MemberController.getAllMembers);

export default router;
