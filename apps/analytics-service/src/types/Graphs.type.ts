interface SkillCount {
    skill: string;
    count: number;
}

interface GraphData {
    date: string;
    skills: SkillCount[];
}

interface Graphs {
    barGraph: GraphData[];
}

export type { Graphs };