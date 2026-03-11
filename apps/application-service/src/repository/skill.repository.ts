import { Skill } from '@talentsync/models';

// fetch all skills from DB
const getAllSkillsRepository = async () => {
    try {
        const skills = await Skill.findAll({ order: [['skillName', 'ASC']] });
        return skills;
    } catch (error: unknown) {
        throw error;
    }
};

export { getAllSkillsRepository };