# TransitOps Conventions

## 1. API Responses
All API routes must return JSON shaped like:
```json
{
  "data": { ... },
  "error": null
}
```
If an error occurs, it should be:
```json
{
  "data": null,
  "error": "Error message here"
}
```

## 2. API Filtering
All list endpoints (GET requests returning arrays) must support a `?status=` query parameter for filtering by status enum.

## 3. Request Validation
Use Zod for validating request bodies. Place validation schemas in `src/lib/validations/`. There should be one schema file per module (e.g., `vehicles.ts`, `trips.ts`).

## 4. Status Transitions
When changing the status of an entity (e.g., Vehicle/Driver on dispatch, complete, cancel, or maintenance), you MUST use a Prisma transaction (`prisma.$transaction`) to ensure atomicity.

## 5. UI Components
We are using `shadcn/ui`. All UI components should use the pre-configured classes in `@/components/ui/`.
