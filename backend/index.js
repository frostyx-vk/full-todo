require('dotenv').config(); // читаем .env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({ origin: '*' })); // разрешаем запросы с любого домена
app.use(bodyParser.json());

// Работа с базой данных
const pool = require('./db');

// Хранилище в памяти
// let todos = [];   -   для локального хранения
// let currentId = 1;

// GET /todos — получить все
app.get('/api/todos', async (req, res) => {
    // res.json(todos);   -   для локального хранения

    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка с базой данных' });
    }
});

// POST /todos — добавить
app.post('/api/todos', async (req, res) => {
    // const { text } = req.body;
    // if (!text) return res.status(400).json({ error: 'Text required' });

    // const newTodo = { id: currentId++, text, completed: false };
    // todos.push(newTodo);
    // res.status(201).json(newTodo);

    const { text } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO todos (text) VALUES ($1) RETURNING *',
            [text]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка с базой данных' });
    }
});

// PATCH /todos/:id — редактировать / отметка выполнено
app.patch('/api/todos/:id', async (req, res) => {
    // const id = parseInt(req.params.id);
    // console.log(id);
    // const todo = todos.find((t) => t.id === id);
    // if (!todo) return res.status(404).json({ error: 'Todo not found' });

    // const { text, completed } = req.body;
    // if (text !== undefined) todo.text = text;
    // if (completed !== undefined) todo.completed = completed;

    // res.json(todo);

    const { id } = req.params;
    const { text, completed } = req.body;

    try {
        const result = await pool.query(
            `UPDATE todos
       SET text = COALESCE($1, text),
           completed = COALESCE($2, completed)
       WHERE id = $3
       RETURNING *`,
            [text, completed, id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ error: 'Todo не найдена' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка с базой данных' });
    }
});

// DELETE /todos/:id — удалить
app.delete('/api/todos/:id', async (req, res) => {
    // const id = parseInt(req.params.id);
    // const index = todos.findIndex((t) => t.id === id);
    // if (index === -1) return res.status(404).json({ error: 'Todo not found' });

    // const deleted = todos.splice(index, 1);
    // res.json(deleted[0]);

    const { id } = req.params;

    try {
        await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка с базой данных' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});