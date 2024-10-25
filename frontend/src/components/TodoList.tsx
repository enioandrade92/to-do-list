import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addTodo, toggleTodo, removeTodo } from '../store/todoSlice';

const TodoList: React.FC = () => {
    const [newTodo, setNewTodo] = useState('');
    const todos = useSelector((state: RootState) => state.todos.todos);
    const dispatch = useDispatch();

    const handleAddTodo = () => {
        if (newTodo.trim()) {
            dispatch(addTodo(newTodo));
            setNewTodo('');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="border p-2 w-full"
                    placeholder="Add a new task"
                />
                <button
                    onClick={handleAddTodo}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Todo
                </button>
            </div>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id} className="todo-item">
                        <span
                            className={`todo-text ${todo.completed ? 'completed' : ''}`}
                            onClick={() => dispatch(toggleTodo(todo.id))}
                        >
                            {todo.text}
                        </span>
                        <button
                            onClick={() => dispatch(removeTodo(todo.id))}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
