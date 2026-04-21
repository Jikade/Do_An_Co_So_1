# API Contract

## Auth

### POST /auth/register
Request:
```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "Demo User"
}