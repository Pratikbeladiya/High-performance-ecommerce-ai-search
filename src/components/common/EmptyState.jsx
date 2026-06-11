import React from "react";
import { HelpCircle } from "lucide-react";

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your search terms or filters.",
  icon: Icon = HelpCircle,
  actionButtonText,
  onActionClick
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
      <div className="w-12 h-12 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-5 leading-normal">{description}</p>
      {actionButtonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="py-1.5 px-3 bg-indigo-650 hover:bg-indigo-600 active:bg-indigo-700 text-xs font-semibold text-white rounded-lg transition-all cursor-pointer"
        >
          {actionButtonText}
        </button>
      )}
    </div>
  );
}
