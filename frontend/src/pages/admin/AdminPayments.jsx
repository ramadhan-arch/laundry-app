// Pages Admin: LaundryKu
// Dikerjakan oleh: Clara Ragil Dewanti
// NIM: 2410501116
// Tanggal: 16 Juni 2026

import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getPayments } from '../../services/api';

export default function AdminPayments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getPayments().then(r => {
      setData(r.data);
      setTotal(r.data.reduce((acc, p) => acc + Number(p.amount), 0));
    }).finally(() => setLoading(false));
  }, []);

  const methodLabel = { cash:'💵 Cash', transfer:'🏦 Transfer', qris:'📱 QRIS' };

  return (
    <AdminLayout title="Pembayaran" subtitle="Riwayat semua transaksi pembayaran">
      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Total Transaksi', value:data.length, color:'rgba(108,156,248,0.15)', tcolor:'#6C9CF8' },
          { label:'Total Pendapatan', value:`Rp ${total.toLocaleString('id-ID')}`, color:'rgba(29,158,117,0.15)', tcolor:'#1D9E75' },
          { label:'Transaksi Hari Ini', value:data.filter(p => new Date(p.paid_at).toDateString() === new Date().toDateString()).length, color:'rgba(239,159,39,0.15)', tcolor:'#EF9F27' },
        ].map(c => (
          <div key={c.label} style={{ background:'#13131a', border:'0.5px solid rgba(255,255,255,0.06)', borderRadius:14, padding:18 }}>
            <div style={{ fontSize:22, fontWeight:600, color:c.tcolor }}>{c.value}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:'#13131a', border:'0.5px solid rgba(255,255,255,0.06)', borderRadius:14, overflow:'hidden' }}>
        {loading ? <div style={{ padding:40, textAlign:'center' }}><div className="spin" /></div> : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'0.5px solid rgba(255,255,255,0.06)' }}>
                {['ID','Order','Pelanggan','Jumlah','Metode','Waktu','Catatan'].map(h => (
                  <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.id} style={{ borderBottom:'0.5px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'rgba(255,255,255,0.4)' }}>#{p.id}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#6C9CF8', fontWeight:500 }}>{p.Order?.order_code}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'white' }}>{p.Order?.Customer?.User?.name || '—'}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'#1D9E75', fontWeight:600 }}>Rp {Number(p.amount).toLocaleString('id-ID')}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.6)' }}>{methodLabel[p.method]}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'rgba(255,255,255,0.4)' }}>{new Date(p.paid_at).toLocaleString('id-ID')}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'rgba(255,255,255,0.4)' }}>{p.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !data.length && <div style={{ textAlign:'center', padding:40, color:'rgba(255,255,255,0.25)', fontSize:13 }}>Belum ada pembayaran</div>}
      </div>
    </AdminLayout>
  );
}
