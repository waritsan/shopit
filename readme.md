# API Tests
GET products
curl http://localhost:4000/api/v1/products | python3 -m json.tool

Register a user
curl -X POST -H "Content-Type: application/json" -d '{"name": "warit", "email": "waritsan@gmail.com", "password": "waritsan"}' http://localhost:4000/api/v1/register | python3 -m json.tool