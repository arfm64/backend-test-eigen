import sequelize from '../config/database';
import Member from './memberModel';
import Book from './bookModel';
import Borrow from './borrowModel';

// Initialize associations
Member.associate({ Borrow });
Book.associate({ Borrow });
Borrow.associate({ Member, Book });

// Export the models and sequelize instance
export { sequelize, Member, Book, Borrow };
