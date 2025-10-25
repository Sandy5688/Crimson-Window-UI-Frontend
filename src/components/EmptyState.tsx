type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ icon = "📭", title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" data-aos="zoom-in">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
        {title}
      </h3>
      <p className="text-sm text-black/60 dark:text-white/60 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 rounded-lg text-white font-semibold hover:brightness-95 transition-all"
          style={{ backgroundColor: "#2D89FF" }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

