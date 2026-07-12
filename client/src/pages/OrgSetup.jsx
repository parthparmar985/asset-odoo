import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const OrgSetup = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  
  // For Add Modals (simplified inline for now)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (activeTab === 'departments') {
        const { data } = await axios.get('/api/departments', config);
        setDepartments(data);
      } else if (activeTab === 'categories') {
        const { data } = await axios.get('/api/categories', config);
        setCategories(data);
      } else if (activeTab === 'employees') {
        const { data } = await axios.get('/api/auth/users', config);
        setUsers(data);
      }
    } catch (error) {
      toast.error('Error fetching data');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItemName) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (activeTab === 'departments') {
        await axios.post('/api/departments', { name: newItemName }, config);
        toast.success('Department created!');
      } else if (activeTab === 'categories') {
        await axios.post('/api/categories', { name: newItemName }, config);
        toast.success('Category created!');
      }
      setNewItemName('');
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating item');
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/auth/${userId}/role`, { role: newRole }, config);
      toast.success('User role updated!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating role');
    }
  };

  // UI styles to exactly match the wireframe
  const styles = {
    tabsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    tabGroup: {
      display: 'flex',
      gap: '0.75rem'
    },
    pillButton: (isActive) => ({
      padding: '0.5rem 1.5rem',
      borderRadius: '20px',
      border: '1.5px solid #1E293B',
      backgroundColor: isActive ? '#E2F0EA' : '#FFFFFF',
      color: '#1E293B',
      fontWeight: '600',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: isActive ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
    }),
    addButton: {
      padding: '0.5rem 1.5rem',
      borderRadius: '20px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#E2F0EA',
      color: '#1E293B',
      fontWeight: '600',
      fontSize: '0.875rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    tableHeader: {
      backgroundColor: '#F1F0EA',
      borderRadius: '12px',
      border: '1.5px solid #1E293B',
      display: 'grid',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.5rem'
    },
    tableRow: {
      display: 'grid',
      padding: '0.875rem 1.5rem',
      alignItems: 'center',
      borderBottom: '1px solid #E2E8F0',
      color: '#334155'
    },
    statusBadge: (isActive) => ({
      display: 'inline-block',
      padding: '0.25rem 1rem',
      borderRadius: '20px',
      border: `1.5px solid ${isActive ? '#10B981' : '#64748B'}`,
      backgroundColor: 'transparent',
      color: '#1E293B',
      fontSize: '0.75rem',
      fontWeight: '600'
    }),
    noteText: {
      marginTop: '3rem',
      paddingTop: '1rem',
      borderTop: '1.5px solid #E2E8F0',
      color: '#64748B',
      fontStyle: 'italic',
      fontSize: '0.875rem'
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1rem', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Header and Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabGroup}>
          <button style={styles.pillButton(activeTab === 'departments')} onClick={() => setActiveTab('departments')}>
            Departments
          </button>
          <button style={styles.pillButton(activeTab === 'categories')} onClick={() => setActiveTab('categories')}>
            Categories
          </button>
          <button style={styles.pillButton(activeTab === 'employees')} onClick={() => setActiveTab('employees')}>
            Employee
          </button>
        </div>
        
        {activeTab !== 'employees' && (
          <button style={styles.addButton} onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={16} /> Add
          </button>
        )}
      </div>

      {/* Add Item Form (Inline) */}
      {showAddForm && (
        <form onSubmit={handleAdd} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder={`New ${activeTab === 'departments' ? 'Department' : 'Category'} Name`}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid #CBD5E1', flex: 1, maxWidth: '300px' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Save</button>
        </form>
      )}

      {/* Tables based on Active Tab */}
      <div>
        
        {/* DEPARTMENTS TAB */}
        {activeTab === 'departments' && (
          <div>
            <div style={{ ...styles.tableHeader, gridTemplateColumns: '2fr 2fr 2fr 1fr' }}>
              <div>Department</div>
              <div>Head</div>
              <div>Parent Dept</div>
              <div>Status</div>
            </div>
            {departments.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No departments found.</div>}
            {departments.map((dept) => (
              <div key={dept._id} style={{ ...styles.tableRow, gridTemplateColumns: '2fr 2fr 2fr 1fr' }}>
                <div style={{ fontWeight: '500' }}>{dept.name}</div>
                <div>{dept.headId?.name || '--'}</div>
                <div>{dept.parentDepartmentId?.name || '--'}</div>
                <div>
                  <span style={styles.statusBadge(dept.isActive)}>
                    {dept.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
            <div style={styles.noteText}>
              Editing a department here also drives the picklist in Screen 4 & 5
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ ...styles.tableHeader, gridTemplateColumns: '2fr 1fr' }}>
              <div>Category Name</div>
              <div>Status</div>
            </div>
            {categories.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No categories found.</div>}
            {categories.map((cat) => (
              <div key={cat._id} style={{ ...styles.tableRow, gridTemplateColumns: '2fr 1fr' }}>
                <div style={{ fontWeight: '500' }}>{cat.name}</div>
                <div>
                  <span style={styles.statusBadge(true)}>Active</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPLOYEES TAB */}
        {activeTab === 'employees' && (
          <div>
            <div style={{ ...styles.tableHeader, gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr' }}>
              <div>Name</div>
              <div>Email</div>
              <div>Department</div>
              <div>Role</div>
              <div>Status</div>
            </div>
            {users.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No employees found.</div>}
            {users.map((u) => (
              <div key={u._id} style={{ ...styles.tableRow, gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr' }}>
                <div style={{ fontWeight: '500' }}>{u.name}</div>
                <div style={{ color: '#64748B' }}>{u.email}</div>
                <div>{u.departmentId?.name || '--'}</div>
                <div>
                  <select 
                    value={u.role} 
                    onChange={(e) => updateRole(u._id, e.target.value)}
                    style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '8px', 
                      border: '1px solid #CBD5E1',
                      background: 'transparent'
                    }}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Department Head">Dept Head</option>
                    <option value="Asset Manager">Asset Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <span style={styles.statusBadge(true)}>Active</span>
                </div>
              </div>
            ))}
            <div style={styles.noteText}>
              Admin promotes an Employee to Department Head or Asset Manager here — this is the only place roles are assigned.
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default OrgSetup;
