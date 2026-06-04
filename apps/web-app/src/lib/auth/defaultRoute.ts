const ROLE_ROUTE_PRIORITY = ['admin', 'manager', 'interviewer', 'candidate'] as const;

const DEFAULT_ROUTE_BY_ROLE: Record<(typeof ROLE_ROUTE_PRIORITY)[number], string> = {
  admin: '/analytics',
  manager: '/analytics',
  interviewer: '/my-interviews',
  candidate: '/job-board',
};

function normalizeRole(role: string): string {
  return role.trim().toLowerCase();
}

function getPrimaryRole(roles: string[] | undefined): (typeof ROLE_ROUTE_PRIORITY)[number] | undefined {
  if (!roles || roles.length === 0) {
    return undefined;
  }

  const normalizedRoles = new Set(
    roles
      .map(normalizeRole)
      .filter((role) => role.length > 0)
  );

  for (const role of ROLE_ROUTE_PRIORITY) {
    if (normalizedRoles.has(role)) {
      return role;
    }
  }

  return undefined;
}

function getDefaultRouteForRoles(roles: string[] | undefined): string {
  if (!roles) {
    return '/unauthorized';
  }

  const primaryRole = getPrimaryRole(roles);
  if (primaryRole) {
    return DEFAULT_ROUTE_BY_ROLE[primaryRole];
  }

  return '/unauthorized';
}

export { getPrimaryRole, getDefaultRouteForRoles };