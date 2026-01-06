'use client';
import { useGetTodosQuery, usePostTodosMutation, useDeleteTodoMutation, useChangeTodoMutation } from './../api/api';
import { useState } from 'react';
import styles from './page.module.css';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const { data, error, isLoading } = useGetTodosQuery();
  const [postTodos] = usePostTodosMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [changeTodo] = useChangeTodoMutation();

  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      await postTodos({ text: input }).unwrap(); // unwrap выбрасывает ошибку если не 2xx
      setInput('');
    } catch (err) {
      console.error('Ошибка при добавлении todo:', err);
    }
  };

  const deleteTodos = async (id: number) => {
    try {
      await deleteTodo({ id }).unwrap();
    } catch (err) {
      console.error('Ошибка при добавлении todo:', err);
    }
  };

  const updateTodo = async (
    id: number,
    changes: { text?: string; completed?: boolean }
  ) => {
    const todo = data?.find((t) => t.id === id);
    if (!todo) return;

    try {
      await changeTodo({
        id,
        ...changes,
      }).unwrap();
    } catch (err) {
      console.error('Ошибка при обновлении todo:', err);
    }
  };

  const toggleTodo = (id: number) => {
    const todo = data?.find((t) => t.id === id);
    if (!todo) return;

    updateTodo(id, { completed: !todo.completed });
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = async (id: number) => {
    await updateTodo(id, { text: editingText });

    setEditingId(null);
    setEditingText('');
  };

  if (isLoading) return <main className={`${styles.container} ${styles.mistakes}`}><p>Loading...</p> </main>;
  if (error) return <main className={`${styles.container} ${styles.mistakes}`}><p>Error</p> </main>;

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
                onClick={() => deleteTodos(todo.id)}
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