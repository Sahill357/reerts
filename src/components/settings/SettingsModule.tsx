import React, { useState } from 'react';
import { Plus, Trash2, FileText, ShieldCheck, Database } from 'lucide-react';
import {
  SavedTimeSlot,
  SocialProfile,
  UserSession,
} from '../../types/scheduler';
import { Button, Input } from '../ui/primitives';

interface SettingsModuleProps {
  session: UserSession;
  profiles: SocialProfile[];
  timeSlots: SavedTimeSlot[];
  onToggleProfileAutoPublish: (profileId: string, nextValue: boolean) => Promise<void>;
  onAddTimeSlot: (payload: {
    profileId: string;
    dayOfWeek: number;
    hour: number;
  }) => Promise<void>;
  onDeleteTimeSlot: (id: string) => Promise<void>;
  onUpdateWorkspace: (payload: { name: string; timezone: string }) => Promise<void>;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function SettingsModule({
  session,
  profiles,
  timeSlots,
  onToggleProfileAutoPublish,
  onAddTimeSlot,
  onDeleteTimeSlot,
  onUpdateWorkspace,
}: SettingsModuleProps) {
  const [workspaceName, setWorkspaceName] = useState(session.workspace.name);
  const [timezone, setTimezone] = useState(session.workspace.timezone);
  const [slotProfileId, setSlotProfileId] = useState(profiles[0]?.id || 'prof_ig_01');
  const [slotDay, setSlotDay] = useState(2);
  const [slotHour, setSlotHour] = useState(10);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateWorkspace({ name: workspaceName, timezone });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Social Accounts & Quick Schedule Queue Slots */}
      <div className="lg:col-span-7 space-y-6">
        <section className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-5 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              Connected Social Profiles & Auto-Publish Permissions
            </h2>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Configure OAuth publishing mode per channel
            </p>
          </div>

          <div className="divide-y divide-[var(--color-border-hairline)]">
            {profiles.map((prof) => (
              <div key={prof.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-ink)]">
                    {prof.platform} · {prof.handle}
                  </p>
                  <p className="text-[11px] font-mono tabular-nums text-[var(--color-ink-muted)]">
                    {prof.displayName} · {prof.followersCount.toLocaleString()} followers
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--color-ink-secondary)]">
                    {prof.autoPublish ? 'Auto-Publish Enabled' : 'Notification Mode'}
                  </span>
                  <Button
                    variant={prof.autoPublish ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onToggleProfileAutoPublish(prof.id, !prof.autoPublish)}
                  >
                    {prof.autoPublish ? 'Disable Auto-Publish' : 'Enable Auto-Publish'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Schedule Time Slots */}
        <section className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">
              Quick Schedule Weekly Queue Slots
            </h3>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Define recurring time slots used by the Quick Schedule action and Best Time heatmap
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <select
              value={slotProfileId}
              onChange={(e) => setSlotProfileId(e.target.value)}
              className="px-3 py-2 text-xs bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.platform} ({p.handle})
                </option>
              ))}
            </select>

            <select
              value={slotDay}
              onChange={(e) => setSlotDay(Number(e.target.value))}
              className="px-3 py-2 text-xs bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]"
            >
              {DAY_NAMES.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={slotHour}
              onChange={(e) => setSlotHour(Number(e.target.value))}
              className="px-3 py-2 text-xs font-mono bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]"
            >
              {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}:00 PST
                </option>
              ))}
            </select>

            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                onAddTimeSlot({
                  profileId: slotProfileId,
                  dayOfWeek: slotDay,
                  hour: slotHour,
                })
              }
            >
              <Plus className="w-3.5 h-3.5" /> Add Slot
            </Button>
          </div>

          <div className="divide-y divide-[var(--color-border-hairline)] max-h-60 overflow-y-auto">
            {timeSlots.map((slot) => {
              const prof = profiles.find((p) => p.id === slot.profileId);
              return (
                <div
                  key={slot.id}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-medium text-[var(--color-ink)]">
                      {DAY_NAMES[slot.dayOfWeek]} at {String(slot.hour).padStart(2, '0')}:00
                    </span>
                    <span className="mx-2 text-[var(--color-ink-muted)]">·</span>
                    <span className="text-[var(--color-ink-secondary)]">
                      {prof?.platform} ({prof?.handle})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTimeSlot(slot.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[var(--color-status-danger)]" />
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Right Column: Workspace Session, Stack Config & Phase 1 Spec Inventory */}
      <div className="lg:col-span-5 space-y-6">
        <form
          onSubmit={handleSaveWorkspace}
          className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">
              Workspace & Better Auth Session
            </h3>
          </div>

          <div className="text-xs space-y-1 text-[var(--color-ink-secondary)]">
            <p>
              Signed in as <strong className="text-[var(--color-ink)]">{session.user.name}</strong> (
              <span className="font-mono">{session.user.email}</span>) · Role: {session.user.role}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
              Workspace Name
            </label>
            <Input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
              Default Scheduling Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-md)]"
            >
              <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[var(--color-status-nominal)]">
              {savedNotice ? 'Workspace preferences saved' : ''}
            </span>
            <Button type="submit" variant="primary" size="sm">
              Save Preferences
            </Button>
          </div>
        </form>

        {/* Architecture & Phase 1 Spec Summary */}
        <section className="bg-[var(--color-surface)] border border-[var(--color-border-hairline)] rounded-[var(--radius-lg)] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[var(--color-ink-secondary)]" />
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">
              Checked-In Spec & Infrastructure Artifacts
            </h3>
          </div>
          <p className="text-xs text-[var(--color-ink-secondary)]">
            All Phase 1 specification documents and Phase 2 infrastructure schemas are checked into the repository:
          </p>
          <ul className="space-y-1.5 text-xs font-mono text-[var(--color-ink-secondary)]">
            <li className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>docs/later-spec/routes.md · components.md · api.md</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>docs/later-spec/calendar.md · composer.md · media-library.md</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>docs/later-spec/link-in-bio.md · analytics.md · settings.md</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>prisma/schema.prisma + migrations/20261022000000_init</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>docker-compose.yml (PostgreSQL 16 + Redis 7)</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
