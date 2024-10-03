// src/models/bookModel.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Book extends Model {
    public code!: string;
    public title!: string;
    public author!: string;
    public stock!: number;

    public static associate(models: any) {
        Book.hasMany(models.Borrow, { foreignKey: 'bookCode' });
    }
}

// Initialize the Book model
Book.init(
    {
        code: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'books',
        timestamps: false,
    }
);

export default Book;
