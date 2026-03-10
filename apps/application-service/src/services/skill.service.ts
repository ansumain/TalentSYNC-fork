import { getAllSkillsRepository } from '../repository/skill.repository';

// get all skills
const getAllSkills = async () => {
    const skills = await getAllSkillsRepository();
    return skills;
};

export { getAllSkills };