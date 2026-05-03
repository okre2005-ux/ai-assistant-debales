type ProjectSwitcherProps = {
  projectName: string;
};

export function ProjectSwitcher({ projectName }: ProjectSwitcherProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        Project
      </label>

      <select
        value={projectName}
        disabled
        className="mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none"
      >
        <option>{projectName}</option>
      </select>
    </div>
  );
}
