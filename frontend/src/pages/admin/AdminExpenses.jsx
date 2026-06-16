import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getExpenses, createExpense, deleteExpense } from '../../services/api';

const darkInput = { width:'100%', padding:'9px 12px', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.1)', background:'#16162a', color:'white', fontSize:13, outline:'none', colorScheme:'dark' };

export default function AdminExpenses() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ description:'', amount:'', category:'', expense_date:new Date().toISOString().split('T')[0] });
  const [showForm, setShowForm] = useState(false);

  const fetch = () => getExpenses().then(r => setData(r.data));
  useEffect(() => { fetch(); }, []);

  const handleSave = async e => {
    e.preventDefault();
    await createExpense(form);
    setShowForm(false); setForm({ description:'', amount:'', category:'', expense_date:new Date().toISOString().split('T')[0] });
    fetch();
  };

  const total = data.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <AdminLayout title="Pengeluaran" subtitle="Catat pengeluaran operasional laundry"
      action={<button onClick={() => setShowForm(!showForm)}
        style={{ padding:'9px 18px', borderRadius:10, border:'none', background:'#6C9CF8', color:'white', fontSize:13, fontWeight:500 }}>
        + Tambah Pengeluaran
      </button>}>

      <div style={{ background:'rgba(239,159,39,0.1)', border:'0.5px solid rgba(239,159,39,0.2)', borderRadius:14, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ fontSize:28 }}>📊</div>
        <div>
          <div style={{ fontSize:20, fontWeight:600, color:'#EF9F27' }}>Rp {total.toLocaleString('id-ID')}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Total pengeluaran tercatat</div>
        </div>
      </div>

      {showForm && (
        <div style={{ background:'#13131a', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:14, padding:20, marginBottom:20 }}>
          <form onSubmit={handleSave}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:12 }}>
              <div style={{ gridColumn:'span 2' }}><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Deskripsi</label><input style={darkInput} value={form.description} onChange={e => setForm({...form,description:e.target.value})} required placeholder="Bayar listrik..." /></div>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Jumlah (Rp)</label><input type="number" style={darkInput} value={form.amount} onChange={e => setForm({...form,amount:e.target.value})} required /></div>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Kategori</label>
                <select style={darkInput} value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                  <option value="">Pilih kategori</option>
                  {['Listrik','Air','Gaji','Peralatan','Bahan','Lainnya'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:5 }}>Tanggal</label><input type="date" style={darkInput} value={form.expense_date} onChange={e => setForm({...form,expense_date:e.target.value})} /></div>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding:'8px 16px', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:13 }}>Batal</button>
              <button type="submit" style={{ padding:'8px 18px', borderRadius:8, border:'none', background:'#6C9CF8', color:'white', fontSize:13 }}>Simpan</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background:'#13131a', border:'0.5px solid rgba(255,255,255,0.06)', borderRadius:14, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'0.5px solid rgba(255,255,255,0.06)' }}>
              {['Tanggal','Deskripsi','Kategori','Jumlah','Aksi'].map(h => (
                <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(e => (
              <tr key={e.id} style={{ borderBottom:'0.5px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding:'12px 14px', fontSize:12, color:'rgba(255,255,255,0.5)' }}>{e.expense_date}</td>
                <td style={{ padding:'12px 14px', fontSize:13, color:'white' }}>{e.description}</td>
                <td style={{ padding:'12px 14px' }}>
                  {e.category && <span style={{ fontSize:11, padding:'3px 9px', borderRadius:20, background:'rgba(239,159,39,0.15)', color:'#EF9F27' }}>{e.category}</span>}
                </td>
                <td style={{ padding:'12px 14px', fontSize:13, color:'#EF9F27', fontWeight:600 }}>Rp {Number(e.amount).toLocaleString('id-ID')}</td>
                <td style={{ padding:'12px 14px' }}>
                  <button onClick={async () => { if(window.confirm('Hapus pengeluaran ini?')) { await deleteExpense(e.id); fetch(); } }}
                    style={{ padding:'5px 12px', borderRadius:6, border:'none', background:'rgba(226,75,74,0.12)', color:'#E24B4A', fontSize:11 }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.length && <div style={{ textAlign:'center', padding:40, color:'rgba(255,255,255,0.25)', fontSize:13 }}>Belum ada pengeluaran</div>}
      </div>
    </AdminLayout>
  );
}
