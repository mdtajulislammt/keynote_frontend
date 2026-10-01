import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchNotesThunk, createNoteThunk, updateNoteThunk, deleteNoteThunk } from './notesThunks';
import { NoteCard } from './NoteCard';
import { NoteFormModal, NoteFormData } from './NoteFormModal';
import { NoteDetailsModal } from './NoteDetailsModal';
import { PaginationControl } from '@/components/common/PaginationControl';
import { SearchBar } from '@/components/common/SearchBar';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/ui/Button';
import { Note } from '@/types/note.types';
import { Plus, FileText } from 'lucide-react';

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
  const [selectedDetailNote, setSelectedDetailNote] = useState<Note | null>(null);

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
    <div className="space-y-6 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isAdminView ? 'All Notes (Admin)' : 'My Notes'}
            </h1>
            {!isAdminView && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <FileText className="w-3 h-3 text-emerald-600" />
                Workspace
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdminView
              ? 'View all notes created across the entire platform'
              : 'Create, organize, and search your personal notes.'}
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
              className="gap-1.5 shrink-0 font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </Button>
          )}
        </div>
      </div>

      {/* Inline Quick-Create Bar for Notes */}
      {!isAdminView && !searchTerm && (
        <div
          onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
          className="cursor-pointer rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs hover:border-emerald-500/40 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Plus className="w-4 h-4" />
            </div>
            <div className="flex-1 rounded-lg bg-muted/50 border border-border/60 px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Take a quick note or write down an idea...
            </div>
            <Button size="sm" className="hidden sm:flex h-8 px-3 text-xs gap-1">
              <span>Create Note</span>
            </Button>
          </div>
        </div>
      )}

      {/* Content Area */}
      {isLoading && notes.length === 0 ? (
        <Loader text="Loading your notes..." />
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={searchTerm ? 'No matching notes found' : 'No notes created yet'}
          description={
            searchTerm
              ? `No notes match your query "${searchTerm}". Try another search term.`
              : 'You have not created any notes yet. Create your first note to get started!'
          }
          actionLabel={!isAdminView && !searchTerm ? 'Create First Note' : undefined}
          onAction={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              isAdminView={isAdminView}
              onClick={(n) => setSelectedDetailNote(n)}
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

      {/* Note Details Popup Modal */}
      <NoteDetailsModal
        note={selectedDetailNote}
        isOpen={Boolean(selectedDetailNote)}
        onClose={() => setSelectedDetailNote(null)}
        onEdit={
          !isAdminView
            ? (n) => {
                setSelectedDetailNote(null);
                setEditingNote(n);
                setIsModalOpen(true);
              }
            : undefined
        }
        onDelete={
          !isAdminView
            ? (id) => {
                setSelectedDetailNote(null);
                setDeleteTargetId(id);
              }
            : undefined
        }
        isAdminView={isAdminView}
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
