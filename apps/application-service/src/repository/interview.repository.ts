import { Interview, User, UserRole, JobApplication, JobSkill, Skill, UserSkill } from '@talentsync/models';
import { sequelize } from '@talentsync/config';
import { CreateInterview } from "../types/CreateInterview.type";
import { Op, QueryTypes } from 'sequelize';

// get roleId for interviewer role
const getInterviewerRoleId = async (): Promise<string> => {
    const rows = await sequelize.query<{ id: string }>(
        `SELECT id FROM auth.roles WHERE role = 'interviewer'`,
        { type: QueryTypes.SELECT }
    );
    if (rows.length === 0) throw new Error('interviewer role not found in database');
    return rows[0].id;
};

// get users who have the role: 'interviewer' 
const getAvailableInterviewersRepository = async () => {
    const interviewerRoleId = await getInterviewerRoleId();
    const allInterviewers = await User.findAll({
        include: [{
            model: UserRole,
            where: { roleId: interviewerRoleId },
            attributes: []
        }],
        raw: true
    });
    return allInterviewers;
};

// get number of interviews for an interviewer on a given day
const getDatedInterviewCountRepository = async (interviewerId: string, date: string): Promise<number> => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await Interview.count({
        where: {
            interviewerId,
            scheduledAt: { [Op.between]: [startOfDay, endOfDay] },
            status: { [Op.in]: ['scheduled', 'completed'] }
        }
    });
    return count;
};

// check interviewer eligibilty for a jobApplication
const checkInterviewerEligibilityRepository = async (interviewerId: string, applicationId: string): Promise<boolean> => {
    const application = await JobApplication.findOne({ where: { applicationId }, attributes: ['jobId'], raw: true }) as { jobId: string } | null;
    if (!application) return false;

    const { jobId } = application;
    const jobSkillRows = await JobSkill.findAll({ where: { jobId }, attributes: ['skillId'], raw: true });
    const jobSkillIds = jobSkillRows.map((row: { skillId: string }) => row.skillId);

    if (jobSkillIds.length === 0) return true;

    const jobSkillNames: string[] = [];
    for (const skillId of jobSkillIds) {
        const skill = await Skill.findOne({ where: { skillId }, attributes: ['skillName'] });
        if (skill) jobSkillNames.push((skill.toJSON() as { skillName: string }).skillName);
    }

    const interviewerSkillRows = await UserSkill.findAll({ where: { userId: interviewerId }, attributes: ['skillId'], raw: true });
    const interviewerSkillIds = interviewerSkillRows.map((row: { skillId: string }) => row.skillId);

    const interviewerSkillNames: string[] = [];
    for (const skillId of interviewerSkillIds) {
        const skill = await Skill.findOne({ where: { skillId }, attributes: ['skillName'] });
        if (skill) interviewerSkillNames.push((skill.toJSON() as { skillName: string }).skillName);
    }

    const requiredToMatch = Math.floor(jobSkillNames.length / 2);
    let matchCount = 0;
    jobSkillNames.forEach(jobSkill => { if (interviewerSkillNames.includes(jobSkill)) matchCount++; });

    return matchCount >= requiredToMatch;
};

// schedule a new interview + auto-update application status to interviewing
const scheduleInterviewRepository = async (newInterviewData: CreateInterview) => {
    const existingApplication = await JobApplication.findOne({ where: { applicationId: newInterviewData.applicationId } });
    if (!existingApplication) throw new Error('application not found');

    if (existingApplication.currentStatus !== 'shortlisted') {
        throw new Error('can only schedule interview for shortlisted applications');
    }

    const existingInterview = await Interview.findOne({ where: { applicationId: newInterviewData.applicationId } });
    if (existingInterview) throw new Error('interview already exists for this application');

    const newInterview = await Interview.create(newInterviewData);

    // update application status to interviewing
    await JobApplication.update({ currentStatus: 'interviewing' }, { where: { applicationId: newInterviewData.applicationId } });

    return newInterview;
};

// get all interviews
const getAllInterviewsRepository = async () => {
    const interviews = await Interview.findAll();
    if (!interviews) throw new Error('interviews not found');
    return interviews;
};

// get interview by interviewId
const getInterviewByIdRepository = async (interviewId: string) => {
    const interview = await Interview.findOne({ where: { interviewId } });
    if (!interview) throw new Error('interview not found');
    return interview;
};

// get all interviews for a given jobId
const getInterviewsByJobIdRepository = async (jobId: string) => {
    const applicationRows = await JobApplication.findAll({ where: { jobId }, attributes: ['applicationId'], raw: true });
    const applicationIds = applicationRows.map((row: { applicationId: string }) => row.applicationId);

    if (applicationIds.length === 0) return [];

    const interviews = await Interview.findAll({ where: { applicationId: { [Op.in]: applicationIds } } });
    return interviews;
};

// get all interviews for a candidate (via their applications)
const getCandidateInterviewsRepository = async (userId: string) => {
    const applicationRows = await JobApplication.findAll({
        where: { userId },
        attributes: ['applicationId'],
        raw: true
    });
    const applicationIds = applicationRows.map((row: { applicationId: string }) => row.applicationId);

    if (applicationIds.length === 0) return [];

    const interviews = await Interview.findAll({ where: { applicationId: { [Op.in]: applicationIds } } });
    return interviews;
};

// get all interviews assigned to a specific interviewer
const getAssignedInterviewsRepository = async (interviewerId: string) => {
    // const interviews = await Interview.findAll({ where: { interviewerId } });
    const interviews = await Interview.findAll({ where: { interviewerId }, raw: true });
    return interviews;
};

// update interview details
const updateExistingInterviewRepository = async (interviewId: string, updateData: Partial<CreateInterview> & { status?: string }) => {
    const existingInterview = await Interview.findOne({ where: { interviewId } });
    if (!existingInterview) throw new Error('interview not found');

    if (existingInterview.status === 'completed') throw new Error('cannot update a completed interview');

    // rescheduling - only allowed from cancelled state
    if (updateData.status === 'scheduled' && existingInterview.status !== 'cancelled') {
        throw new Error('can only reschedule a cancelled interview');
    }

    await Interview.update({ ...updateData }, { where: { interviewId } });

    // sync application status when interview status changes
    if (updateData.status === 'scheduled') {
        await JobApplication.update({ currentStatus: 'interviewing' }, { where: { applicationId: existingInterview.applicationId } });
    } else if (updateData.status === 'noshow') {
        await JobApplication.update({ currentStatus: 'shortlisted' }, { where: { applicationId: existingInterview.applicationId } });
    }

    return { message: 'interview updated' };
};

// submit interview result + status: completed + update respective jobApplication status
const submitInterviewResultRepository = async (interviewId: string, result: 'passed' | 'failed') => {
    const interview = await Interview.findOne({ where: { interviewId } });
    if (!interview) throw new Error('interview not found');

    if (interview.status !== 'scheduled') throw new Error('can only submit result for a scheduled interview');

    // update application status based on result: passed -> selected & failed -> rejected
    const applicationStatus = result === 'passed' ? 'selected' : 'rejected';

    await Interview.update({ result, status: 'completed' }, { where: { interviewId } });
    await JobApplication.update({ currentStatus: applicationStatus }, { where: { applicationId: interview.applicationId } });

    return { message: `Interview completed. Application status updated to ${applicationStatus}.` };
};

// cancel an interview
const cancelInterviewRepository = async (interviewId: string) => {
    const interview = await Interview.findOne({ where: { interviewId } });
    if (!interview) throw new Error('interview not found');

    if (interview.status === 'completed') throw new Error('cannot cancel a completed interview');
    if (interview.status === 'cancelled') throw new Error('interview is already cancelled');

    await Interview.update({ status: 'cancelled' }, { where: { interviewId } });

    // update application to shortlisted - not interviewed
    await JobApplication.update({ currentStatus: 'shortlisted' }, { where: { applicationId: interview.applicationId } });

    return { message: 'interview cancelled' };
};

// delete an interview
const deleteExistingInterviewRepository = async (interviewId: string) => {
    const existingInterview = await Interview.findOne({ where: { interviewId } });
    if (!existingInterview) throw new Error('interview not found');

    // prevent deletion of completed interviews
    if (existingInterview.status === 'completed') {
        throw new Error('cannot delete a completed interview');
    }

    if (existingInterview.status === 'scheduled' || existingInterview.status === 'noshow') {
        await JobApplication.update({ currentStatus: 'shortlisted' }, { where: { applicationId: existingInterview.applicationId } });
    }

    await Interview.destroy({ where: { interviewId } });

    return { message: 'deleted' };
};

export {
    getAvailableInterviewersRepository,
    getDatedInterviewCountRepository,
    checkInterviewerEligibilityRepository,
    scheduleInterviewRepository,
    getAllInterviewsRepository,
    getInterviewByIdRepository,
    getInterviewsByJobIdRepository,
    getAssignedInterviewsRepository,
    getCandidateInterviewsRepository,
    updateExistingInterviewRepository,
    submitInterviewResultRepository,
    cancelInterviewRepository,
    deleteExistingInterviewRepository,
};