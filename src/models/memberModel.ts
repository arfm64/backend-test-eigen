// src/models/memberModel.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Member extends Model {
    public code!: string;
    public name!: string;
    public penaltyEnd!: Date | null;

    public static associate(models: any) {
        Member.hasMany(models.Borrow, { foreignKey: 'memberCode' });
    }
}

// Initialize the Member model
Member.init(
    {
        code: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        penaltyEnd: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'members',
        timestamps: false,
    }
);

export default Member;
