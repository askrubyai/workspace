import { useState, useEffect, useCallback, useRef } from 'react';
import type { PipelineCard, PipelineData, PipelineBoard } from '../types';

const API = '';

// ─── Card Component ───────────────────────────────────────────────────────────

function KanbanCard({
  card,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  card: PipelineCard;
  onDragStart: (card: PipelineCard) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  const assigneeColor = card.assignee === 'Ruby'
    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    : 'bg-blue-500/20 text-blue-300 border-blue-500/30';

  return (
    <div
      draggable
      onDragStart={() => onDragStart(card)}
      onDragEnd={onDragEnd}
      className={`bg-surface-2 border rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all group select-none ${
        isDragging
          ? 'opacity-30 border-accent'
          : 'border-border hover:border-accent/50 hover:bg-surface-3'
      }`}
    >
      {/* Title */}
      <div className="text-sm font-medium text-text-primary leading-snug mb-2 group-hover:text-accent transition-colors">
        {card.title}
      </div>

      {/* Preview */}
      {card.preview && (
        <div className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-2">
          {card.preview}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap mt-1">
        <div className="flex items-center gap-1.5">
          {/* Assignee */}
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${assigneeColor}`}>
            {card.assignee === 'Ruby' ? '💎' : '👤'} {card.assignee}
          </span>

          {/* Thread status */}
          {card.threadFile && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
              card.threadExists
                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                : 'bg-surface-3 text-text-muted border-border'
            }`}>
              {card.threadExists ? '🐦 thread ✓' : '🐦 no thread'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Date */}
          {card.date && (
            <span className="text-[10px] text-text-muted font-mono">
              {card.date}
            </span>
          )}
          {/* Cron date */}
          {card.cronDate && (
            <span className="text-[10px] bg-warning/20 text-warning border border-warning/30 px-1.5 py-0.5 rounded-full font-medium">
              ⏰ {card.cronDate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stage Column ─────────────────────────────────────────────────────────────

function StageColumn({
  stage,
  cards,
  onDragStart,
  onDragEnd,
  onDrop,
  dragOverStage,
  setDragOverStage,
  draggingCard,
}: {
  stage: string;
  cards: PipelineCard[];
  onDragStart: (card: PipelineCard) => void;
  onDragEnd: () => void;
  onDrop: (stage: string) => void;
  dragOverStage: string | null;
  setDragOverStage: (s: string | null) => void;
  draggingCard: PipelineCard | null;
}) {
  const stageColors: Record<string, string> = {
    'Idea': 'border-t-slate-400',
    'Research': 'border-t-blue-400',
    'Draft': 'border-t-yellow-400',
    'Editorial Review': 'border-t-orange-400',
    'Published': 'border-t-green-400',
    'Thread Ready': 'border-t-purple-400',
    'Deployed': 'border-t-emerald-400',
    'Ready': 'border-t-teal-400',
    'Posted': 'border-t-cyan-400',
  };

  const topColor = stageColors[stage] || 'border-t-accent';
  const isOver = dragOverStage === stage;

  return (
    <div
      className={`flex flex-col rounded-xl border-t-2 border border-border bg-surface-1 min-h-[200px] transition-all ${topColor} ${isOver ? 'ring-1 ring-accent bg-surface-2' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragOverStage(stage); }}
      onDragLeave={() => setDragOverStage(null)}
      onDrop={() => { onDrop(stage); setDragOverStage(null); }}
    >
      {/* Column header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{stage}</span>
        <span className="text-xs text-text-muted bg-surface-2 px-1.5 py-0.5 rounded-full">
          {cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="p-2 flex flex-col gap-2 flex-1">
        {cards.map(card => (
          <KanbanCard
            key={card.id}
            card={card}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggingCard?.id === card.id}
          />
        ))}

        {/* Drop zone */}
        {isOver && draggingCard && draggingCard.stage !== stage && (
          <div className="border-2 border-dashed border-accent rounded-lg p-3 text-center text-xs text-accent opacity-70">
            Drop here → {stage}
          </div>
        )}

        {cards.length === 0 && !isOver && (
          <div className="text-center py-4 text-xs text-text-muted opacity-50">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Add Card Modal ───────────────────────────────────────────────────────────

function AddCardModal({
  board,
  stages,
  onAdd,
  onClose,
}: {
  board: 'askrubyai' | 'reubence';
  stages: string[];
  onAdd: (card: Partial<PipelineCard>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [stage, setStage] = useState(stages[0]);
  const [assignee, setAssignee] = useState(board === 'askrubyai' ? 'Ruby' : 'Reuben');
  const [date, setDate] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await onAdd({ title: title.trim(), preview: preview.trim(), stage, assignee, date });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-1 border border-border rounded-xl p-5 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">Add New Card</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1">Title *</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={board === 'askrubyai' ? 'Day 13: GTC Paper Run 3' : 'something lowercase and punchy'}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs text-text-muted font-medium block mb-1">Preview / Tagline</label>
            <textarea
              value={preview}
              onChange={e => setPreview(e.target.value)}
              placeholder="Short description or hook..."
              rows={2}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted font-medium block mb-1">Stage</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              >
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1">Assignee</label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="Ruby">Ruby</option>
                <option value="Reuben">Reuben</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted font-medium block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="flex-1 py-2 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Adding…' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Board View ───────────────────────────────────────────────────────────────

function Board({
  boardKey,
  board,
  onUpdate,
}: {
  boardKey: 'askrubyai' | 'reubence';
  board: PipelineBoard;
  onUpdate: (updated: PipelineBoard) => void;
}) {
  const [draggingCard, setDraggingCard] = useState<PipelineCard | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDrop = (targetStage: string) => {
    if (!draggingCard || draggingCard.stage === targetStage) return;
    const updated: PipelineBoard = {
      ...board,
      cards: board.cards.map(c =>
        c.id === draggingCard.id ? { ...c, stage: targetStage } : c
      ),
    };
    onUpdate(updated);
    setDraggingCard(null);
    setDragOverStage(null);
  };

  const handleAddCard = async (card: Partial<PipelineCard>) => {
    try {
      const r = await fetch(`${API}/api/content/pipeline/card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: boardKey, card }),
      });
      const d = await r.json();
      if (d.ok) {
        const updated: PipelineBoard = {
          ...board,
          cards: [...board.cards, d.card],
        };
        onUpdate(updated);
      }
    } catch (_) {}
    setShowAddModal(false);
  };

  const cardsByStage = (stage: string) => board.cards.filter(c => c.stage === stage);

  const stats = {
    total: board.cards.length,
    deployed: board.cards.filter(c => c.stage === 'Deployed' || c.stage === 'Posted').length,
    ready: board.cards.filter(c => c.stage === 'Thread Ready' || c.stage === 'Ready').length,
  };

  return (
    <div className="space-y-4">
      {/* Board stats */}
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="bg-surface-2 px-2.5 py-1 rounded-full border border-border">
          📋 {stats.total} total
        </span>
        <span className="bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full border border-green-500/20">
          ✅ {stats.deployed} deployed
        </span>
        <span className="bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/20">
          🐦 {stats.ready} thread ready
        </span>
        <button
          onClick={() => setShowAddModal(true)}
          className="ml-auto flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          + Add Card
        </button>
      </div>

      {/* Kanban board */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${board.stages.length}, minmax(200px, 1fr))` }}>
        {board.stages.map(stage => (
          <StageColumn
            key={stage}
            stage={stage}
            cards={cardsByStage(stage)}
            onDragStart={setDraggingCard}
            onDragEnd={() => { setDraggingCard(null); setDragOverStage(null); }}
            onDrop={handleDrop}
            dragOverStage={dragOverStage}
            setDragOverStage={setDragOverStage}
            draggingCard={draggingCard}
          />
        ))}
      </div>

      {showAddModal && (
        <AddCardModal
          board={boardKey}
          stages={board.stages}
          onAdd={handleAddCard}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContentPipeline() {
  const [pipeline, setPipeline] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeBoard, setActiveBoard] = useState<'askrubyai' | 'reubence'>('askrubyai');
  const [saving, setSaving] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPipeline = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/content/pipeline`);
      const d = await r.json();
      setPipeline(d);
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => { loadPipeline(); }, [loadPipeline]);

  const savePipeline = useCallback(async (data: PipelineData) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch(`${API}/api/content/pipeline`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (_) {}
      setSaving(false);
    }, 500);
  }, []);

  const handleBoardUpdate = useCallback((boardKey: 'askrubyai' | 'reubence', updated: PipelineBoard) => {
    if (!pipeline) return;
    const newPipeline = { ...pipeline, [boardKey]: updated };
    setPipeline(newPipeline);
    savePipeline(newPipeline);
  }, [pipeline, savePipeline]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-text-muted gap-2">
        <span className="animate-spin text-xl">⟳</span>
        <span className="text-sm">Loading pipeline…</span>
      </div>
    );
  }

  if (!pipeline) {
    return <div className="text-center text-text-muted py-8">Failed to load pipeline</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-surface-1 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <span>📝</span> Content Pipeline
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Drag cards between stages · {saving ? '💾 Saving…' : '✓ Saved'}
            </p>
          </div>

          {/* Board switcher */}
          <div className="flex bg-surface-2 rounded-lg p-0.5">
            <button
              onClick={() => setActiveBoard('askrubyai')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeBoard === 'askrubyai' ? 'bg-purple-600 text-white' : 'text-text-muted hover:text-text-secondary'}`}
            >
              💎 @askrubyai
            </button>
            <button
              onClick={() => setActiveBoard('reubence')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeBoard === 'reubence' ? 'bg-blue-600 text-white' : 'text-text-muted hover:text-text-secondary'}`}
            >
              👤 @reubence
            </button>
          </div>
        </div>

        {/* Board context */}
        {activeBoard === 'askrubyai' && (
          <div className="mt-3 p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-300">
            <span className="font-medium">Ruby's Quant Blog</span> — askrubyai.github.io · Daily research posts on Polymarket trading strategies
          </div>
        )}
        {activeBoard === 'reubence' && (
          <div className="mt-3 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
            <span className="font-medium">Reuben's Personal</span> — @reubence · Short-form tweets · ALL LOWERCASE · absurdist · punchy · no corporate speak
          </div>
        )}
      </div>

      {/* Scrollable board */}
      <div className="overflow-x-auto pb-4">
        <div style={{ minWidth: activeBoard === 'askrubyai' ? '1200px' : '700px' }}>
          <Board
            key={activeBoard}
            boardKey={activeBoard}
            board={pipeline[activeBoard]}
            onUpdate={updated => handleBoardUpdate(activeBoard, updated)}
          />
        </div>
      </div>
    </div>
  );
}
