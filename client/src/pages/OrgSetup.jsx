import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const OrgSetup = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('departments');
  
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  // Editing state for full row editing
  const [editItemId, setEditItemId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [deptRes, catRes, usersRes] = await Promise.all([
        axios.get('/api/departments', config).catch(() => ({ data: [] })),
        axios.get('/api/categories', config).catch(() => ({ data: [] })),
        axios.get('/api/auth/users', config).catch(() => ({ data: [] }))
      ]);
      setDepartments(deptRes.data);
      setCategories(catRes.data);
      setUsers(usersRes.data);
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

  const handleEditSave = async (id) => {
    if (!editData.name?.trim()) return setEditItemId(null);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (activeTab === 'departments') {
        const payload = {
          name: editData.name,
          status: editData.status,
          head: editData.head || null,
          parentDepartment: editData.parentDepartment || null
        };
        await axios.put(`/api/departments/${id}`, payload, config);
        toast.success('Department fully updated!');
      } else if (activeTab === 'categories') {
        await axios.put(`/api/categories/${id}`, { name: editData.name, status: editData.status }, config);
        toast.success('Category fully updated!');
      } else if (activeTab === 'employees') {
        const payload = { name: editData.name, email: editData.email, department: editData.department || null, role: editData.role, status: editData.status };
        await axios.put(`/api/auth/${id}`, payload, config);
        toast.success('Employee fully updated!');
      }
      setEditItemId(null);
      setEditData({});
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating item');
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

  const startEdit = (item, type) => {
    setEditItemId(item._id);
    if (type === 'dept') {
      setEditData({
        name: item.name,
        head: item.head?._id || '',
        parentDepartment: item.parentDepartment?._id || '',
        status: item.status || 'Active'
      });
    } else if (type === 'cat') {
      setEditData({
        name: item.name,
        status: item.status || 'Active'
      });
    } else if (type === 'emp') {
      setEditData({
        name: item.name,
        email: item.email,
        department: item.department?._id || '',
        role: item.role || 'Employee',
        status: item.status || 'Active'
      });
    }
  };

  const styles = {
    tabsContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    tabGroup: { display: 'flex', gap: '0.75rem' },
    pillButton: (isActive) => ({
      padding: '0.5rem 1.5rem', borderRadius: '20px', border: '1.5px solid #1E293B',
      backgroundColor: isActive ? '#E2F0EA' : '#FFFFFF', color: '#1E293B', fontWeight: '600',
      fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isActive ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
    }),
    addButton: {
      padding: '0.5rem 1.5rem', borderRadius: '20px', border: '1.5px solid #1E293B', backgroundColor: '#E2F0EA',
      color: '#1E293B', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'
    },
    tableHeader: {
      backgroundColor: '#F1F0EA', borderRadius: '12px', border: '1.5px solid #1E293B', display: 'grid',
      padding: '0.75rem 1.5rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem'
    },
    tableRow: { display: 'grid', padding: '0.875rem 1.5rem', alignItems: 'center', borderBottom: '1px solid #E2E8F0', color: '#334155' },
    statusBadge: (status) => ({
      display: 'inline-block', padding: '0.25rem 1rem', borderRadius: '20px', border: `1.5px solid ${status === 'Active' ? '#10B981' : '#64748B'}`,
      backgroundColor: 'transparent', color: '#1E293B', fontSize: '0.75rem', fontWeight: '600'
    }),
    noteText: { marginTop: '3rem', paddingTop: '1rem', borderTop: '1.5px solid #E2E8F0', color: '#64748B', fontStyle: 'italic', fontSize: '0.875rem' },
    actionBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.3rem', borderRadius: '8px', cursor: 'pointer', background: 'transparent', border: '1px solid #CBD5E1', color: '#475569', transition: 'all 0.2s' },
    editInput: { padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1.5px solid #3B82F6', outline: 'none', width: '100%', fontSize: '0.85rem', color: '#0F172A' },
    editSelect: { padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1.5px solid #3B82F6', outline: 'none', width: '100%', fontSize: '0.85rem', color: '#0F172A', background: '#FFFFFF' }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1rem', fontFamily: "'Outfit', sans-serif" }}>
      <div style={styles.tabsContainer}>
        <div style={styles.tabGroup}>
          <button style={styles.pillButton(activeTab === 'departments')} onClick={() => { setActiveTab('departments'); setEditItemId(null); }}>Departments</button>
          <button style={styles.pillButton(activeTab === 'categories')} onClick={() => { setActiveTab('categories'); setEditItemId(null); }}>Categories</button>
          <button style={styles.pillButton(activeTab === 'employees')} onClick={() => setActiveTab('employees')}>Employee</button>
        </div>
        {activeTab !== 'employees' && (
          <button style={styles.addButton} onClick={() => setShowAddForm(!showAddForm)}><Plus size={16} /> Add</button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <input type="text" placeholder={`New ${activeTab === 'departments' ? 'Department' : 'Category'} Name`} value={newItemName} onChange={(e) => setNewItemName(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid #CBD5E1', flex: 1, maxWidth: '300px' }} />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Save</button>
        </form>
      )}

      <div>
        {activeTab === 'departments' && (
          <div>
            <div style={{ ...styles.tableHeader, gridTemplateColumns: '2fr 2fr 2fr 1.5fr 70px', gap: '1rem' }}>
              <div>Department Name</div><div>Head</div><div>Parent Dept</div><div>Status</div><div style={{ textAlign: 'center' }}>Edit</div>
            </div>
            {departments.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No departments found.</div>}
            {departments.map((dept) => (
              <div key={dept._id} style={{ ...styles.tableRow, gridTemplateColumns: '2fr 2fr 2fr 1.5fr 70px', gap: '1rem' }}>
                {editItemId === dept._id ? (
                  <>
                    <div><input autoFocus type="text" style={styles.editInput} value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} /></div>
                    <div>
                      <select style={styles.editSelect} value={editData.head} onChange={(e) => setEditData({...editData, head: e.target.value})}>
                        <option value="">-- No Head --</option>
                        {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <select style={styles.editSelect} value={editData.parentDepartment} onChange={(e) => setEditData({...editData, parentDepartment: e.target.value})}>
                        <option value="">-- No Parent --</option>
                        {departments.filter(d => d._id !== dept._id).map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <select style={styles.editSelect} value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value})}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button style={{ ...styles.actionBtn, borderColor: '#10B981', color: '#10B981' }} onClick={() => handleEditSave(dept._id)}><Check size={14}/></button>
                      <button style={{ ...styles.actionBtn, borderColor: '#EF4444', color: '#EF4444' }} onClick={() => setEditItemId(null)}><X size={14}/></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: '500' }}>{dept.name}</div>
                    <div>{dept.head?.name || '--'}</div>
                    <div>{dept.parentDepartment?.name || '--'}</div>
                    <div><span style={styles.statusBadge(dept.status || 'Active')}>{dept.status || 'Active'}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button style={styles.actionBtn} onClick={() => startEdit(dept, 'dept')}><Edit2 size={14}/></button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div style={styles.noteText}>Editing a department here also drives the picklist in Screen 4 & 5</div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div style={{ ...styles.tableHeader, gridTemplateColumns: '2fr 1.5fr 70px', gap: '1rem' }}>
              <div>Category Name</div><div>Status</div><div style={{ textAlign: 'center' }}>Edit</div>
            </div>
            {categories.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No categories found.</div>}
            {categories.map((cat) => (
              <div key={cat._id} style={{ ...styles.tableRow, gridTemplateColumns: '2fr 1.5fr 70px', gap: '1rem' }}>
                {editItemId === cat._id ? (
                  <>
                    <div><input autoFocus type="text" style={styles.editInput} value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} /></div>
                    <div>
                      <select style={styles.editSelect} value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value})}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button style={{ ...styles.actionBtn, borderColor: '#10B981', color: '#10B981' }} onClick={() => handleEditSave(cat._id)}><Check size={14}/></button>
                      <button style={{ ...styles.actionBtn, borderColor: '#EF4444', color: '#EF4444' }} onClick={() => setEditItemId(null)}><X size={14}/></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: '500' }}>{cat.name}</div>
                    <div><span style={styles.statusBadge(cat.status || 'Active')}>{cat.status || 'Active'}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button style={styles.actionBtn} onClick={() => startEdit(cat, 'cat')}><Edit2 size={14}/></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'employees' && (
          <div>
            <div style={{ ...styles.tableHeader, gridTemplateColumns: '1.5fr 2fr 1.5fr 1fr 1fr 70px', gap: '0.5rem' }}>
              <div>Name</div><div>Email</div><div>Department</div><div>Role</div><div>Status</div><div style={{ textAlign: 'center' }}>Edit</div>
            </div>
            {users.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No employees found.</div>}
            {users.map((u) => (
              <div key={u._id} style={{ ...styles.tableRow, gridTemplateColumns: '1.5fr 2fr 1.5fr 1fr 1fr 70px', gap: '0.5rem' }}>
                {editItemId === u._id ? (
                  <>
                    <div><input autoFocus type="text" style={styles.editInput} value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} /></div>
                    <div><input type="text" style={styles.editInput} value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} /></div>
                    <div>
                      <select style={styles.editSelect} value={editData.department} onChange={(e) => setEditData({...editData, department: e.target.value})}>
                        <option value="">-- None --</option>
                        {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <select style={styles.editSelect} value={editData.role} onChange={(e) => setEditData({...editData, role: e.target.value})}>
                        <option value="Employee">Employee</option><option value="Department Head">Dept Head</option><option value="Asset Manager">Asset Manager</option><option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <select style={styles.editSelect} value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value})}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button style={{ ...styles.actionBtn, borderColor: '#10B981', color: '#10B981' }} onClick={() => handleEditSave(u._id)}><Check size={14}/></button>
                      <button style={{ ...styles.actionBtn, borderColor: '#EF4444', color: '#EF4444' }} onClick={() => setEditItemId(null)}><X size={14}/></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: '500' }}>{u.name}</div>
                    <div style={{ color: '#64748B' }}>{u.email}</div>
                    <div>{u.department?.name || '--'}</div>
                    <div>
                      <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)} style={{ padding: '0.35rem 0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'transparent', fontSize: '0.85rem', width: '100%' }}>
                        <option value="Employee">Employee</option><option value="Department Head">Dept Head</option><option value="Asset Manager">Asset Manager</option><option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div><span style={styles.statusBadge(u.status || 'Active')}>{u.status || 'Active'}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button style={styles.actionBtn} onClick={() => startEdit(u, 'emp')}><Edit2 size={14}/></button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div style={styles.noteText}>Admin promotes an Employee to Department Head or Asset Manager here — this is the only place roles are assigned.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgSetup;
