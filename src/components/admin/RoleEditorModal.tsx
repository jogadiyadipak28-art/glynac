"use client";

import { useMemo, useState } from "react";
import { MODULES, PERMISSIONS, ROLES, type Permission, type Role, type User, type UserStatus } from "@/lib/types";
import { defaultPermissionsForRole } from "@/lib/store";

export function RoleEditorModal({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (patch: Pick<User, "role" | "status" | "permissions">) => void;
}) {
  const [role, setRole] = useState<Role>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [permissions, setPermissions] = useState(user.permissions);

  function togglePermission(module: keyof User["permissions"], permission: Permission) {
    setPermissions((prev) => {
      const current = prev[module];
      const next = current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission];
      return { ...prev, [module]: next };
    });
  }

  function applyRole(next: Role) {
    setRole(next);
    setPermissions(defaultPermissionsForRole(next));
  }

  const dirty = useMemo(
    () =>
      role !== user.role ||
      status !== user.status ||
      JSON.stringify(permissions) !== JSON.stringify(user.permissions),
    [permissions, role, status, user]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Role editor</p>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-2 py-1 text-sm"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Role
            <select
              value={role}
              onChange={(e) => applyRole(e.target.value as Role)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
            >
              {ROLES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
            >
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </label>
        </div>

        <p className="mt-5 text-sm font-medium">Granular permissions</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted">
                <th className="py-2">Module</th>
                {PERMISSIONS.map((permission) => (
                  <th key={permission} className="py-2">
                    {permission}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((module) => (
                <tr key={module.key} className="border-t border-border">
                  <td className="py-2.5">{module.label}</td>
                  {PERMISSIONS.map((permission) => (
                    <td key={permission}>
                      <input
                        type="checkbox"
                        checked={permissions[module.key].includes(permission)}
                        onChange={() => togglePermission(module.key, permission)}
                        aria-label={`${module.label} ${permission}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => onSave({ role, status, permissions })}
            className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-teal-500 dark:text-slate-950"
          >
            Save permissions
          </button>
        </div>
      </div>
    </div>
  );
}
