import { Skill } from '@talentsync/models';

const getAllSkillsRepository = async () => {
    try {
        const skills = await Skill.findAll({ order: [['skillName', 'ASC']] });
        return skills;
    } catch (error: any) {
        throw error;
    }
};

export { getAllSkillsRepository };