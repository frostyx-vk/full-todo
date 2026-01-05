'use client';
import { useGetTodosQuery, usePostTodosMutation } from './../api/api';
import { useState } from 'react';
import styles from './page.module.css';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const { data, error, isLoading } = useGetTodosQuery();
  const [postTodos] = usePostTodosMutation();

  const addTodo = async () => {
    if (!input.trim()) return;

    try {
      await postTodos({ text: input }).unwrap(); // unwrap выбрасывает ошибку если не 2xx
      setInput('');
    } catch (err) {
      console.error('Ошибка при добавлении todo:', err);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = (id: number) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: editingText } : t
      )
    );
    setEditingId(null);
    setEditingText('');
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>📝 Todo List</h1>

      <div className={styles.addBlock}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { e.key === 'Enter' && addTodo() }}
          placeholder='Добавить...'
        />
        <button className={styles.addButton} onClick={addTodo}>
          Добавить
        </button>
      </div>

      <ul className={styles.list}>
        {Array.isArray(data) && data.length > 0 && data.map((todo) => (
          <li
            key={todo.id}
            className={`${styles.todo} ${todo.completed ? styles.completed : ''}`}
          >
            {editingId === todo.id ? (
              <input
                className={styles.editInput}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
            ) : (
              <span className={styles.text}>{todo.text}</span>
            )}

            <div className={styles.actions}>
              <button
                className={styles.actionButton}
                onClick={() => toggleTodo(todo.id)}
              >
                ✅
              </button>

              {editingId === todo.id ? (
                <button
                  className={styles.actionButton}
                  onClick={() => saveEdit(todo.id)}
                >
                  💾
                </button>
              ) : (
                <button
                  className={styles.actionButton}
                  onClick={() => startEdit(todo)}
                >
                  ✏️
                </button>
              )}

              <button
                className={styles.deleteButton}
                onClick={() => deleteTodo(todo.id)}
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}