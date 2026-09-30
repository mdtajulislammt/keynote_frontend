import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from './usersApi';
import { User, UserRole } from '@/types/user.types';
import { PaginationMeta } from '@/types/api.types';
import { UserFormModal } from './UserFormModal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/common/SearchBar';
import { PaginationControl } from '@/components/common/PaginationControl';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Loader } from '@/components/common/Loader';
import { formatDate } from '@/utils/formatters';
import { Users, UserPlus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Delete Dialog states
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await usersApi.getUsers({
        page,
        limit,
        role: roleFilter || undefined,
      });
      setUsers(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      await usersApi.deleteUser(deleteTargetId);
      toast.success('User deleted successfully');
      setDeleteTargetId(null);
      loadUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-7">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            User Management (Admin)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user accounts, assign RBAC permissions, and inspect activity
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="gap-2 shrink-0 font-semibold shadow-md shadow-emerald-700/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/20 p-4 rounded-xl border border-border">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Filter by name or email..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <label className="text-sm text-foreground font-bold shrink-0">Role Filter:</label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as UserRole | '');
              setPage(1);
            }}
            className="h-10 rounded-lg border border-border bg-background px-3.5 py-1 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin Only</option>
            <option value="user">User Only</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <Loader text="Loading user directory..." />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchTerm ? 'No matching users' : 'No users found'}
          description={
            searchTerm
              ? `No user accounts matched "${searchTerm}".`
              : 'The user database is currently empty.'
          }
          actionLabel="Create User"
          onAction={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-xs uppercase tracking-wider">User Account</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">Role</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">Interests</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">Joined Date</TableHead>
              <TableHead className="text-right font-bold text-xs uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u._id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors">
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-sm sm:text-base">{u.name}</span>
                    <span className="text-xs text-muted-foreground">{u.email}</span>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <Badge variant={u.role === 'admin' ? 'admin' : 'secondary'}>
                    {u.role}
                  </Badge>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex flex-wrap gap-1.5 max-w-sm">
                    {u.interests && u.interests.length > 0 ? (
                      u.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">None</span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-xs font-medium text-muted-foreground whitespace-nowrap py-4">
                  {formatDate(u.createdAt)}
                </TableCell>

                <TableCell className="text-right py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/analytics/user-posts?userId=${u._id}`}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      title="Inspect user posts ($lookup aggregation)"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      onClick={() => {
                        setEditingUser(u);
                        setIsModalOpen(true);
                      }}
                      title="Edit User"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/40"
                      onClick={() => setDeleteTargetId(u._id)}
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination Controls */}
      <PaginationControl
        meta={meta}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        isLoading={isLoading}
      />

      {/* Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={loadUsers}
        userToEdit={editingUser}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        description="Are you sure you want to permanently delete this user? All their associated notes and posts may also be affected."
        confirmLabel="Delete User"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};
