---
name: use-mmkv-storage
description: Enforce synchronous MMKV storage via the shared lib/storage.ts instance. ALWAYS use this skill whenever any local key-value persistence is needed — storing user preferences, flags, session IDs, cached values, onboarding state, or any non-sensitive data. Also triggers when you see AsyncStorage imports, useEffect patterns that load from storage on mount, or any call to new MMKV() / createMMKV() outside lib/storage.ts. Use this skill even when the user says "save to storage", "persist locally", "remember this setting", "cache this value", or "don't lose this on restart" — even if they don't name a specific storage library.
license: MIT
metadata:
  author: project
  version: "1.0"
  type: diagnostic
  mode: diagnostic+generative
  maturity_score: 16
---

# MMKV Storage Enforcement: Persistence Guide

You are the storage authority for this React Native project. Your role is to diagnose what state a persistence implementation is in and steer the agent to a correct, synchronous MMKV-based solution every time.

## Core Principle

**`react-native-mmkv` (via the shared `storage` instance from `@/lib/storage`) is the only approved mechanism for local key-value storage. Never reach for `AsyncStorage`, `localStorage`, a new `MMKV()` instance, or any other async storage API for non-sensitive data.**

`react-native-mmkv` is already installed at `^4.2.0`. The shared instance is already exported from `lib/storage.ts`. No setup needed — just import and use.

---

## Project Storage Architecture

| Layer | Import | Use Case |
|---|---|---|
| **MMKV** | `import { storage } from '@/lib/storage'` | All non-sensitive KV: preferences, flags, onboarding state, session IDs, caches |
| **expo-secure-store** | `expo-secure-store` | Auth tokens, Clerk session data — sensitive data only |
| **Convex** | `convex/react` queries/mutations | Server-sourced state that needs to sync or be shared |

**Do not replace `expo-secure-store`.** It stores auth tokens via iOS Keychain / Android Keystore. MMKV is not encrypted — it is not a substitute for sensitive data.

---

## The States

### State ST1: Storage Not Yet Implemented

**Symptoms:** Agent is about to add persistence for the first time — storing a preference, flag, cached value, or session ID.

**Key Questions:**
- Is this data sensitive (auth tokens, PII)? → If yes, use `expo-secure-store`, not MMKV.
- Is this state that should survive app restarts? → If yes, use MMKV.
- Is this state that needs to sync across devices or users? → If yes, use Convex instead.

**Interventions:** Go directly to the Quick Reference below. Import `storage` from `@/lib/storage`, pick the right typed getter/setter, and use a lazy `useState` initializer — no `useEffect` needed.

---

### State ST2: AsyncStorage Detected

**Symptoms:** File contains `import AsyncStorage from '@react-native-async-storage/async-storage'`.

**Key Questions:**
- Is any of the data sensitive? (If yes → leave that specific key in `expo-secure-store`, but that's rare for AsyncStorage usage.)

**Interventions:**
1. Replace the import: `import { storage } from '@/lib/storage'`
2. Apply the migration table (see Quick Reference)
3. Remove all `await` keywords from storage calls — MMKV is synchronous
4. If a `useEffect` existed only to load the initial value → replace with a lazy `useState` initializer (see ST3)
5. After migrating all files, check whether `@react-native-async-storage/async-storage` can be removed from `package.json`. If no references remain, remove it and run `bun install`.

---

### State ST3: useEffect Loading Pattern

**Symptoms:** `useEffect(() => { AsyncStorage.getItem(key).then(v => setState(v)) }, [])` or a similar async-fetch-then-set pattern on mount — even after migrating to MMKV (`storage.getString`).

**Key Questions:**
- Is the value needed before the first meaningful render?

**Interventions:** MMKV reads are synchronous, so the `useEffect` is unnecessary. Replace the `useState(null)` + `useEffect` combination with a lazy initializer:

```tsx
// ❌ WRONG — async load creates a null→value transition, causing re-renders and a spinner
const [value, setValue] = useState<string | null>(null);
useEffect(() => {
  storage.getString(KEY) && setValue(storage.getString(KEY));
}, []);

// ✅ CORRECT — synchronous, no flicker, no loading state needed
const [value, setValue] = useState<string>(() => storage.getString(KEY) ?? 'default');
```

The lazy initializer runs once on mount, synchronously, before the first render. No spinner, no null check, no re-render.

---

### State ST4: New MMKV Instance Outside lib/storage.ts

**Symptoms:** `new MMKV()` or `createMMKV()` called in a component, hook, or utility file that is not `lib/storage.ts`.

**Key Questions:**
- Is there a genuine reason for isolation (e.g., a separate encrypted storage namespace)?

**Interventions:**
- If no special reason: delete the local call and import `storage` from `@/lib/storage` instead.
- If isolation is genuinely needed (unusual): add a named export to `lib/storage.ts` and import from there — keep all instance creation centralised.

---

### State ST5: Correct Usage

**Symptoms:** `import { storage } from '@/lib/storage'`, synchronous calls, no `await`, no `useEffect` loading pattern.

**Interventions:** None. Confirm `@react-native-async-storage/async-storage` is not also imported in the same file.

---

## Quick Reference

### Import

```tsx
import { storage } from '@/lib/storage'
```

### Typed getters and setters

```tsx
// Strings
storage.set('key', 'value')
const str = storage.getString('key')      // string | undefined

// Numbers
storage.set('count', 42)
const n = storage.getNumber('count')      // number | undefined

// Booleans
storage.set('seen_prompt', true)
const seen = storage.getBoolean('seen_prompt')  // boolean | undefined

// Delete
storage.delete('key')

// Check existence
storage.contains('key')                   // boolean
```

### Lazy useState initializer (the preferred pattern)

```tsx
// Read on mount, write on change — no useEffect, no loading state
const [theme, setTheme] = useState<string>(
  () => storage.getString('user_theme') ?? 'light'
);

function handleChange(newTheme: string) {
  setTheme(newTheme);
  storage.set('user_theme', newTheme);
}
```

### One-time flags (no React state needed)

```tsx
// If you don't need to re-render on change, skip useState entirely
function shouldShowOnboarding() {
  return !storage.getBoolean('onboarding_complete');
}

function markOnboardingComplete() {
  storage.set('onboarding_complete', true);
}
```

---

## AsyncStorage → MMKV Migration Table

| AsyncStorage (async) | MMKV (sync) |
|---|---|
| `await AsyncStorage.getItem(key)` | `storage.getString(key)` |
| `await AsyncStorage.setItem(key, val)` | `storage.set(key, val)` |
| `await AsyncStorage.removeItem(key)` | `storage.delete(key)` |
| `await AsyncStorage.clear()` | `storage.clearAll()` |
| `await AsyncStorage.getAllKeys()` | `storage.getAllKeys()` |

---

## Diagnostic Process

1. **Identify what is being built** — is it local persistence of non-sensitive data?
2. **Check the import** — is `AsyncStorage` imported? If so → State ST2.
3. **Check for `useEffect` loading** — is the initial value loaded asynchronously on mount? If so → State ST3.
4. **Check for rogue instances** — is `createMMKV()` or `new MMKV()` called outside `lib/storage.ts`? → State ST4.
5. **Verify typed getter** — is the right getter used for the value type (string/number/boolean)?
6. **Check `package.json`** — if AsyncStorage has been fully removed, remove the dependency too and run `bun install`.

---

## Anti-Patterns

### The Awaited Sync Call
**Pattern:** `const value = await storage.getString(key)` after a migration from AsyncStorage.
**Problem:** `storage.getString` returns synchronously. Wrapping in `await` adds microtask overhead and misleads readers. It also prevents using the value in a synchronous lazy initializer.
**Fix:** Remove `await`. The return value is immediately available.

### The Preserved useEffect
**Pattern:** Migrating `AsyncStorage.getItem` → `storage.getString` inside a `useEffect` without removing the effect.
**Problem:** The entire point of MMKV is that reads are instantaneous — keeping the effect adds an unnecessary render cycle, a null→value transition, and often a loading spinner that didn't need to exist.
**Fix:** Replace `useState(null)` + `useEffect` with `useState(() => storage.getString(KEY))`.

### The Orphan Instance
**Pattern:** `const s = createMMKV()` or `const s = new MMKV()` declared inline in a component or utility.
**Problem:** Multiple instances fragment storage, make it hard to trace what's persisted where, and can cause unexpected isolation between reads and writes.
**Fix:** All instance creation lives in `lib/storage.ts`. Import `storage` everywhere else.

### The Secure-Store Migration
**Pattern:** Replacing `expo-secure-store` with MMKV because "it's faster".
**Problem:** `expo-secure-store` data is encrypted at rest. MMKV is not. Auth tokens must stay encrypted — a performance gain is not worth the security regression.
**Fix:** Leave `expo-secure-store` untouched. Only migrate non-sensitive storage.

### The Partial Migration
**Pattern:** Some files use `storage` from `@/lib/storage`, others still import `AsyncStorage` for the same key constant.
**Problem:** Two writers using different APIs for the same key is a silent data consistency bug — one reads `undefined` while the other wrote a value.
**Fix:** Migrate all files touching a given key at once. Remove the dependency when all usages are gone.

---

## What You Do NOT Do

- Do not use `AsyncStorage` for any storage in this project
- Do not call `createMMKV()` or `new MMKV()` outside `lib/storage.ts`
- Do not wrap sync MMKV calls in `async` functions to preserve old API shapes
- Do not leave `useEffect` loading patterns when a lazy `useState` initializer works
- Do not replace `expo-secure-store` — it is appropriate for auth tokens and sensitive data

---

## Integration Graph

### Inbound (From Other Skills)
| Source Skill | Trigger | Leads to State |
|---|---|---|
| building-native-ui | Adding user preferences or persistent UI state | ST1: Not Yet Implemented |
| react-native-architecture | Scaffolding offline sync or persistent session state | ST1 |
| react-doctor | Catching async/useEffect patterns in a component review | ST3 |

### Outbound (To Other Skills)
| This State | Leads to Skill | Reason |
|---|---|---|
| ST3 (useEffect eliminated) | react-doctor | Verify no other unnecessary effects remain after refactor |
| ST1 (new feature) | building-native-ui | Continue building the rest of the screen after persistence is wired up |

### Complementary Skills
| Skill | Relationship |
|---|---|
| react-doctor | Post-migration check for lingering async patterns |
| react-native-best-practices | MMKV elimination of useEffect aligns with the broader "avoid unnecessary re-renders" principle |

---

## Execution Strategy

### Sequential
- Diagnose state (ST1–ST4) before touching any code
- Remove `useEffect` only after confirming the lazy initializer covers all cases

### Parallelizable
- Scanning imports + checking for `useEffect` loading patterns can be done in one file read
- If multiple files need migrating, they can be edited in parallel

### Context Management
- **Skill base:** ~2k tokens
- Drop Integration Graph when context is tight; keep Quick Reference and Migration Table
- The lazy initializer pattern (ST3) is the most commonly misapplied — keep that section visible
