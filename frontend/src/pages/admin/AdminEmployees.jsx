import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../services/api';

const darkInput = { width:'100%', padding:'9px 12px', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.1)', background:'#16162a', color:'white', fontSize:13, outline:'none', colorScheme:'dark' };

export default function AdminEmployees() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name:'', phone:'', position:'' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = () => getEmployees().then(r => setData(r.data));
  useEffect(() => { fetch(); }, []);

  const handleSave = async e => {
    e.preventDefault();
    if (editId) await updateEmployee(editId, form); else await createEmployee(form);
    setShowForm(false); setEditId(null); setForm({ name:'', phone:'', position:'' }); fetch();
  };

  const handleEdit = emp => { setForm({ name:emp.name, phone:emp.phone||'', position:emp.position||'' }); setEditId(emp.id); setShowForm(true); };

  return (
    <AdminLayout title="Karyawan" subtitle="Kelola data karyawan laundry"
      action={<button onClick={() => { setShowForm(!showForm); setEditId(null); }}
        style={{ padding:'9px 18px', borderRadius:10, border:'none', background:'#6C9CF8', color:'white', fontSize:13, fontWeight:500 }}>
        + Tambah Karyawan
      </button>}>

      {showForm && (
        <div style={{ background:'#13131a', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:14, padding:20, marginBottom:20 }}>
          <form onSubmit={handleSave}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Nama</label><input style={darkInput} value={form.name} onChange={e => setForm({...form,name:e.target.value})} required /></div>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>No. HP</label><input style={darkInput} value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /></div>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Jabatan</label><input style={darkInput} value={form.position} onChange={e => setForm({...form,position:e.target.value})} placeholder="Operator, Kasir..." /></div>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding:'8px 16px', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:13 }}>Batal</button>
              <button type="submit" style={{ padding:'8px 18px', borderRadius:8, border:'none', background:'#6C9CF8', color:'white', fontSize:13 }}>{editId?'Update':'Simpan'}</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
        {data.map(emp => (
          <div key={emp.id} style={{ background:'#13131a', border:'0.5px solid rgba(255,255,255,0.06)', borderRadius:14, padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#6C9CF8,#4F6FD0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:600, color:'white', flexShrink:0 }}>
                {emp.name[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:'white' }}>{emp.name}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{emp.position || 'Karyawan'}</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:14 }}>📞 {emp.phone || '—'}</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => handleEdit(emp)} style={{ flex:1, padding:'7px', borderRadius:8, border:'none', background:'rgba(108,156,248,0.12)', color:'#6C9CF8', fontSize:12 }}>Edit</button>
              <button onClick={async () => { if(window.confirm('Hapus karyawan?')) { await deleteEmployee(emp.id); fetch(); } }}
                style={{ flex:1, padding:'7px', borderRadius:8, border:'none', background:'rgba(226,75,74,0.1)', color:'#E24B4A', fontSize:12 }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
