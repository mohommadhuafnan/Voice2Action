"use client";

import { useState } from "react";
import { toast } from "sonner";

type SettingsPayload = {
  timezone: string;
  preferredLang: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  darkMode: boolean;
};

export function SettingsForm({ initialSettings }: { initialSettings: SettingsPayload }) {
  const [form, setForm] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  async function saveSettings() {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(error.error ?? "Failed to save settings.");
      }

      toast.success("Settings saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Account and preferences</h1>
        <p className="mt-2 text-sm text-slate-400">Manage language, timezone, and notification channels.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Timezone">
          <input
            value={form.timezone}
            onChange={(event) => setForm((prev) => ({ ...prev, timezone: event.target.value }))}
            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-white"
          />
        </Field>

        <Field label="Preferred language">
          <select
            value={form.preferredLang}
            onChange={(event) => setForm((prev) => ({ ...prev, preferredLang: event.target.value }))}
            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-white"
          >
            <option value="en">English</option>
            <option value="si">Sinhala</option>
            <option value="ta">Tamil</option>
            <option value="mixed">Mixed</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Toggle
          label="Email notifications"
          checked={form.emailNotifications}
          onChange={(checked) => setForm((prev) => ({ ...prev, emailNotifications: checked }))}
        />
        <Toggle
          label="In-app notifications"
          checked={form.inAppNotifications}
          onChange={(checked) => setForm((prev) => ({ ...prev, inAppNotifications: checked }))}
        />
        <Toggle
          label="Dark mode"
          checked={form.darkMode}
          onChange={(checked) => setForm((prev) => ({ ...prev, darkMode: checked }))}
        />
      </div>

      <button
        type="button"
        onClick={saveSettings}
        disabled={saving}
        className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save settings"}
      </button>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-sm text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
