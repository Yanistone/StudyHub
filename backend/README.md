# Backend

## API Endpoints
### Auth

- `POST /api/auth/register` → inscription d’un utilisateur  
  Body : `{ "email": "...", "password": "..." }`

- `POST /api/auth/login` → connexion utilisateur  
  Body : `{ "email": "...", "password": "..." }`

- `GET /api/auth/me` → infos de l’utilisateur connecté  
  Headers : `Authorization: Bearer <token>`

---

### Articles

- `GET /api/articles` → liste des articles  
  Query params : `?q=motclé&categoryId=1&tag=slugOrId`

- `GET /api/articles/:slug` → détail d’un article

- `POST /api/articles` → créer un article (rôle `MOD` ou `ADMIN`)  
  Headers : `Authorization: Bearer <token>`  
  Body : `{ "title": "...", "summary": "...", "content": "...", "categoryId": 1, "tagIds": [1,2] }`

---

### Proposals

- `POST /api/proposals` → proposer une fiche ou une modif (auth requis)  
  Body : `{ "type": "NEW" | "EDIT", "targetArticleId": 1?, "payloadJson": { ... } }`

- `GET /api/proposals?status=PENDING` → lister les propositions (rôle `MOD` ou `ADMIN`)

- `POST /api/proposals/:id/review` → valider/refuser une proposition (rôle `MOD` ou `ADMIN`)  
  Body : `{ "decision": "APPROVED" | "REJECTED", "reviewComment": "..." }`

---

### Comments

- `GET /api/comments/article/:articleId` → liste des commentaires d’un article

- `POST /api/comments/article/:articleId` → ajouter un commentaire (auth requis)  
  Body : `{ "content": "..." }`

- `PATCH /api/comments/:id` → modérer un commentaire (rôle `MOD` ou `ADMIN`)  
  Body : `{ "status": "PUBLISHED" | "HIDDEN" | "DELETED" }`
