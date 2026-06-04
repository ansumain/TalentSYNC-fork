import { Skill, UserSkill } from '@talentsync/models';
import { conflictError, notFoundError } from '@talentsync/types';

// fetch all skills from DB
const getAllSkillsRepository = async () => {
    try {
        const skills = await Skill.findAll({ order: [['skillName', 'ASC']] });
        return skills;
    } catch (error: unknown) {
        throw error;
    }
};

// fetch skills for a specific user
const getUserSkillsRepository = async (userId: string) => {
    const userSkillRows = await UserSkill.findAll({ where: { userId }, attributes: ['skillId'], raw: true });
    const skillIds = (userSkillRows as { skillId: string }[]).map(r => r.skillId);
    if (skillIds.length === 0) return [];
    const skills = await Skill.findAll({ where: { skillId: skillIds }, order: [['skillName', 'ASC']] });
    return skills;
};

// add a skill to a user
const addUserSkillRepository = async (userId: string, skillId: string) => {
    const existing = await UserSkill.findOne({ where: { userId, skillId } });
    if (existing) throw conflictError('skill already added', 'CONFLICT');
    await UserSkill.create({ userId, skillId });
};

// remove a skill from a user
const removeUserSkillRepository = async (userId: string, skillId: string) => {
    const deleted = await UserSkill.destroy({ where: { userId, skillId } });
    if (deleted === 0) throw notFoundError('skill not found', 'NOT_FOUND');
};

export { getAllSkillsRepository, getUserSkillsRepository, addUserSkillRepository, removeUserSkillRepository };