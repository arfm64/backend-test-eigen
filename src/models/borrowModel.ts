// src/models/borrowModel.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Member from './memberModel';
import Book from './bookModel';
import { CustomError } from '../errors/CustomError';

class Borrow extends Model {
    public code!: string;
    public memberCode!: string;
    public bookCode!: string;
    public borrowDate!: Date;
    public returnDate!: Date | null;
    public status!: string;

    public static associate(models: any) {
        Borrow.belongsTo(models.Member, { foreignKey: 'memberCode', as: 'member' });
        Borrow.belongsTo(models.Book, { foreignKey: 'bookCode', as: 'book' });
    }

    static async borrowBook(memberCode: string, bookCode: string) {
        if (!memberCode || !bookCode) {
            throw new CustomError('MemberCode and bookCode are required.', null);
        }

        const book = await Book.findOne({ where: { code: bookCode } });
        if (!book) throw new CustomError('The specified book is not available.', null);

        const isBookBorrowed = await Borrow.findOne({ where: { memberCode, bookCode, status: 'active' } });
        if (isBookBorrowed) throw new CustomError('You have already borrowed this book.', null);

        // Check the availability of the book in the Stock model (assuming you have a Stock model)
        const bookStock = await Book.findOne({ where: { code: bookCode } });
        if (!bookStock || book.stock <= 0) {
            throw new CustomError('This book is not available for borrowing.', null);
        }

        const member = await Member.findOne({ where: { code: memberCode } });
        if (!member || (member.penaltyEnd && member.penaltyEnd > new Date())) {
            throw new CustomError(member ? 'Member is Under Penalty.' : 'Member not found.', member);
        }

        const borrowedBooksCount = await Borrow.count({ where: { memberCode, status: 'active' } });
        if (borrowedBooksCount >= 2) throw new CustomError('Cannot borrow more than 2 books.', null);

        const borrow = await Borrow.create({
            code: `CB${(await Borrow.count() + 1).toString().padStart(3, '0')}`,
            memberCode,
            bookCode,
            borrowDate: new Date(),
            status: 'active',
        });

        await book.update({ stock: book.stock - 1 });
        return borrow;
    }

    static async returnBook(memberCode: string, bookCode: string) {
        const borrow = await Borrow.findOne({ where: { memberCode, bookCode, status: 'active' } });
        if (!borrow) throw new CustomError('This book was not borrowed by this member.', null);

        const borrowDuration = Math.ceil((new Date().getTime() - borrow.borrowDate.getTime()) / (1000 * 3600 * 24));
        if (borrowDuration > 7) {
            const penaltyEndDate = new Date();
            penaltyEndDate.setDate(penaltyEndDate.getDate() + 3);
            await Member.update({ penaltyEnd: penaltyEndDate }, { where: { code: memberCode } });
        }

        borrow.returnDate = new Date();
        borrow.status = 'returned';
        await borrow.save();

        const book = await Book.findOne({ where: { code: bookCode } });
        if (book) await book.update({ stock: book.stock + 1 });

        return { ...borrow.toJSON(), status: borrow.status };
    }

    static async getAllBorrows() {
        try {
            const borrows = await Borrow.findAll({
                where: { status: 'active' },
                include: [
                    { model: Member, as: 'member', attributes: ['code', 'name'] },
                    { model: Book, as: 'book', attributes: ['code', 'title', 'author'] },
                ],
                attributes: ['memberCode'],
                group: ['memberCode', 'member.code', 'member.name', 'book.code'],
            });

            const borrowMap: { [key: string]: any } = {};
            borrows.forEach(borrow => {
                const member = borrow.get('member') as Member;
                const book = borrow.get('book') as Book;

                if (member && book) {
                    if (!borrowMap[member.code]) {
                        borrowMap[member.code] = {
                            memberCode: member.code,
                            name: member.name,
                            totalBooksBorrowed: 0,
                            books: [],
                        };
                    }

                    borrowMap[member.code].totalBooksBorrowed += 1;
                    borrowMap[member.code].books.push({
                        code: book.code,
                        title: book.title,
                        author: book.author,
                    });
                }
            });

            return Object.values(borrowMap);
        } catch (error) {
            console.error('Error retrieving borrows:', error);
            throw new CustomError('An error occurred while retrieving borrows.', null);
        }
    }
}

Borrow.init(
    {
        code: { type: DataTypes.STRING, primaryKey: true },
        memberCode: {
            type: DataTypes.STRING,
            allowNull: false,
            references: { model: Member, key: 'code' },
        },
        bookCode: {
            type: DataTypes.STRING,
            allowNull: false,
            references: { model: Book, key: 'code' },
        },
        borrowDate: { type: DataTypes.DATE, allowNull: false },
        returnDate: { type: DataTypes.DATE, allowNull: true },
        status: { type: DataTypes.STRING, defaultValue: 'active' },
    },
    {
        sequelize,
        tableName: 'borrows',
        timestamps: false,
    }
);

export default Borrow;
