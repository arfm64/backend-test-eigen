// src/seeders/20231003-seed_members_books.js
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('members', [
            { code: 'M001', name: 'Angga', penaltyEnd: null },
            { code: 'M002', name: 'Ferry', penaltyEnd: null },
            { code: 'M003', name: 'Putri', penaltyEnd: null },
        ]);

        await queryInterface.bulkInsert('books', [
            { code: 'HOB-83', title: 'The Hobbit, or There and Back Again', author: 'J.R.R. Tolkien', stock: 1 },
            { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 },
            { code: 'NRN-7', title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', stock: 1 },
            { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 },
            { code: 'TW-11', title: 'Twilight', author: 'Stephenie Meyer', stock: 1 },
        ]);
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('members', null, {});
        await queryInterface.bulkDelete('books', null, {});
    },
};
