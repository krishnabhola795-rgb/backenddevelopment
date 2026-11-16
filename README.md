# Backend Development

Node.js + Express + MongoDB backend with auth and DevOps basics.

## Features
- MongoDB CRUD (`/api/items`)
- Signup & login without database (`/api/nodb`)
- Signup & signin with MongoDB (`/api/auth`)
- Password hashing with bcrypt
- JWT token generate + middleware + get profile
- Login page UI: store token, then open next page (`public/`)
- Token versioning (single session login)
- RBAC: user and admin roles (`/api/admin`)
- API rate limiting (100 requests / 15 min)
- Dockerfile
- CI with GitHub Actions

## Run
```
npm install
cp .env.example .env     # then edit values
npm start
```
Open http://localhost:3000

## Docker
```
docker build -t backenddevelopment .
docker run -p 3000:3000 --env-file .env backenddevelopment
```

## API
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/signup | public |
| POST | /api/auth/signin | public |
| GET | /api/auth/profile | token |
| POST/GET/PUT/DELETE | /api/items | token |
| GET | /api/admin/users | admin |
| PATCH | /api/admin/users/:id/role | admin |
| POST | /api/nodb/signup, /api/nodb/login | public |

Note: Admin role is given to the email set as `ADMIN_EMAIL` in `.env` when that user signs up.
