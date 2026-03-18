type UserRole = 'candidate' | 'interviewer' | 'manager' | 'admin'

// Roles module type - represents the structure of imported roles constants
interface RolesModule {
  UPLOAD_ROLES: UserRole[];
  CANDIDATE_ROLES: UserRole[];
  JOB_ROLES: UserRole[];
  APPLICATIONS_ROLES: UserRole[];
  INTERVIEWS_ROLES: UserRole[];
  ANALYTICS_ROLES: UserRole[];
  ADMIN_ROLES: UserRole[];
  [key: string]: UserRole[];
}

// App routes type configuration
interface AppRoutesConfig {
  path: string;
  label: string;
  roles?: UserRole[];
  isPublic?: boolean;
}


export type {
  UserRole,
  RolesModule,
  AppRoutesConfig
}