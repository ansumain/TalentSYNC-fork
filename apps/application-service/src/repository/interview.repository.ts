import { Interview, User, UserRole, JobApplication, JobSkill, Skill, UserSkill } from '@talentsync/models';
import { CreateInterview } from "../types/CreateInterview.type";
import { Op } from 'sequelize';

// get all interviewers
const getAvailableInterviewersRepository = async () => {
    try {

        const INTERVIEWER_ROLE_ID = '5ea54499-ef54-40aa-b673-c716547e0522';
        const allInterviewers = await User.findAll({
            include: [{
                model: UserRole,
                where: { roleId: INTERVIEWER_ROLE_ID },
                attributes: []
            }],
            raw: true
        });

        return allInterviewers;
    } catch (error: any) {
        throw error;
    }
};

// get number of interviews of an interviewer for a given day
const getDatedInterviewCountRepository = async (interviewerId: string, date: string) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const numberOfInterviews = await Interview.count({ where: { interviewerId, scheduledAt: { [Op.between]: [startOfDay, endOfDay] } } });
    console.log('interview count', numberOfInterviews);
    return numberOfInterviews;
}

// check if the interviewer is eligible for the interview
const checkInterviewerEligibilityRepository = async (interviewerId: string, applicationId: string) => {

    const { jobId } = (await JobApplication.findOne({ where: { applicationId }, attributes: ['jobId'], raw: true })) as { jobId: string };

    const jobSkillIds = await JobSkill.findAll({ where: { jobId }, attributes: ['skillId'], raw: true });

    let jobSkillIdArray: string[] = [];
    jobSkillIds.forEach(jobSkillId => jobSkillIdArray.push(jobSkillId.skillId));

    let jobSkills: string[] = [];
    for (const skillId of jobSkillIdArray) {
        const { skillName } = (await Skill.findOne({ where: { skillId }, attributes: ['skillName'] })) as { skillName: string };
        jobSkills.push(skillName);
    }

    const interviewerSkillIds = await UserSkill.findAll({ where: { userId: interviewerId }, attributes: ['skillId'], raw: true });

    let interviewerSkillIdArray: string[] = [];
    interviewerSkillIds.forEach(interviewerSkillId => interviewerSkillIdArray.push(interviewerSkillId.skillId));

    let interviewerSkills: string[] = [];
    for (const skillId of interviewerSkillIdArray) {
        const { skillName } = (await Skill.findOne({ where: { skillId }, attributes: ['skillName'] })) as { skillName: string };
        interviewerSkills.push(skillName);
    }

    const totalJobSkills: number = jobSkills.length;
    const requiredToMatch: number = Math.floor(totalJobSkills / 2);
    let matchCount: number = 0;

    jobSkills.forEach(jobSkill => { if (interviewerSkills.includes(jobSkill)) matchCount++ });

    // console.log(totalJobSkills);
    // console.log(requiredToMatch);
    // console.log(jobSkills);
    // console.log(interviewerSkills);
    // console.log(matchCount >= requiredToMatch);

    if (matchCount >= requiredToMatch) return true;
    return false;
}

// add interview
const scheduleInterviewRepository = async (newInterviewData: CreateInterview) => {
    try {
        const existingApplication = await JobApplication.findOne({ where: { applicationId: newInterviewData.applicationId } });
        if (!existingApplication) throw new Error('application not found');

        const existingInterview = await Interview.findAll({ where: { applicationId: newInterviewData.applicationId } });
        if (existingInterview.length > 0) throw new Error('interview already exists');

        const newInterview = await Interview.create(newInterviewData);
        return newInterview;
    } catch (error: any) {
        throw error;
    }
};

// get all interivews
const getAllInterviewsRepository = async () => {
    try {
        const scheduledInterviews = await Interview.findAll();
        return scheduledInterviews;
    } catch (error: any) {
        throw error;
    }
};

// get interview by interviewId
const getInterviewByIdRepository = async (interviewId: string) => {
    try {
        const interview = await Interview.findOne({ where: { interviewId } });
        if (!interview) throw new Error('interview not found');
        return interview;
    } catch (error: any) {
        throw error;
    }
}

// get interviews by jobId
const getInterviewsByJobIdRepository = async (jobId: string) => {
    try {
        const applicationIds = await JobApplication.findAll({ where: { jobId }, attributes: ['applicationId'], raw: true });

        let applicationIdArray: string[] = []
        applicationIds.forEach(id => {
            applicationIdArray.push(id.applicationId);
        })

        const interviews = await Interview.findOne({ where: { applicationId: applicationIdArray } });
        if (!interviews) throw new Error('interview not found');

        return interviews;
    } catch (error: any) {
        throw error;
    }
}

// update interview
const updateExistingInterviewRepository = async (interviewId: string, newInterviewData: Partial<CreateInterview>) => {
    try {
        const existingInterview = await Interview.findOne({ where: { interviewId } });
        if (!existingInterview) throw new Error('interview not found');

        await Interview.update({ ...newInterviewData }, { where: { interviewId } });

        return { message: 'updated' };
    } catch (error: any) {
        throw error;
    }
};

// delete interview
const deleteExistingInterviewRepository = async (interviewId: string) => {
    try {
        const existingInterview = await Interview.findOne({ where: { interviewId } });
        if (!existingInterview) throw new Error('interview not found');

        await Interview.destroy({ where: { interviewId } });

        return { message: 'deleted' };
    } catch (error: any) {
        throw error;
    }

};

export {
    getAvailableInterviewersRepository,
    getDatedInterviewCountRepository,
    checkInterviewerEligibilityRepository,
    scheduleInterviewRepository,
    getAllInterviewsRepository,
    getInterviewByIdRepository,
    getInterviewsByJobIdRepository,
    updateExistingInterviewRepository,
    deleteExistingInterviewRepository
}