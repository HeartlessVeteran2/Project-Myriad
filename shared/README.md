# Shared Code for Project Myriad

This directory contains code shared between the web app (frontend) and mobile app (mobile).

## What to Put Here

- API clients
- Authentication logic
- Theme configuration
- Validation schemas
- Constants
- Utility functions
- Shared types/models

## How to Use

- Import from `shared/` in both web and mobile codebases.
- Keep all business logic and data models here for maximum code reuse.

---

**Example:**

```js
import { api, setAuthToken } from '../../shared/api';
import { loginSchema } from '../../shared/validation';
```
