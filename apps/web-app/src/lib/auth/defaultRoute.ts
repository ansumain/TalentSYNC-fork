const ROLE_ROUTE_PRIORITY = ['admin', 'manager', 'interviewer', 'candidate'] as const;

const DEFAULT_ROUTE_BY_ROLE: Record<(typeof ROLE_ROUTE_PRIORITY)[number], string> = {
  admin: '/analytics',
  manager: '/analytics',
  interviewer: '/my-interviews',
  candidate: '/job-board',
};

export function getDefaultRouteForRoles(roles: string[] | undefined): string {
  if (!roles || roles.length === 0) {
    return '/signin';
  }

  const normalizedRoles = new Set(roles.map((role) => role.toLowerCase()));
  for (const role of ROLE_ROUTE_PRIORITY) {
    if (normalizedRoles.has(role)) {
      return DEFAULT_ROUTE_BY_ROLE[role];
    }
  }

  return '/signin';
}