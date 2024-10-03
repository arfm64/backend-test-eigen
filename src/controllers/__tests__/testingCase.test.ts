import request from 'supertest';
import app from '../../app'; // Your Express app
import { sequelize } from '../../models'; // Sequelize instance for transaction management
import Book from '../../models/bookModel'; // Book Model
import Member from '../../models/memberModel'; // Member Model
import Borrow from '../../models/borrowModel'; // Borrow Model

// Integration tests for the Borrowing System
describe('Borrowing System Integration Tests', () => {

    // Setup database and initial data before all tests
    beforeAll(async () => {
        await sequelize.sync({ force: true }); // Reset database

        // Insert initial data directly in the beforeAll block
        await Book.bulkCreate([
            { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 },
            { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 },
            { code: 'TW-11', title: 'Twilight', author: 'Stephenie Meyer', stock: 1 },
            { code: 'HOB-83', title: 'The Hobbit, or There and Back Again', author: 'J.R.R. Tolkien', stock: 1 },
            { code: 'NRN-7', title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', stock: 1 },
        ]);

        await Member.bulkCreate([
            { code: 'M001', name: 'Angga' },
            { code: 'M002', name: 'Ferry' },
            { code: 'M003', name: 'Putri' },
        ]);
    });

    // Close the database connection after all tests
    afterAll(async () => {
        await sequelize.close();
    });

    describe('Member Management', () => {
        // 1. menampilkan seluruh member
        it('should retrieve all members', async () => {
            const response = await request(app).get('/api/members');
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                success: true,
                message: "Members retrieved successfully.",
                data: [
                    {
                        code: "M001",
                        name: "Angga",
                        penaltyEnd: null
                    },
                    {
                        code: "M002",
                        name: "Ferry",
                        penaltyEnd: null
                    },
                    {
                        code: "M003",
                        name: "Putri",
                        penaltyEnd: null
                    }
                ]
            });
        });
    });

    describe('Book Management', () => {
        // 2. melakukan pengecekan seluruh buku
        it('should retrieve all books', async () => {
            const response = await request(app).get('/api/books');
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(
                {
                    success: true,
                    message: "Books retrieved successfully.",
                    data: [
                        {
                            code: "HOB-83",
                            title: "The Hobbit, or There and Back Again",
                            author: "J.R.R. Tolkien",
                            stock: 1
                        },
                        {
                            code: "JK-45",
                            title: "Harry Potter",
                            author: "J.K Rowling",
                            stock: 1
                        },
                        {
                            code: "NRN-7",
                            title: "The Lion, the Witch and the Wardrobe",
                            author: "C.S. Lewis",
                            stock: 1
                        },
                        {
                            code: "SHR-1",
                            title: "A Study in Scarlet",
                            author: "Arthur Conan Doyle",
                            stock: 1
                        },
                        {
                            code: "TW-11",
                            title: "Twilight",
                            author: "Stephenie Meyer",
                            stock: 1
                        }
                    ],
                    total: 5
                }
            );
        });
    });

    describe('Borrowing Management', () => {
        // 3. melakukan pengecekan peminjaman buku di awal
        it('should retrieve no borrow records initially', async () => {
            const response = await request(app).get('/api/borrows');
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(
                {
                    success: true,
                    message: "Data borrows retrieved successfully.",
                    data: []
                }
            );
        });

        // 4. menambahkan peminjaman
        it('should allow a member to borrow a book', async () => {
            const response = await request(app).post('/api/borrows').send({
                memberCode: 'M003',
                bookCode: 'SHR-1',
            });
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(
                {
                    success: true,
                    message: "Book borrowed successfully.",
                    data: {
                        code: "CB001",
                        memberCode: "M003",
                        bookCode: "SHR-1",
                        // borrowDate: "2024-10-03T13:30:50.846Z",
                        status: "active"
                    }
                }
            );
        });
        // 5. melakukan peminjaman dengan buku yang sama dilakukan dengan member yang berbeda
        it('should not allow another member to borrow the same book if stock is 0', async () => {
            const response = await request(app).post('/api/borrows').send({
                memberCode: 'M001',
                bookCode: 'SHR-1',
            });
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                success: false,
                message: "This book is not available for borrowing."
            });
        });

        // 6. member dengan code M003 meminjam buku lagi sehingga total buku yang dipinjam 2
        it('should allow the same member to borrow a second book', async () => {
            const response = await request(app).post('/api/borrows').send({
                memberCode: 'M003',
                bookCode: 'JK-45',
            });
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(
                {
                    success: true,
                    message: "Book borrowed successfully.",
                    data: {
                        code: "CB002",
                        memberCode: "M003",
                        bookCode: "JK-45",
                        // borrowDate: "2024-10-03T13:48:34.074Z",
                        status: "active"
                    }
                }
            );
        });
        // 7. member dengan code M003 mencoba meminjam kembali hingga 3 buku, tetapi batas maksimal hanya 2 buku yang boleh dipinjam
        it('should not allow a member to borrow more than 2 books', async () => {
            const response = await request(app).post('/api/borrows').send({
                memberCode: 'M003',
                bookCode: 'TW-11',
            });
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(
                {
                    success: false,
                    message: "Cannot borrow more than 2 books."
                }
            );
        });
        // 8. member lain (M002) mencoba memulangkan buku, tetapi dia belum meminjam buku
        it('should not allow a member to return a book they did not borrow', async () => {
            const response = await request(app).post('/api/borrows/return').send({
                memberCode: 'M002',
                bookCode: 'TW-11',
            });
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(
                {
                    success: false,
                    message: "This book was not borrowed by this member."
                }
            );
        });
        // 9. member dengan kode M003 memulangkan buku
        it('should allow a member to return a borrowed book', async () => {
            const response = await request(app).post('/api/borrows/return').send({
                memberCode: 'M003',
                bookCode: 'JK-45',
            });
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(
                {
                    success: true,
                    message: "Book returned successfully.",
                    data: {
                        code: "CB002",
                        memberCode: "M003",
                        bookCode: "JK-45",
                        // borrowDate: "2024-10-03T13:48:34.000Z",
                        // returnDate: "2024-10-03T13:51:21.965Z",
                        status: "returned"
                    }
                }
            );
        });

        // 10. menampilkan Jumlah buku yang dipinjam oleh setiap anggota
        it('should retrieve the number of books borrowed by each member', async () => {
            const response = await request(app).get('/api/borrows');
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(
                {
                    success: true,
                    message: "Data borrows retrieved successfully.",
                    data: [
                        {
                            memberCode: "M003",
                            name: "Putri",
                            totalBooksBorrowed: 1,
                            books: [
                                {
                                    code: "SHR-1",
                                    title: "A Study in Scarlet",
                                    author: "Arthur Conan Doyle"
                                }
                            ]
                        }
                    ]
                }
            );
        });

        // 11. mengubah tanggal (borrow.borrowDate) ketika memberCode M003 status = active and bookCode JK-45 ke -10 hari
        it('should update borrow date and allow returning the book', async () => {
            // Step 2: Attempt to find the borrow record for M003 and book JK-45
            const borrow = await Borrow.findByPk('CB001');

            // Step 3: Ensure the borrow record exists
            if (!borrow) {
                throw new Error('Borrow record not found'); // Handle the null case explicitly
            }

            // Step 4: Update the borrow date to 10 days earlier
            const updatedBorrowDate = new Date(borrow.borrowDate);
            updatedBorrowDate.setDate(updatedBorrowDate.getDate() - 10);

            // Step 5: Perform the update
            await borrow.update({ borrowDate: updatedBorrowDate });

            // Step 6: Attempt to return the book
            const response = await request(app).post('/api/borrows/return').send({
                memberCode: 'M003',
                bookCode: 'SHR-1',
            });

            // Step 7: Validate the response
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(
                {
                    success: true,
                    message: "Book returned successfully.",
                    data: {
                        code: "CB001",
                        memberCode: "M003",
                        bookCode: "SHR-1",
                        status: "returned"
                    }
                }
            );
        });

        // 12. melakukan pengecekan ke seluruh member untuk memastikan bahwa M003 terkena pinalti
        it('should check if member M003 is under penalty', async () => {
            const response = await request(app).get('/api/members');
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                success: true,
                message: "Members retrieved successfully.",
                data: [
                    {
                        code: "M001",
                        name: "Angga"
                        // penaltyEnd: null
                    },
                    {
                        code: "M002",
                        name: "Ferry"
                        // penaltyEnd: null
                    },
                    {
                        code: "M003",
                        name: "Putri"
                        // penaltyEnd: "2024-10-06T13:57:05.000Z"
                    }
                ]
            });
        });

        // 13. member yang terkena pinalti melakukan peminjaman apakah bisa atau tidak
        it('should not allow member M003 to borrow a book due to penalty', async () => {
            const response = await request(app).post('/api/borrows').send({
                memberCode: 'M003',
                bookCode: 'SHR-1',
            });
            expect(response.body).toMatchObject(
                {
                    success: false,
                    message: "Member is Under Penalty.",
                    data: {
                        code: "M003",
                        name: "Putri",
                    }
                }
            );
        });

        // 14. melakukan pengecekan jumlah semua buku yang dipinjam oleh setiap anggota
        it('should retrieve the total number of borrowed books by each member', async () => {

            await request(app).post('/api/borrows').send({
                memberCode: 'M003',
                bookCode: 'NRN-7',
            });
            await request(app).post('/api/borrows').send({
                memberCode: 'M002',
                bookCode: 'SHR-1',
            });
            await request(app).post('/api/borrows').send({
                memberCode: 'M003',
                bookCode: 'SHR-1',
            });

            const response = await request(app).get('/api/borrows');
            expect(response.body).toMatchObject(
                {
                    success: true,
                    message: "Data borrows retrieved successfully.",
                    data: [
                        {
                            memberCode: "M002",
                            name: "Ferry",
                            totalBooksBorrowed: 1,
                            books: [
                                {
                                    code: "SHR-1",
                                    title: "A Study in Scarlet",
                                    author: "Arthur Conan Doyle"
                                }
                            ]
                        }
                    ]
                }
            );
        });
    });

});
