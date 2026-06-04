interface Skill {
  skillId: string;
  skillName: string;
}

interface GetAllSkillsResponse {
  skills: Skill[];
}

export type {Skill, GetAllSkillsResponse};