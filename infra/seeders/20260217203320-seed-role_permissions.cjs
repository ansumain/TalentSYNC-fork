'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    // Fetch inserted permissions and their respective IDs
    const [insertedPermissions] = await queryInterface.sequelize.query(
      `SELECT id, permission FROM auth.permissions`
    );

    // Fetch inserted roles and their respective IDs
    const [insertedRoles] = await queryInterface.sequelize.query(
      `SELECT id, role FROM auth.roles WHERE role IN ('candidate', 'interviewer', 'manager', 'admin')`
    );

    // Roles lookup map
    const roleMap = {};
    insertedRoles.forEach(r => {
      roleMap[r.role] = r.id;
    });

    // Permissions lookup map
    const permissionMap = {};
    insertedPermissions.forEach(p => {
      permissionMap[p.permission] = p.id;
    });

    // Map role-permission 
    const roleMappings = {
      candidate: [
        'user:read:own',
        'user:update:own',
        'interviews:read:assigned',
      ],
      interviewer: [
        'user:read:own',
        'user:update:own',
        'interviews:read:assigned',
        'interviews:update:assigned',
      ],
      manager: [
        'user:read:own',
        'user:update:own',
        'user:read:all',
        'interviews:create',
        'interviews:read:all',
        'interviews:update:all',
        'interviews:delete:all',
      ],
      admin: [
        'user:read:own',
        'user:update:own',
        'user:read:all',
        'user:update:all',
        'user:delete:all',
        'interviews:create',
        'interviews:read:all',
        'interviews:update:all',
        'interviews:delete:all',
        'analytics:view',
      ],
    };

    // Create role_permissions records
    const rolePermissions = [];
    for (const [roleName, permissionNames] of Object.entries(roleMappings)) {
      const roleId = roleMap[roleName];
      for (const permissionName of permissionNames) {
        const permissionId = permissionMap[permissionName];
        rolePermissions.push({
          id: Sequelize.literal('gen_random_uuid()'),
          roleId,
          permissionId,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    // Insert all created role_permissions in bulk to DB
    await queryInterface.bulkInsert(
      { tableName: 'role_permissions', schema: 'auth' },
      rolePermissions
    );
    
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      { tableName: 'role_permissions', schema: 'auth' }
    );
  }
};
