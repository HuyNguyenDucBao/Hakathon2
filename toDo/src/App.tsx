import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './App.css';

interface ITodo {
  id: number;
  name: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  // State để lưu trữ danh sách công việc
  const [todos, setTodos] = useState<ITodo[]>([
    { id: 1, name: 'Công việc 1', completed: false },
    { id: 2, name: 'Công việc 2', completed: true },
    { id: 3, name: 'Công việc 3', completed: false },
  ]); 

  // State để quản lý công việc hiện tại đang nhập
  const [task, setTask] = useState<string>('');

  // State để theo dõi công việc đang được chỉnh sửa
  const [editingId, setEditingId] = useState<number | null>(null);

  // State để quản lý lỗi xác thực
  const [error, setError] = useState<string>('');

  // Tải danh sách công việc từ localStorage khi component được mount
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Lưu danh sách công việc vào localStorage mỗi khi chúng thay đổi
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Hàm để xử lý thêm hoặc chỉnh sửa công việc
  const handleAddEdit = (): void => {
    if (!task.trim()) {
      setError('Tên công việc không được để trống');
      return;
    }
    if (todos.some((t) => t.name === task && t.id !== editingId)) {
      setError('Tên công việc không được phép trùng');
      return;
    }
    setError('');
    if (editingId) {
      setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, name: task } : todo)));
      setEditingId(null);
    } else {
      setTodos([...todos, { id: Date.now(), name: task, completed: false }]);
    }
    setTask('');
  };

  // Hàm để xử lý xóa công việc
  const handleDelete = (id: number): void => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  // Hàm để xử lý chỉnh sửa công việc
  const handleEdit = (id: number): void => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setTask(todoToEdit.name);
      setEditingId(id);
    }
  };

  // Hàm để chuyển đổi trạng thái hoàn thành của công việc
  const toggleComplete = (id: number): void => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  // Tính toán số lượng công việc đã hoàn thành
  const completedCount = todos.filter((todo) => todo.completed).length;

  // Kiểm tra xem tất cả công việc đã hoàn thành hay chưa
  const allCompleted = todos.length > 0 && completedCount === todos.length;

  return (
    <div className="todo-app">
      <Typography variant="h5">Danh sách công việc</Typography>
      <div className="input-container">
        <TextField
          placeholder="Nhập tên công việc"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleAddEdit} fullWidth>
          {editingId ? 'Lưu' : 'Thêm'}
        </Button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id} className="todo-item">
            <div className="todo-content">
              <Checkbox checked={todo.completed} onChange={() => toggleComplete(todo.id)} />
              <ListItemText primary={todo.name} className={todo.completed ? 'completed-task' : ''} />
            </div>
            <div className="todo-actions">
              <IconButton onClick={() => handleEdit(todo.id)}>
                <EditIcon className="edit-icon" />
              </IconButton>
              <IconButton onClick={() => handleDelete(todo.id)}>
                <DeleteIcon className="delete-icon" />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
      {todos.length > 0 &&
        (allCompleted ? (
          <div className="completion-message">
            <CheckCircleOutlineIcon className="completion-icon" />
            Hoàn thành công việc
          </div>
        ) : (
          <div className="todo-status">
            Công việc đã hoàn thành: {completedCount}/{todos.length}
          </div>
        ))}
    </div>
  );
};

export default TodoApp;
