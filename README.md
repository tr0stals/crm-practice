# 🚀 CRM-PRACTICE

[![last commit](https://img.shields.io/github/last-commit/tr0stals/crm-practice?style=flat-square)](https://github.com/tr0stals/crm-practice/commits/main)
[![TypeScript](https://img.shields.io/badge/typescript-71%25-blue?style=flat-square)](https://github.com/tr0stals/crm-practice)
[![Languages](https://img.shields.io/github/languages/count/tr0stals/crm-practice?style=flat-square)](https://github.com/tr0stals/crm-practice)
[![Stars](https://img.shields.io/github/stars/tr0stals/crm-practice?style=flat-square)](https://github.com/tr0stals/crm-practice/stargazers)
[![License](https://img.shields.io/github/license/tr0stals/crm-practice?style=flat-square)](LICENSE)

> **Модульная CRM-платформа: Backend (NestJS), Frontend (Vue 3), Unity-клиент**

---

## 📑 Table of Contents
- [Description](#description)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Run & Test](#run--test)
- [Extensibility](#extensibility)
- [Contributing](#contributing)
- [License](#license)
- [Documentation](#documentation)

---

## 📝 Description

**crm-practice** — это комплексная open-source CRM-система с модульной архитектурой, поддержкой сложных бизнес-процессов, кастомных сущностей и интеграций. Включает:
- Backend на NestJS/TypeORM (MySQL)
- Frontend на Vue 3 + PrimeVue
- Unity-проект (CRM_APracticum) — аналог/клиент CRM для интеграции с другими системами или визуализации

---

## 🏗️ Architecture

```
+-----------------------------+
|  Frontend (Vue 3 + PrimeVue)|
+-----------------------------+
              |
              |  REST API
              v
+-----------------------------+
| Backend (NestJS + TypeORM)  |
+-----------------------------+
      ^                |
      |                |  MySQL
      |                v
      |      +------------------+
      |      |   Database       |
      |      +------------------+
      |
      |  API/Интеграция
      |
+-----------------------------+
| Unity Client (CRM_APracticum)|
+-----------------------------+
```

- **Backend**: Модульная структура, REST API, авторизация, сидирование, локализация, импорт/экспорт, кэширование
- **Frontend**: Современный SPA, feature-sliced архитектура, PrimeVue UI
- **Unity**: Клиент/интеграция для визуализации или автоматизации бизнес-процессов

---

## ✨ Features

- 🧩 Модульный дизайн (каждая бизнес-область — отдельный модуль)
- 🔐 Авторизация, роли, права доступа
- 🌍 Локализация (централизованная)
- 🔗 Сложные связи данных (организации, сотрудники, стенды, PCB, поставки, заказы, инвентаризация и др.)
- 🚀 API-first: REST endpoints для всех сущностей
- 📦 Импорт/экспорт, сидирование, кэширование
- 🧪 E2E и unit тесты
- 🖥️ Unity-клиент для интеграций/визуализации

---

## 🛠️ Tech Stack

**Backend:**  
![NestJS](https://img.shields.io/badge/-NestJS-e0234e?logo=nestjs&logoColor=white&style=flat-square)
![TypeORM](https://img.shields.io/badge/-TypeORM-e83524?logo=typeorm&logoColor=white&style=flat-square)
![MySQL](https://img.shields.io/badge/-MySQL-4479a1?logo=mysql&logoColor=white&style=flat-square)
![Passport](https://img.shields.io/badge/-Passport-34e27a?logo=passport&logoColor=white&style=flat-square)

**Frontend:**  
![Vue.js](https://img.shields.io/badge/-Vue.js-42b883?logo=vue.js&logoColor=white&style=flat-square)
![PrimeVue](https://img.shields.io/badge/-PrimeVue-42b883?logo=primevue&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/-Vite-646cff?logo=vite&logoColor=white&style=flat-square)
![Sass](https://img.shields.io/badge/-Sass-cc6699?logo=sass&logoColor=white&style=flat-square)

**Unity:**  
![Unity](https://img.shields.io/badge/-Unity-222c37?logo=unity&logoColor=white&style=flat-square)

---

## 📚 Документация

- [Backend API (TypeDoc)](./backend/docs/index.html) — автогенерируемая документация по серверному коду (NestJS/TypeScript).

_Рекомендуется опубликовать папку docs как GitHub Pages для удобного просмотра онлайн / Открыть документацию локально_

---

## ⚡ Quick Start

### Backend
```bash
git clone https://github.com/tr0stals/crm-practice
cd crm-practice/backend
npm install
npm run start:dev
```

### Frontend
```bash
cd crm-practice/frontend
npm install
npm run dev
```

### Unity (CRM_APracticum)
- Открыть проект `/CRM_APracticum` в Unity Hub
- Собрать и запустить проект через Unity Editor

---

## ▶️ Run & Test

- **Backend:**
  - `npm run start:dev` — запуск сервера
  - `npm run test` — юнит-тесты
  - `npm run test:e2e` — e2e тесты
- **Frontend:**
  - `npm run dev` — запуск SPA
- **Unity:**
  - Запуск через Unity Editor (поддержка .NET, интеграция с API CRM)

---

## 🧩 Extensibility
- Добавляй новые модули (NestJS, feature-sliced Vue)
- Используй сидирование и миграции для тестовых данных
- Интегрируй внешние сервисы через REST API
- Unity-клиент можно расширять под любые задачи (визуализация, автоматизация, интеграция)

---

## 🤝 Contributing
PRs, багрепорты и идеи приветствуются! Открывай issues, предлагай улучшения, делай форки.

---

## 📄 License
[MIT](LICENSE)

---

> _Built with ❤️ by [96ix9ine, pavelbekarev, AdonChel, YumpA, tr0stals, SolitudeAlways](https://github.com/tr0stals)_
