import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getCustomers, deleteCustomer } from '../../services/api';

export default function AdminCustomers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetch = () => { setLoading(true); getCustomers().then(r => setData(r.data)).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const filtered = data.filter(c =>
    c.User?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.User?.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.customer_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Pelanggan" subtitle="Daftar pelanggan terdaftar">
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, email, kode..."
          style={{ flex:1, maxWidth:320, padding:'9px 14px', borderRadius:10, border:'0.5px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none' }} />
      </div>

      <div style={{ background:'#13131a', border:'0.5px solid rgba(255,255,255,0.06)', borderRadius:14, overflow:'hidden' }}>
        {loading ? <div style={{ padding:40, textAlign:'center' }}><div className="spin" /></div> : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'0.5px solid rgba(255,255,255,0.06)' }}>
                {['Kode','Nama','Email','No. HP','Alamat','Total Order','Aksi'].map(h => (
                  <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom:'0.5px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#6C9CF8', fontWeight:500 }}>{c.customer_code}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'white', fontWeight:500 }}>{c.User?.name}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'rgba(255,255,255,0.5)' }}>{c.User?.email}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'rgba(255,255,255,0.5)' }}>{c.User?.phone || '—'}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'rgba(255,255,255,0.5)', maxWidth:150, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.User?.address || '—'}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'white', fontWeight:500 }}>{c.total_orders}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <button onClick={async () => { if(window.confirm('Hapus pelanggan ini?')) { await deleteCustomer(c.id); fetch(); } }}
                      style={{ padding:'5px 12px', borderRadius:6, border:'none', background:'rgba(226,75,74,0.12)', color:'#E24B4A', fontSize:11 }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !filtered.length && <div style={{ textAlign:'center', padding:40, color:'rgba(255,255,255,0.25)', fontSize:13 }}>Tidak ada pelanggan</div>}
      </div>
    </AdminLayout>
  );
}
