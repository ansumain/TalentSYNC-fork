import bcrypt from 'bcryptjs';
import { User, UserRole } from '@talentsync/models';
import { sequelize } from '@talentsync/config';
import { QueryTypes } from 'sequelize';
import { updateUserIdByResumeId } from '../repository/resume.repository';
import { sendWelcomeEmail } from './emailService';
import { ParsedResumeJson } from '../types/ExtractData.type';

const DEFAULT_PASSWORD = 'password123';
const SALT_ROUNDS = 10;


// Checks if the uploader of a resume is a candidate.
// Candidates upload their own resume – no re-linking needed.
const isUploaderCandidate = async (uploaderId: string): Promise<boolean> => {
    const result = await sequelize.query<{ role: string }>(
        `SELECT r.role
         FROM auth.user_roles ur
         JOIN auth.roles r ON ur."roleId" = r.id
         WHERE ur."userId" = :uploaderId`,
        { replacements: { uploaderId }, type: QueryTypes.SELECT }
    );
    return result.some(row => row.role === 'candidate');
};

// Looks up an existing user by email, then by phone.
// Returns the matching user or null if none found.
const findExistingUser = async (email: string | undefined, phone: string | undefined): Promise<User | null> => {
    if (email) {
        const byEmail = await User.findOne({ where: { email } });
        if (byEmail) return byEmail;
    }
    if (phone) {
        const byPhone = await User.findOne({ where: { phone } });
        if (byPhone) return byPhone;
    }
    return null;
};


// Creates a new user account for the candidate and assigns the candidate role.
const createCandidateUser = async (
    name: string,
    email: string,
    phone: string,
): Promise<User> => {
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

    const newUser = await User.create({ name, email, phone, hashedPassword });

    // Get the candidate role Id by name
    const [candidateRole] = await sequelize.query<{ id: string }>(
        `SELECT id FROM auth.roles WHERE role = 'candidate' LIMIT 1`,
        { type: QueryTypes.SELECT }
    );

    if (!candidateRole) throw new Error('Candidate role not found in DB');

    await UserRole.create({ userId: newUser.id, roleId: candidateRole.id });

    return newUser;
};

/*
After parsing a bulk-uploaded resume, determines which user it belongs to.
    - If uploaded by a candidate: no operation needed.
    - If uploaded by admin/manager:
        1. Try to find existing user by email, then phone.
        2. If found: link resume to that userId.
        3. If not found: create a new candidate account and link.
 */
export const linkOrCreateUserForResume = async (
    resumeId: string,
    uploaderId: string,
    parsedJSON: ParsedResumeJson
): Promise<void> => {
    // skip for candidate self-uploads
    const uploaderIsCandidate = await isUploaderCandidate(uploaderId);
    if (uploaderIsCandidate) return;

    const email: string | undefined = (parsedJSON?.email!).toString().trim() || undefined;
    const phone: string | undefined = (parsedJSON?.phone!).toString().trim()?.replace(/\D/g, '').slice(-10) || undefined;
    const name: string = (parsedJSON?.name!).toString().trim() || 'Unknown';

    // Need at least one identifier to proceed
    if (!email && !phone) return;

    // email-first priority lookup
    const existingUser = await findExistingUser(email, phone);

    if (existingUser) {
        await updateUserIdByResumeId(resumeId, existingUser.id);
        return;
    }

    // No match found – create a new candidate account
    if (!email || !phone) {
        // cannot create account without both email and phone
        return;
    }

    const newUser = await createCandidateUser(name, email, phone);
    await updateUserIdByResumeId(resumeId, newUser.id);
    await sendWelcomeEmail(name, email, phone);
};
