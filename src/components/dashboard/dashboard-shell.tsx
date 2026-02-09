export function DashboardShell({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in-up"
            style={{ animationDuration: "0.4s" }}
        >
            {children}
        </div>
    );
}
