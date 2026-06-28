
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-slate-400 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 self-start sm:self-center">
          {children}
        </div>
      )}
    </div>
  );
}
