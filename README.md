# Full TODO App

Полный стек TODO-приложения на Next.js (Frontend) + Express (Backend) + PostgreSQL (Database) + Docker.

---

## 📝 Описание

Приложение позволяет:
- Создавать задачи (TODO)
- Редактировать задачи
- Отмечать как выполненные
- Удалять задачи

Backend использует Express и PostgreSQL. Frontend — Next.js с RTK Query для работы с API.  

---

Пример .env для создания в папке backend:

DATABASE_URL=postgresql://name_user:name_pass@db:port/name_db
PORT=4000

---

Запуск через Docker:

Зайти в корень проекта, где лежит docker-compose.yml и выполнить команду:

docker-compose up --build

Docker поднимает:
PostgreSQL (с базой todo_app)
Backend (Express)
Frontend (Next.js)

---

Доступ к приложению
Frontend: http://localhost:3000
Backend API: http://localhost:4000/api/todos

---

Используемые технологии:
Frontend: Next.js, React, Redux Toolkit RTK Query, TypeScript
Backend: Node.js, Express, PostgreSQL, pg
База данных: PostgreSQL
Контейнеризация: Docker, docker-compose
