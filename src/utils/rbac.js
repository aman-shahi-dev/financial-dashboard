export const ROLES = {
  ADMIN: "admin",
  VIEWER: "viewer",
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    canAddTransaction: true,
    canEditTransaction: true,
    canDeleteTransaction: true,
    canExportData: true,
    canSwitchRole: true,
  },
  [ROLES.VIEWER]: {
    canAddTransaction: false,
    canEditTransaction: false,
    canDeleteTransaction: false,
    canExportData: true,
    canSwitchRole: true,
  },
};

export const can = (role, permission) => {
  return PERMISSIONS[role]?.[permission] ?? false;
};
