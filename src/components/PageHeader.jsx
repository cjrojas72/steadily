/**
 * Consistent page header with optional action button.
 *
 * @param {{ title: string, description: string, action?: React.ReactNode }} props
 */
export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2>{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
