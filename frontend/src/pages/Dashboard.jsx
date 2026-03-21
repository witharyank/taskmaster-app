import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import { LogOut, Plus, Trash2, Edit2, CheckCircle, Circle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await client.get(`/tasks${statusFilter ? `?status=${statusFilter}` : ''}`);
      setTasks(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await client.post('/tasks', { title });
      setTitle('');
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = async (task) => {
    try {
      await client.put(`/tasks/${task.id}`, {
        ...task,
        status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>TaskMaster</h2>
        </div>
        <div className="navbar-user">
          <span>Welcome, {user.name}</span>
          <button onClick={logout} className="btn-icon">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="task-header">
          <h1>Your Tasks</h1>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">All Tasks</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="task-form-card">
          <form onSubmit={handleCreateTask} className="task-form">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="task-input"
            />
            <button type="submit" className="btn btn-primary add-btn">
              <Plus size={20} /> Add
            </button>
          </form>
        </div>

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">No tasks found. Create one above!</div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`task-item ${task.status === 'COMPLETED' ? 'completed' : ''}`}>
                  <div className="task-content">
                    <button className="status-btn" onClick={() => toggleStatus(task)}>
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle className="text-success" />
                      ) : (
                        <Circle className="text-muted" />
                      )}
                    </button>
                    <span className="task-title">{task.title}</span>
                  </div>
                  <div className="task-actions">
                    <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
