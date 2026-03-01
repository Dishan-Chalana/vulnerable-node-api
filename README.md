# Vulnerable Node.js REST API

An **intentionally vulnerable** Node.js REST API built for benchmarking security scanning tools and static analyzers.

> ⚠️ **WARNING**: This application contains deliberate security vulnerabilities. Do NOT deploy to production or expose to the public internet.

## Quick Start

```bash
npm install
node app.js
```

Server starts at `http://localhost:3000`.

## Stack

- Express.js 4.17.1
- SQLite via better-sqlite3
- Plain JavaScript (no TypeScript, no ORM)

## Default Users

| Username | Password  | Role  |
|----------|-----------|-------|
| admin    | admin123  | admin |
| alice    | password  | user  |
| bob      | bob2024   | user  |

## API Endpoints

| Method | Endpoint             | Auth Required |
|--------|----------------------|---------------|
| POST   | /api/login           | No            |
| POST   | /api/register        | No            |
| GET    | /api/users           | Yes (JWT)     |
| GET    | /api/users/:id       | Yes (JWT)     |
| GET    | /api/products?q=     | No            |
| GET    | /api/admin/dashboard | No            |
| POST   | /api/ping            | No            |
| GET    | /api/file?file=      | No            |

---

## Embedded Vulnerabilities (10 Issues)

| #  | Severity | Description                                          | File                    | Line(s)   |
|----|----------|------------------------------------------------------|-------------------------|-----------|
| 1  | HIGH     | Express pinned to `4.17.1` (known vulnerable version)| package.json            | ~11       |
| 2  | HIGH     | `.env` committed to repo — not in `.gitignore`        | .env / .gitignore       | —         |
| 3  | CRITICAL | SQL injection via string concatenation                | src/service/index.js    | ~53, ~60  |
| 4  | HIGH     | Passwords stored as plain MD5 hash                    | src/service/index.js    | ~45       |
| 5  | MEDIUM   | JWT secret falls back to hardcoded string             | src/service/index.js    | ~5        |
| 6  | CRITICAL | Command injection via `exec()` with user input        | src/controller/index.js | ~73       |
| 7  | HIGH     | Path traversal in `GET /file` — no sanitization       | src/controller/index.js | ~83       |
| 8  | MEDIUM   | Full user object with password hash in API response   | src/controller/index.js | ~30, ~50  |
| 9  | MEDIUM   | Insecure cookie: `httpOnly:false`, `secure:false`     | src/controller/index.js | ~24       |
| 10 | HIGH     | No auth middleware on `/admin` routes                 | src/routes/index.js     | ~22       |

## License

MIT
