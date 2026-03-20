import { QueryTypes } from 'sequelize';
import { sequelize } from '@talentsync/config';
import { notFoundError } from '@talentsync/types';

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

    if (!row?.email) {
        throw notFoundError('requesting user email not found', 'REQUESTING_USER_EMAIL_NOT_FOUND');
    }
    return row.email;
};

export { getUserEmailByIdRepository };