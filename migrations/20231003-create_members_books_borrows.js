// src/migrations/20231003-create_members_books_borrows.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('members', {
            code: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            penaltyEnd: {
                type: Sequelize.DATE,
            },
        });

        await queryInterface.createTable('books', {
            code: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            author: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        });

        await queryInterface.createTable('borrows', {
            code: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            bookCode: {
                type: Sequelize.STRING,
                references: {
                    model: 'books',
                    key: 'code',
                },
            },
            memberCode: {
                type: Sequelize.STRING,
                references: {
                    model: 'members',
                    key: 'code',
                },
            },
            borrowDate: {
                type: Sequelize.DATE,
            },
            returnDate: {
                type: Sequelize.DATE,
            },
            status: {
                type: Sequelize.STRING,
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('borrows');
        await queryInterface.dropTable('books');
        await queryInterface.dropTable('members');
    },
};
