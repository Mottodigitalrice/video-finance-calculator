# Conventions

## Workflow

### For New Artifacts
1. Understand what we're building (report? dashboard? presentation?)
2. Build it quickly — these are artifacts, not apps
3. Use shadcn/ui components for professional look
4. Test locally with `npm run dev`
5. Deploy with `npm run deploy`

### For Updates
1. Read the existing page
2. Make the change
3. Rebuild and redeploy

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `MetricsCard.tsx` |
| Utilities | kebab-case | `format-data.ts` |
| Pages | lowercase | `page.tsx` |
| Layouts | lowercase | `layout.tsx` |

## Code Style

### TypeScript
- Strict mode enabled
- Functional components with hooks
- Use `interface` for objects, `type` for unions

### Imports Order
1. React/Next imports
2. External libraries
3. Internal modules (`@/`)
4. Relative imports

## UI Patterns

### Page Layout
```typescript
export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <h1>Title</h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {/* Content */}
      </main>
    </div>
  );
}
```

### Data Display
- Use `Card` for grouped content
- Use `Table` for tabular data
- Use `Badge` for status indicators
- Use `Tabs` for multiple views
- Use `Separator` for visual breaks

### Print Styles
For reports/documents, add print styles:
```css
@media print {
  .no-print { display: none; }
  body { background: white; }
}
```

## Git Conventions

- Use imperative mood: "Add report" not "Added report"
- Keep first line under 50 characters
