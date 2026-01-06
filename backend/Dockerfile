# 1. Базовый образ
FROM node:20-alpine

# 2. Создаём рабочую директорию
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем исходники
COPY . .

# 6. Экспонируем порт
EXPOSE 4000

# 7. Команда запуска
CMD ["npm", "run", "dev"]