const AdminPageHeader = ({ actions, description, eyebrow, title }) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      {eyebrow && (
        <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
          {eyebrow}
        </div>
      )}
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
  </div>
);

export default AdminPageHeader;
