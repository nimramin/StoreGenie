"use client";

export default function DashboardPage() {

  return (
    <div>
      <div className="bg-card/80 backdrop-blur-sm border border-magic-accent rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Welcome to your StoreGenie Dashboard!
        </h2>
        <p className="text-muted-foreground">
          Use the sidebar to navigate through your store&apos;s features.
        </p>
      </div>
    </div>
  );
}
