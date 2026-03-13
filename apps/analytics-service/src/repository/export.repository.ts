import { QueryTypes } from 'sequelize';
import { sequelize } from '@talentsync/config';

const getUserEmailByIdRepository = async (userId: string): Promise<string> => {
    const [row] = await sequelize.query<{ email: string }>(
        `SELECT email
     FROM auth.users
     WHERE id = :userId
     LIMIT 1`,
        {
            type: QueryTypes.SELECT,
            replacements: { userId },
        }
    );

    if (!row?.email) throw new Error('requesting user email not found');
    return row.email;
};

export { getUserEmailByIdRepository };