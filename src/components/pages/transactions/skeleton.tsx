export const TransactionSkeleton = () => {
    return (
        <div className="space-y-3 pb-24">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl border bg-muted/50 p-4 animate-pulse"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="h-4 w-32 rounded-full bg-muted-foreground/20" />
                <div className="h-5 w-20 rounded-full bg-muted-foreground/25" />
              </div>
              <div className="h-3 w-40 rounded-full bg-muted-foreground/15" />
            </div>
          </div>
        ))}
      </div>
    )
}