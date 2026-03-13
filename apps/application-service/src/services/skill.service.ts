import { getAllSkillsRepository, getUserSkillsRepository, addUserSkillRepository, removeUserSkillRepository } from '../repository/skill.repository';

// get all skills
const getAllSkills = async () => {
    const skills = await getAllSkillsRepository();
    return skills;
};

// get skills for a specific user
const getUserSkills = async (userId: string) => {
    return getUserSkillsRepository(userId);
};

// add a skill to a user
const addUserSkill = async (userId: string, skillId: string) => {
    await addUserSkillRepository(userId, skillId);
};

// remove a skill from a user
const removeUserSkill = async (userId: string, skillId: string) => {
    await removeUserSkillRepository(userId, skillId);
};

export { getAllSkills, getUserSkills, addUserSkill, removeUserSkill };