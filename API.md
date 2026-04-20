# API.md

## Purpose

This frontend repository must always follow the backend API documentation as the source of truth.

Do not invent endpoints.  
Do not invent request bodies.  
Do not invent response shapes.  
Do not invent field names.  
Do not assume backend behavior from old frontend code.  
Do not keep frontend behavior that contradicts backend documentation.

When implementing, refactoring, or fixing frontend code that talks to the backend, always read the backend API documentation first and make the frontend match it exactly.

---

## Source of truth

Backend repository:  
`https://github.com/majtobijakodric/audiohub`

Primary API documentation:  
`https://raw.githubusercontent.com/majtobijakodric/audiohub/refs/heads/main/docs/api.md`

When working in this frontend repo, always treat the backend documentation above as the canonical source for:

- available endpoints
- HTTP methods
- request body format
- query/body field names
- response shapes
- status codes
- error handling
- authentication behavior
- frontend usage notes written in backend docs

If the frontend code and backend documentation disagree, the backend documentation wins.

---

## Mandatory workflow for any API-related change

Before making any API-related frontend change, do the following:

1. Open the backend API documentation.
2. Find the exact endpoint involved.
3. Verify:
   - HTTP method
   - full route
   - required body fields
   - optional fields
   - success response shape
   - error response shape
   - status codes
   - auth/token requirements
   - any frontend notes written in backend docs
4. Update the frontend code to match the backend documentation exactly.
5. Update types/interfaces/models in the frontend so they match the documented backend response.
6. Update validation, forms, requests, loading states, success states, and error states accordingly.
7. Remove any old frontend assumptions that are no longer documented by the backend.
8. If needed, check backend test files and backend implementation for clarification, but still prioritize the API documentation first.

Never skip this process.

---

## Rules the frontend agent must always follow

### 1. Backend docs are authoritative
Always trust the backend documentation over:
- existing frontend code
- previous assumptions
- guessed API shapes
- placeholder mock structures
- “common patterns” from other projects

### 2. Never guess missing fields
If a response contains:
- `token`
- `user`
- `songs`
- `results`
- `message`
or any other property, only use it if it is documented by the backend.

Do not assume extra metadata exists unless documented.

### 3. Keep frontend types aligned
Whenever the frontend uses:
- TypeScript types
- interfaces
- API clients
- DTO mappings
- Zod/Yup/validation schemas
- React Query/SWR fetchers
- form payload builders

they must reflect the backend documentation exactly.

### 4. Respect exact request formats
For every request, follow the backend docs exactly for:
- JSON body structure
- field names
- parameter names
- required headers
- auth headers
- content type
- route params
- query params

Do not rename fields unless you are only renaming them internally after parsing.

### 5. Respect exact response formats
Use the response exactly as documented.

Do not:
- flatten responses unless needed internally
- discard important fields
- assume nested objects have different shapes
- expect undocumented fields

If transformation is needed for UI purposes, keep the API contract unchanged at the network boundary.

### 6. Handle documented errors properly
Frontend UX must reflect documented backend behavior.

If backend docs mention status codes or possible errors, the frontend should:
- display appropriate messages
- handle unauthorized states
- handle validation failures
- handle missing resources
- handle server failures gracefully

Do not collapse all failures into a generic error if the backend documentation provides meaningful distinctions.

### 7. Authentication must follow backend docs
If the backend documentation defines auth flows, token usage, signup/login behavior, or protected endpoints, implement them exactly as documented.

Do not invent:
- token storage format
- refresh behavior
- header format
- session rules
unless they are clearly documented elsewhere in the backend repo.

### 8. Prefer documented backend behavior over convenience
If the frontend wants a nicer API shape but the backend docs specify something else, the frontend must adapt.

The backend contract is not negotiable from the frontend side.

---

## Required behavior during implementation

When asked to add or modify a feature that uses the backend API, you must:

1. Read the backend API documentation first.
2. Identify every endpoint involved in the feature.
3. Check whether the current frontend implementation already matches the docs.
4. If not, refactor the frontend to match the docs before adding extra logic.
5. Implement UI behavior according to the real backend contract.
6. Keep code clean, but never at the cost of violating the documented API.

---

## Handling mismatches or uncertainty

If you find a mismatch between:
- frontend code and backend docs
- backend docs and backend implementation
- two different backend files

follow this priority order:

1. backend API documentation
2. backend tests/examples for the endpoint
3. backend implementation
4. existing frontend code

If something is still unclear, do not guess.

Instead:
- leave the frontend aligned to the most explicit documented behavior
- add a short comment marking the uncertainty
- avoid introducing assumptions disguised as facts

---

## Practical expectations for this frontend repo

For every backend-connected feature, ensure all of the following are checked:

- endpoint path is correct
- method is correct
- request payload is correct
- auth handling is correct
- success response parsing is correct
- loading state is correct
- error state is correct
- empty state is correct
- optimistic assumptions are avoided
- types are updated
- old API assumptions are removed

---

## What to do when generating new code

When generating code that touches the API, always prefer this order:

1. read backend `docs/api.md`
2. generate or update API client functions
3. generate or update frontend types from documented responses
4. wire UI components to those client functions
5. add proper loading/error handling based on documented backend behavior

Never start from UI assumptions and then try to force the backend into them.

---

## Anti-patterns to avoid

Do not do any of the following:

- create endpoints that are not documented
- change request field names to sound nicer
- assume response fields from old code
- hardcode fake success responses
- silently ignore backend validation errors
- treat all non-200 responses the same
- use stale frontend models when backend docs changed
- keep broken compatibility layers that hide API mismatches
- write code like “assuming backend returns ...”
- fabricate undocumented pagination, filters, sorting, or auth behavior

---

## Expected mindset

The frontend is a client of the backend contract.

That means:
- backend docs define reality
- frontend code must adapt to reality
- every API-related change starts by checking backend docs
- every API-related bug fix must verify backend docs before changing code
- every new feature must be implemented against documented backend behavior, not assumptions

---

## Instruction summary

For any task involving the backend API:

- always open and follow the backend API documentation first
- always treat backend documentation as the source of truth
- always make frontend requests and responses match the documentation exactly
- always update frontend types and UI behavior to reflect documented backend behavior
- never guess or invent API behavior
- never prefer existing frontend assumptions over backend documentation

If there is any conflict, the backend documentation wins.