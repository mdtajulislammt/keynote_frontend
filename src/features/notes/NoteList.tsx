import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchNotesThunk, createNoteThunk, updateNoteThunk, deleteNoteThunk } from './notesThunks';
import { NoteCard } from './NoteCard';
import { NoteFormModal, NoteFormData } from './NoteFormModal';
import { PaginationControl } from '@/components/common/PaginationControl';
import { SearchBar } from '@/components/common/SearchBar';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/ui/Button';
import { Note } from '@/types/note.types';
import { Plus, FileText, Sparkles } from 'lucide-react';

export interface NoteListProps {
  isAdminView?: boolean;
}

export const NoteList: React.FC<NoteListProps> = ({ isAdminView = false }) => {
  const dispatch = useAppDispatch();
  const { notes, meta, isLoading } = useAppSelector((state) => state.notes);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Confirm delete dialog state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchNotesThunk({ page, limit, isAdmin: isAdminView }));
  }, [dispatch, page, limit, isAdminView]);

  const handleCreateOrUpdate = async (data: NoteFormData) => {
    if (editingNote) {
      await dispatch(updateNoteThunk({ id: editingNote._id, payload: data }));
    } else {
      await dispatch(createNoteThunk(data));
      setPage(1);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    await dispatch(deleteNoteThunk(deleteTargetId));
    setIsDeleting(false);
    setDeleteTargetId(null);
  };

  // Client search filter across current paginated list
  const filteredNotes = notes.filter((n) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const titleMatch = n.title.toLowerCase().includes(term);
    const contentMatch = n.content.toLowerCase().includes(term);
    return titleMatch || contentMatch;
  });

  return (
    <div className="space-y-7">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isAdminView ? 'Global Notes Feed (Admin)' : 'My Encrypted Notes'}
            </h1>
            {!isAdminView && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Zero-Knowledge
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdminView
              ? 'View all encrypted notes created across the entire platform with pagination'
              : 'Manage and search your private notes stored with compound-index query optimization'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search notes..."
            className="w-full sm:w-64"
          />

          {!isAdminView && (
            <Button
              size="sm"
              onClick={() => {
                setEditingNote(null);
                setIsModalOpen(true);
              }}
              className="gap-2 shrink-0 font-semibold shadow-md shadow-emerald-700/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Note</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {isLoading && notes.length === 0 ? (
        <Loader text="Fetching secure notes..." />
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={searchTerm ? 'No matching notes found' : 'No notes created yet'}
          description={
            searchTerm
              ? `No notes match your query "${searchTerm}". Try another search term.`
              : 'You haven’t created any notes yet. Create your first note to get started!'
          }
          actionLabel={!isAdminView && !searchTerm ? 'Create First Note' : undefined}
          onAction={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              isAdminView={isAdminView}
              onEdit={
                !isAdminView
                  ? (n) => {
                      setEditingNote(n);
                      setIsModalOpen(true);
                    }
                  : undefined
              }
              onDelete={!isAdminView ? (id) => setDeleteTargetId(id) : undefined}
            />
          ))}
        </div>
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

      {/* Note Form Modal */}
      <NoteFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingNote}
        isLoading={isLoading}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action is permanent and cannot be undone."
        confirmLabel="Delete Note"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};
