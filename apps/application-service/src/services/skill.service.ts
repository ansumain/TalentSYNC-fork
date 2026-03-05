import { getAllSkillsRepository } from '../repository/skill.repository';

const getAllSkills = async () => {
    const skills = await getAllSkillsRepository();
    return skills;
};

export { getAllSkills };