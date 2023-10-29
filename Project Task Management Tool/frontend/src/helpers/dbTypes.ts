export type Issue = {
    title: string;
    description: string;
    assignee: string;
    reporter: string;
    priority: string;
    status: IssueStatus;
    due: string;
    issueID: string;
};

export type IssueStatus = 'TO DO' | 'IN PROGRESS' | 'DONE';
