# 🎓 FreeLanceHub — Freelance Student Hub

> **Биржа фриланс-услуг для студентов** — платформа, где студенты находят заказчиков, а работодатели находят исполнителей среди студентов.

<div align="center">

![.NET](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 📋 Содержание

- [О проекте](#-о-проекте)
- [Технологический стек](#-технологический-стек)
- [Быстрый старт](#-быстрый-старт)
- [Структура проекта](#-структура-проекта)
- [API документация](#-api-документация)
- [Роли пользователей](#-роли-пользователей)
- [База данных](#-база-данных)
- [Тестовые аккаунты](#-тестовые-аккаунты)
- [Порты и адреса](#-порты-и-адреса)
- [Команда](#-команда)

---

## 🚀 О проекте

**FreeLanceHub** — это полноценная веб-платформа с трёхролевой системой:

| Роль | Описание | Возможности |
|------|----------|-------------|
| 🎓 **Student** | Студент-фрилансер | Создавать услуги (Gigs), откликаться на заказы, получать отзывы |
| 💼 **Employer** | Заказчик | Публиковать заказы, выбирать исполнителей, оставлять отзывы |
| 🛡️ **Admin** | Администратор | Управление пользователями, модерация, просмотр статистики |

### ✨ Ключевой функционал

- **Авторизация** — JWT-аутентификация с ролевой защитой маршрутов
- **Услуги (Gigs)** — студенты публикуют свои услуги с ценой, категорией и навыками
- **Заказы (Orders)** — работодатели размещают задания с бюджетом и дедлайном
- **Отклики (Proposals)** — студенты откликаются на заказы, работодатель выбирает исполнителя
- **Отзывы и рейтинг** — автоматический пересчёт рейтинга после завершения заказа
- **Уведомления** — система уведомлений о статусах заказов и откликов
- **Административная панель** — модерация, статистика платформы, управление пользователями

---

## 🛠 Технологический стек

### Backend
| Технология | Назначение |
|------------|-----------|
| **C# / ASP.NET Core 8** | Web API — основа бэкенда |
| **Entity Framework Core 8** | ORM, Code-First миграции |
| **ASP.NET Identity + JWT** | Аутентификация и роли |
| **PostgreSQL 16** | Реляционная база данных |
| **Docker Compose** | Запуск БД и pgAdmin |
| **AutoMapper** | Маппинг Entity ↔ DTO |
| **Swagger / OpenAPI** | Документация API |

### Frontend
| Технология | Назначение |
|------------|-----------|
| **React 19 + TypeScript** | UI-фреймворк |
| **Vite** | Быстрая сборка |
| **TailwindCSS 4** | Стилизация |
| **React Router DOM** | Клиентская маршрутизация |
| **TanStack Query (React Query)** | Кеширование и состояние данных |
| **Zustand** | Глобальный стор (авторизация) |
| **React Hook Form + Zod** | Формы и валидация |
| **Axios** | HTTP-клиент |

---

## ⚡ Быстрый старт

### Требования

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20 LTS](https://nodejs.org/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (для бэкенда)

---

### 1️⃣ Запуск базы данных

```bash
docker-compose up -d
```

| Сервис | URL |
|--------|-----|
| PostgreSQL | `localhost:5432` |
| pgAdmin | http://localhost:5050 |

> **pgAdmin:** логин `admin@freelancehub.com` / пароль `admin123`  
> Подключение к БД: host `postgres`, port `5432`, database `freelancehub`, user `flhub_user`

---

### 2️⃣ Запуск Backend

```bash
cd FreeLanceHub.API
dotnet run
```

| Сервис | URL |
|--------|-----|
| API | http://localhost:5000 |
| Swagger UI | http://localhost:5000/swagger |

> При первом запуске автоматически применяются миграции и создаются начальные данные (роли, категории, навыки, аккаунт администратора).

---

### 3️⃣ Запуск Frontend

```bash
cd freelancehub-frontend
npm install
npm run dev
```

Приложение доступно на: **http://localhost:5173**

---

## 🗂 Структура проекта

```
FreeLanceHub/
├── FreeLanceHub.sln
├── docker-compose.yml
│
├── FreeLanceHub.API/              # ASP.NET Core Web API
│   ├── Controllers/               # AuthController, GigsController, OrdersController...
│   ├── DTOs/                      # Объекты передачи данных
│   └── Middleware/                # Глобальный обработчик ошибок
│
├── FreeLanceHub.Core/             # Бизнес-логика (Class Library)
│   ├── Entities/                  # EF Core сущности
│   ├── Enums/                     # GigStatus, OrderStatus, ProposalStatus
│   └── Interfaces/                # Абстракции сервисов
│
└── FreeLanceHub.Infrastructure/   # Инфраструктура (Class Library)
    ├── Data/                      # ApplicationDbContext + Migrations
    ├── Services/                  # Реализации бизнес-логики
    └── SeedData/                  # Начальные данные

freelancehub-frontend/
└── src/
    ├── api/          # Axios + функции вызовов API
    ├── components/   # Переиспользуемые UI-компоненты
    ├── hooks/        # React Query хуки
    ├── pages/        # Страницы (auth, gigs, orders, profile, admin)
    ├── routes/       # React Router, ProtectedRoute, RoleRoute
    ├── store/        # Zustand (authStore)
    └── types/        # TypeScript типы
```

---

## 📡 API документация

Полная интерактивная документация доступна в **Swagger UI**: http://localhost:5000/swagger

### Основные эндпоинты

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| `POST` | `/api/auth/register` | Public | Регистрация |
| `POST` | `/api/auth/login` | Public | Вход, получение JWT |
| `GET` | `/api/auth/me` | Auth | Текущий пользователь |
| `GET` | `/api/gigs` | Public | Список услуг (с фильтрами и пагинацией) |
| `POST` | `/api/gigs` | Student | Создать услугу |
| `GET` | `/api/orders` | Public | Список заказов |
| `POST` | `/api/orders` | Employer | Создать заказ |
| `POST` | `/api/proposals` | Student | Подать отклик |
| `PUT` | `/api/proposals/{id}/accept` | Employer | Принять отклик |
| `PUT` | `/api/orders/{id}/complete` | Student | Сигнал о завершении |
| `PUT` | `/api/orders/{id}/confirm` | Employer | Подтвердить завершение |
| `POST` | `/api/reviews` | Auth | Оставить отзыв |
| `GET` | `/api/notifications` | Auth | Мои уведомления |
| `GET` | `/api/admin/stats` | Admin | Статистика платформы |
| `PUT` | `/api/admin/users/{id}/block` | Admin | Блокировка пользователя |
| `PUT` | `/api/admin/gigs/{id}/status` | Admin | Модерация услуги |

---

## 👥 Роли пользователей

### Жизненный цикл заказа

```
[Employer] Создаёт Order (status: Open)
      ↓
[Student] Подаёт Proposal
      ↓
[Employer] Принимает Proposal → Order (status: InProgress)
      ↓
[Student] Завершает работу → Order (status: AwaitingConfirmation)
      ↓
[Employer] Подтверждает → Order (status: Completed)
      ↓
Обе стороны оставляют отзыв → Рейтинг пересчитывается
```

### Жизненный цикл услуги (Gig)

```
[Student] Создаёт Gig (status: Pending)
      ↓
[Admin] Одобряет → Gig (status: Active) / Отклоняет → Rejected
```

---

## 🗄 База данных

Схема построена на **PostgreSQL** с использованием UUID в качестве первичных ключей.

**Основные таблицы:**

- `AspNetUsers` — пользователи (расширенные через Identity)
- `Gigs` — услуги студентов
- `Orders` — заказы работодателей
- `Proposals` — отклики студентов на заказы
- `Reviews` — отзывы после завершения заказа
- `Categories` — категории услуг и заказов
- `Skills` — навыки / теги
- `Notifications` — уведомления пользователей
- `UserSkills`, `GigSkills`, `OrderSkills` — связующие таблицы (many-to-many)

### Категории услуг

- Веб-разработка
- Мобильная разработка
- Дизайн (UI/UX, графика)
- Копирайтинг и контент
- Математика / Физика / Помощь с учёбой
- Переводы
- Видео и аудио
- Прочее

---

## 🔑 Тестовые аккаунты

После первого запуска автоматически создаётся:

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | `admin@freelancehub.com` | `Admin@123456` |

Студентов и работодателей можно зарегистрировать через форму регистрации на сайте или через Swagger.

---

## 🌐 Порты и адреса

| Сервис | Порт | URL |
|--------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (ASP.NET Core) | 5000 | http://localhost:5000 |
| Swagger UI | 5000 | http://localhost:5000/swagger |
| PostgreSQL | 5432 | `localhost:5432` |
| pgAdmin | 5050 | http://localhost:5050 |

---

## 📜 Лицензия

Проект разработан в рамках курсовой работы.