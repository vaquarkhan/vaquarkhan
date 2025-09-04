export type ProjectManagementProvider = 'Jira' | 'Asana' | 'Monday';
export type VersionControlProvider = 'GitHub' | 'GitLab' | 'Bitbucket';
export type AiAssistantProvider = 'Copilot' | 'AmazonQ' | 'CustomAI';
export type CloudProvider = 'AWS' | 'Azure' | 'GCP';
export type LogProvider = 'CloudWatch' | 'Datadog' | 'Splunk' | 'NewRelic';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdDate: Date;
  lastModified: Date;
  stories: Story[];
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  projects: Project[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: 'backlog' | 'in-progress' | 'done';
  type: 'story' | 'bug';
  points: number;
  creationDate: Date;
  completionDate: Date | null;
  originalLog?: string;
  architecture?: string;
  code?: string;
  codeFix?: string;
  githubCheckedIn: boolean; 
  testResults?: string;
  deploymentUrl?: string;
  projectId: string;
}

export interface IncidentAnalysisState {
    log: string;
    analysis?: string;
    resolution?: {
        title: string;
        solution: string;
        suggestedCodeFix: string;
    };
}

export interface ConnectorConfig {
    provider: string;
    url?: string;
    apiKey?: string;
    token?: string;
    username?: string;
    password?: string;
    region?: string;
    projectId?: string;
    workspace?: string;
    [key: string]: string | undefined;
}