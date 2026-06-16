import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useOrder } from '../../context/OrderContext';
import { createService, updateService, deleteService } from '../../services/api';

const darkInput = { width:'100%', padding:'9px 12px', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.1)', background:'#16162a', color:'white', fontSize:13, outline:'none', colorScheme:'dark' };

export default function AdminServices() {
  const { services, fetchServices, invalidateServices } = useOrder();
  const [form, setForm] = useState({ name:'', description:'', price_per_kg:'', price_per_item:'', unit:'kg', estimated_days:2 });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchServices(); }, []);

  const handleSave = async e => {
    e.preventDefault();
    try {
      if (editId) await updateService(editId, form);
      else await createService(form);
      setMsg(editId ? 'Layanan diperbarui!' : 'Layanan ditambahkan!');
      setShowForm(false); setEditId(null);
      setForm({ name:'', description:'', price_per_kg:'', price_per_item:'', unit:'kg', estimated_days:2 });
      invalidateServices();
      fetchServices(true);
    } catch (err) { setMsg(err.response?.data?.message || 'Gagal'); }
  };

  const handleEdit = s => {
    setForm({ name:s.name, description:s.description||'', price_per_kg:s.price_per_kg||'', price_per_item:s.price_per_item||'', unit:s.unit, estimated_days:s.estimated_days });
    setEditId(s.id); setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Hapus layanan ini?')) return;
    try {
      await deleteService(id);
      invalidateServices(); fetchServices(true);
    } catch {}
  };

  return (
    <AdminLayout title="Layanan" subtitle="Kelola jenis layanan laundry"
      action={<button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name:'', description:'', price_per_kg:'', price_per_item:'', unit:'kg', estimated_days:2 }); }}
        style={{ padding:'9px 18px', borderRadius:10, border:'none', background:'#6C9CF8', color:'white', fontSize:13, fontWeight:500 }}>
        + Tambah Layanan
      </button>}>

      {msg && <div style={{ background:'rgba(29,158,117,0.15)', border:'0.5px solid rgba(29,158,117,0.3)', borderRadius:8, padding:'10px 14px', color:'#1D9E75', fontSize:13, marginBottom:16 }}>{msg}</div>}

      {showForm && (
        <div style={{ background:'#13131a', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:14, padding:20, marginBottom:20 }}>
          <h3 style={{ color:'white', fontSize:14, fontWeight:500, marginBottom:16 }}>{editId?'Edit Layanan':'Tambah Layanan Baru'}</h3>
          <form onSubmit={handleSave}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Nama Layanan</label><input style={darkInput} value={form.name} onChange={e => setForm({...form,name:e.target.value})} required /></div>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Unit</label>
                <select style={darkInput} value={form.unit} onChange={e => setForm({...form,unit:e.target.value})}>
                  <option value="kg">Per Kg</option><option value="item">Per Item</option><option value="set">Per Set</option>
                </select>
              </div>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Estimasi (hari)</label><input type="number" style={darkInput} value={form.estimated_days} onChange={e => setForm({...form,estimated_days:e.target.value})} /></div>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Harga/Kg (jika kg)</label><input type="number" style={darkInput} value={form.price_per_kg} onChange={e => setForm({...form,price_per_kg:e.target.value})} /></div>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Harga/Item (jika item)</label><input type="number" style={darkInput} value={form.price_per_item} onChange={e => setForm({...form,price_per_item:e.target.value})} /></div>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Deskripsi</label><input style={darkInput} value={form.description} onChange={e => setForm({...form,description:e.target.value})} /></div>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding:'8px 16px', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:13 }}>Batal</button>
              <button type="submit" style={{ padding:'8px 18px', borderRadius:8, border:'none', background:'#6C9CF8', color:'white', fontSize:13 }}>{editId?'Update':'Simpan'}</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
        {services.map(s => (
          <div key={s.id} style={{ background:'#13131a', border:'0.5px solid rgba(255,255,255,0.06)', borderRadius:14, padding:18, transition:'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(108,156,248,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:'white' }}>{s.name}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:3 }}>{s.description}</div>
              </div>
              <span style={{ fontSize:11, padding:'3px 8px', borderRadius:20, background:s.is_active?'rgba(29,158,117,0.15)':'rgba(226,75,74,0.15)', color:s.is_active?'#1D9E75':'#E24B4A', flexShrink:0 }}>
                {s.is_active?'Aktif':'Nonaktif'}
              </span>
            </div>
            <div style={{ fontSize:15, fontWeight:600, color:'#6C9CF8', marginBottom:4 }}>
              Rp {s.unit==='kg'?Number(s.price_per_kg).toLocaleString('id-ID'):Number(s.price_per_item).toLocaleString('id-ID')} / {s.unit}
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginBottom:14 }}>⏱ Estimasi {s.estimated_days} hari</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => handleEdit(s)} style={{ flex:1, padding:'7px', borderRadius:8, border:'none', background:'rgba(108,156,248,0.12)', color:'#6C9CF8', fontSize:12 }}>Edit</button>
              <button onClick={() => handleDelete(s.id)} style={{ flex:1, padding:'7px', borderRadius:8, border:'none', background:'rgba(226,75,74,0.1)', color:'#E24B4A', fontSize:12 }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
      {!services.length && <div style={{ textAlign:'center', padding:60, color:'rgba(255,255,255,0.25)', fontSize:13 }}>Belum ada layanan</div>}
    </AdminLayout>
  );
}
