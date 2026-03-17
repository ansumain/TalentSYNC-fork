import { Applicaiton } from "../types/Application.type";
import { JobApplication, Job, JobSkill, Skill, UserSkill, ResumeData } from '@talentsync/models';
import { ApplicationWithJob, EnrichedApplication, RankedApplicant } from "../types/JobApplication.type";
import { badRequestError, conflictError, notFoundError } from "@talentsync/types";

// checks and updates jobApplication status to 'shortlisted' 
// when candidate skills match against job required skills
const updateInitialStatusForApplication = async (userId: string, jobId: string): Promise<string> => {
    const jobSkillRows = await JobSkill.findAll({ where: { jobId }, attributes: ['skillId'], raw: true });
    const jobSkillIds = (jobSkillRows as { skillId: string }[]).map((r) => r.skillId);

    if (jobSkillIds.length === 0) return 'applied';

    const jobSkillNames: string[] = [];
    for (const skillId of jobSkillIds) {
        const skill = await Skill.findOne({ where: { skillId }, attributes: ['skillName'] });
        if (skill) jobSkillNames.push((skill.toJSON() as { skillName: string }).skillName);
    }

    const candidateSkillRows = await UserSkill.findAll({ where: { userId }, attributes: ['skillId'], raw: true });
    const candidateSkillIds = (candidateSkillRows as { skillId: string }[]).map((r) => r.skillId);

    if (candidateSkillRows.length === 0) return 'applied';

    const candidateSkillNames: string[] = [];
    for (const skillId of candidateSkillIds) {
        const skill = await Skill.findOne({ where: { skillId }, attributes: ['skillName'] });
        if (skill) candidateSkillNames.push((skill.toJSON() as { skillName: string }).skillName);
    }

    const requiredToMatch = Math.floor(jobSkillNames.length / 2);
    let matchCount = 0;
    jobSkillNames.forEach(jobSkill => {
        if (candidateSkillNames.includes(jobSkill)) matchCount++;
    });

    const newStatus = matchCount >= requiredToMatch ? 'shortlisted' : 'applied';
    return newStatus;
};

// add job application
const addApplicationRepository = async (application: Applicaiton) => {
    try {
        // Check if user has a completed resume before allowing application
        const resume = await ResumeData.findOne({ where: { userId: application.userId, status: 'completed' } });
        if (!resume) throw notFoundError('no resume found, please upload your resume before applying', 'NOT_FOUND');

        // check existing application
        const existingApplication = await JobApplication.findAll({ where: { ...application } });
        if (existingApplication.length > 0) throw conflictError('application already exists', 'CONFLICT');

        // run skill matching to determine initial status : shortlisted or applied
        const initialStatus = await updateInitialStatusForApplication(application.userId, application.jobId);
        const newJob = await JobApplication.create({ ...application, currentStatus: initialStatus });
        return newJob;
    } catch (error: unknown) {
        throw error;
    }
};

// get all job applicatios
const getAllApplicationsRepository = async (params: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}): Promise<{ data: EnrichedApplication[]; total: number; page: number; limit: number; totalPages: number }> => {
    try {
        const { page, limit, sortOrder, sortBy, search } = params;
        const isComputedSort = sortBy === 'candidateName' || sortBy === 'jobTitle';

        const enrich = async (apps: any[]): Promise<EnrichedApplication[]> =>
            Promise.all(
                apps.map(async (app) => {
                    const [job, resume] = await Promise.all([
                        Job.findOne({ where: { jobId: app.jobId }, attributes: ['title'] }),
                        ResumeData.findOne({
                            where: { userId: app.userId, status: 'completed' },
                            order: [['createdAt', 'DESC']],
                            attributes: ['parsedJSON'],
                        }),
                    ]);
                    const parsedJSON = resume?.parsedJSON as { name?: string } | null;
                    return {
                        ...app.toJSON(),
                        jobTitle: job ? (job.toJSON() as { title: string }).title : null,
                        candidateName: parsedJSON?.name ?? null,
                    } as EnrichedApplication;
                })
            );

        if (isComputedSort || search) {
            const allRows = await JobApplication.findAll({ order: [['createdAt', 'DESC']] });
            let enriched = await enrich(allRows);

            if (search) {
                const term = search.toLowerCase();
                enriched = enriched.filter(
                    (a) =>
                        a.candidateName?.toLowerCase().includes(term) ||
                        a.jobTitle?.toLowerCase().includes(term)
                );
            }

            enriched.sort((a, b) => {
                const aVal = (sortBy === 'candidateName' ? a.candidateName : a.jobTitle) ?? '';
                const bVal = (sortBy === 'candidateName' ? b.candidateName : b.jobTitle) ?? '';
                const cmp = aVal.localeCompare(bVal);
                return sortOrder === 'ASC' ? cmp : -cmp;
            });
            const total = enriched.length;
            const offset = (page - 1) * limit;
            return { data: enriched.slice(offset, offset + limit), total, page, limit, totalPages: Math.ceil(total / limit) };
        }

        const DB_SORT_FIELDS = new Set(['createdAt', 'currentStatus', 'updatedAt']);
        const dbSortBy = DB_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';
        const offset = (page - 1) * limit;

        const { count, rows } = await JobApplication.findAndCountAll({
            order: [[dbSortBy, sortOrder]],
            limit,
            offset,
        });

        const enriched = await enrich(rows as any[]);
        return {
            data: enriched,
            total: count as unknown as number,
            page,
            limit,
            totalPages: Math.ceil((count as unknown as number) / limit),
        };
    } catch (error: unknown) {
        throw error;
    }
};

// get application by Id
const getApplicationByIdRepository = async (applicationId: string) => {
    try {
        const applicaiton = await JobApplication.findOne({ where: { applicationId } });
        if (!applicaiton) throw notFoundError('application not found', 'NOT_FOUND');
        return applicaiton;
    } catch (error: unknown) {
        throw error;
    }
}

// get applications by job Id
const getApplicationsByJobIdRepository = async (jobId: string) => {
    try {
        const applications = await JobApplication.findAll({ where: { jobId } });
        if (!applications) throw notFoundError('applications not found', 'NOT_FOUND');
        return applications;
    } catch (error: unknown) {
        throw error;
    }
}

// update application current status: applied -> shortlisted
const updateApplicationCurrentStatusRepository = async (applicationId: string, currentStatus: string) => {
    try {
        if (currentStatus !== 'shortlisted') throw badRequestError('manual status update is only allowed for shortlisting', 'BAD_REQUEST');

        const existingApplication = await JobApplication.findOne({ where: { applicationId } });
        if (!existingApplication) throw notFoundError('application not found', 'NOT_FOUND');

        if (existingApplication.currentStatus !== 'applied') throw badRequestError('can only shortlist an application that is in applied status', 'BAD_REQUEST');

        await JobApplication.update({ currentStatus }, { where: { applicationId } });

        return { message: 'updated' };
    } catch (error: unknown) {
        throw error;
    }
};




// delete application
const deleteExistingApplicationRepository = async (applicationId: string) => {
    try {
        const existingApplication = await JobApplication.findOne({ where: { applicationId } });
        if (!existingApplication) throw notFoundError('application not found', 'NOT_FOUND');

        await JobApplication.destroy({ where: { applicationId } });

        return { message: 'deleted' };
    } catch (error: unknown) {
        throw error;
    }

};

// get applications by userId
const getApplicationsByUserIdRepository = async (userId: string, params: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    search?: string;
}): Promise<{ data: ApplicationWithJob[]; total: number; page: number; limit: number; totalPages: number }> => {
    try {
        const { page, limit, sortOrder, sortBy, search } = params;
        const isComputedSort = ['jobTitle', 'jobLocation', 'jobType'].includes(sortBy);

        const enrich = async (apps: any[]): Promise<ApplicationWithJob[]> =>
            Promise.all(
                apps.map(async (app: { jobId: string; toJSON: () => Record<string, unknown> }) => {
                    const job = await Job.findOne({ where: { jobId: app.jobId }, attributes: ['jobId', 'title', 'location', 'jobType'] });
                    return { ...app.toJSON(), job: job ? (job.toJSON() as ApplicationWithJob['job']) : null } as ApplicationWithJob;
                })
            );

        if (isComputedSort || search) {
            const allRows = await JobApplication.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
            let appWithJobs = await enrich(allRows);

            if (search) {
                const term = search.toLowerCase();
                appWithJobs = appWithJobs.filter((a) =>
                    a.job?.title?.toLowerCase().includes(term)
                );
            }

            appWithJobs.sort((a, b) => {
                let aVal = '', bVal = '';
                if (sortBy === 'jobTitle') { aVal = a.job?.title ?? ''; bVal = b.job?.title ?? ''; }
                else if (sortBy === 'jobLocation') { aVal = a.job?.location ?? ''; bVal = b.job?.location ?? ''; }
                else if (sortBy === 'jobType') { aVal = a.job?.jobType ?? ''; bVal = b.job?.jobType ?? ''; }
                const cmp = aVal.localeCompare(bVal);
                return sortOrder === 'ASC' ? cmp : -cmp;
            });
            const total = appWithJobs.length;
            const offset = (page - 1) * limit;
            return { data: appWithJobs.slice(offset, offset + limit), total, page, limit, totalPages: Math.ceil(total / limit) };
        }

        const DB_SORT_FIELDS = new Set(['createdAt', 'currentStatus', 'updatedAt']);
        const dbSortBy = DB_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';
        const offset = (page - 1) * limit;

        const { count, rows } = await JobApplication.findAndCountAll({
            where: { userId },
            order: [[dbSortBy, sortOrder]],
            limit,
            offset,
        });

        const appWithJobs = await enrich(rows as any[]);
        return {
            data: appWithJobs,
            total: count as unknown as number,
            page,
            limit,
            totalPages: Math.ceil((count as unknown as number) / limit),
        };
    } catch (error: unknown) {
        throw error;
    }
};

// get ranked applicant by jobId
const getRankedApplicantsByJobIdRepository = async (jobId: string): Promise<RankedApplicant[]> => {
    try {
        const jobSkillRows = await JobSkill.findAll({
            where: { jobId },
            include: [{ model: Skill, as: 'skill', attributes: ['skillName'] }]
        });
        const requiredSkills: string[] = jobSkillRows
            .map((js: any) => js.toJSON().skill?.skillName as string | undefined)
            .filter((s): s is string => !!s);
        const requiredSkillsLower = requiredSkills.map((s) => s.toLowerCase());

        const applications = await JobApplication.findAll({ where: { jobId }, order: [['createdAt', 'DESC']] });

        const enriched = await Promise.all(
            applications.map(async (app) => {
                const appData = app.toJSON() as any;
                const resume = await ResumeData.findOne({ where: { userId: appData.userId, status: 'completed' } });
                const parsedJSON = resume ? (resume.toJSON() as any).parsedJSON : null;
                const candidateName: string | null = parsedJSON?.name ?? null;
                const candidateSkills: string[] = parsedJSON?.skills ?? [];
                const candidateSkillsLower = candidateSkills.map((s: string) => s.toLowerCase());

                const matchedSkills = requiredSkills.filter((_rs, idx) => {
                    const rsLower = requiredSkillsLower[idx];
                    return candidateSkillsLower.some(
                        (cs) => cs.includes(rsLower) || rsLower.includes(cs)
                    );
                });

                const resumeId: string | null = resume ? (resume.toJSON() as any).id ?? null : null;

                return {
                    applicationId: appData.applicationId as string,
                    userId: appData.userId as string,
                    resumeId,
                    currentStatus: appData.currentStatus as string,
                    appliedAt: appData.createdAt as Date | string,
                    candidateName,
                    candidateSkills,
                    matchedSkills,
                    matchCount: matchedSkills.length,
                    rank: 0,
                } satisfies Omit<RankedApplicant, 'rank'> & { rank: number };
            })
        );

        enriched.sort((a, b) => b.matchCount - a.matchCount || new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime());
        enriched.forEach((r, i) => { r.rank = i + 1; });

        return enriched as RankedApplicant[];
    } catch (error: unknown) {
        throw error;
    }
};

// candidate accepts or rejects a job offer (only allowed when application status is 'selected')
const acceptOrRejectOfferRepository = async (applicationId: string, userId: string, action: 'accept' | 'reject') => {
    try {
        const application = await JobApplication.findOne({ where: { applicationId, userId } });
        if (!application) throw notFoundError('application not found', 'NOT_FOUND');

        if (application.currentStatus !== 'selected') {
            throw badRequestError('not a offer can\'t be responded', 'BAD_REQUEST');
        }

        const newStatus = action === 'accept' ? 'hired' : 'offerRejected';
        await JobApplication.update({ currentStatus: newStatus }, { where: { applicationId } });

        return { message: action === 'accept' ? 'Offer Accepted!' : 'Offer Rejected!' };
    } catch (error: unknown) {
        throw error;
    }
};

export {
    addApplicationRepository,
    getAllApplicationsRepository,
    getApplicationByIdRepository,
    getApplicationsByJobIdRepository,
    getApplicationsByUserIdRepository,
    updateApplicationCurrentStatusRepository,
    deleteExistingApplicationRepository,
    getRankedApplicantsByJobIdRepository,
    acceptOrRejectOfferRepository,
}