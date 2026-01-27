# Error Handling Suggestions for Predictor Feature

## Overview
Based on the codebase patterns, here are three error handling approaches for the predictor feature:

## Option 1: Inline Field Errors + Toast Notifications (Recommended)
**Best for:** User-friendly experience with clear feedback

### Pattern:
- **Mutations (Create/Update Prediction):**
  - Use Apollo's `error` object from `useMutation` hook
  - Extract GraphQL errors and display via toast notifications (using a toast library like `sonner` or `react-hot-toast`)
  - Show inline errors for validation issues (e.g., "Match has already started")
  - Handle authentication errors by redirecting to login

- **Queries (Fetch Predictions):**
  - Use Apollo's `error` object from `useQuery` hook
  - Show toast for network errors
  - Show inline error messages in UI for business logic errors
  - Gracefully degrade UI (show empty state with error message)

### Example Implementation:
```typescript
// In hook
const [createPrediction, { loading, error }] = useMutation(CreatePredictionDocument);

const handleCreate = async (input: CreatePredictionDto) => {
  try {
    const { data, errors } = await createPrediction({ variables: { input } });
    
    if (errors) {
      // Handle GraphQL errors
      toast.error(errors[0].message);
      return;
    }
    
    if (data?.createPrediction) {
      toast.success('Prediction saved successfully!');
    }
  } catch (err) {
    // Handle network/other errors
    toast.error('Failed to save prediction. Please try again.');
  }
};
```

### Pros:
- ✅ Clear user feedback
- ✅ Non-intrusive (toasts)
- ✅ Follows existing patterns
- ✅ Good UX

### Cons:
- ⚠️ Requires toast library setup
- ⚠️ Need to handle multiple error types

---

## Option 2: Inline Error Messages Only
**Best for:** Simple, form-focused approach

### Pattern:
- **Mutations:**
  - Return error state from hooks
  - Display errors inline in the UI (similar to AdminMatchCreateViewUi)
  - Show general error banner at top of form/section

- **Queries:**
  - Return error from hooks
  - Display error state in UI (error message component)
  - Show retry button for failed queries

### Example Implementation:
```typescript
// In hook
const [createPrediction, { loading, error }] = useMutation(CreatePredictionDocument);

// In component
{error && (
  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded">
    {error.message || 'Failed to save prediction'}
  </div>
)}
```

### Pros:
- ✅ No external dependencies
- ✅ Consistent with admin forms
- ✅ Simple to implement

### Cons:
- ⚠️ Less visible than toasts
- ⚠️ Requires manual error state management

---

## Option 3: Error Boundary + Centralized Error Handler
**Best for:** Enterprise applications with complex error scenarios

### Pattern:
- **Mutations:**
  - Use React Error Boundary for unexpected errors
  - Centralized error handler for GraphQL errors
  - Toast notifications for user actions
  - Log errors to error tracking service (Sentry, etc.)

- **Queries:**
  - Error Boundary catches query errors
  - Fallback UI components
  - Retry mechanisms built-in

### Example Implementation:
```typescript
// Error handler utility
export const handleGraphQLError = (error: ApolloError) => {
  if (error.graphQLErrors.length > 0) {
    const gqlError = error.graphQLErrors[0];
    
    // Handle specific error codes
    if (gqlError.extensions?.code === 'UNAUTHENTICATED') {
      router.push('/login');
      return;
    }
    
    toast.error(gqlError.message);
  } else if (error.networkError) {
    toast.error('Network error. Please check your connection.');
  }
};
```

### Pros:
- ✅ Robust error handling
- ✅ Good for production apps
- ✅ Centralized error logic
- ✅ Better debugging

### Cons:
- ⚠️ More complex setup
- ⚠️ Overkill for simple features
- ⚠️ Requires error tracking service

---

## Recommended Approach: **Option 1 (Inline + Toast)**

### Specific Error Scenarios to Handle:

1. **Authentication Errors (401/403)**
   - Redirect to login page
   - Show message: "Please log in to make predictions"

2. **Validation Errors**
   - Match already started: "This match has already started. Predictions are only allowed for upcoming matches."
   - Invalid scores: "Scores must be between 0 and 20"
   - Missing fields: Show inline validation

3. **Network Errors**
   - Show toast: "Network error. Please check your connection and try again."
   - Provide retry button

4. **Server Errors (500)**
   - Show toast: "Something went wrong. Please try again later."
   - Log error for debugging

5. **Business Logic Errors**
   - "You've already made a prediction for this match. Update your existing prediction instead."
   - "Prediction deadline has passed for this match."

### Implementation Checklist:
- [ ] Set up toast library (if not already present)
- [ ] Create error handler utility function
- [ ] Add error handling to mutation hooks
- [ ] Add error handling to query hooks
- [ ] Add error states to UI components
- [ ] Add retry mechanisms for failed queries
- [ ] Test all error scenarios

---

## Code Structure Recommendation:

```
src/domains/predictor/
├── hooks/
│   ├── useCreatePrediction.ts      # Mutation hook with error handling
│   ├── useUpdatePrediction.ts      # Mutation hook with error handling
│   ├── useMyPredictions.ts         # Query hook with error handling
│   └── usePredictionStats.ts       # Query hook with error handling
├── utils/
│   └── errorHandler.ts             # Centralized error handling logic
└── components/
    └── ErrorMessage.tsx            # Reusable error display component
```
