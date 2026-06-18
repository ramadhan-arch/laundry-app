// Pages Member: LaundryKu
// Dikerjakan oleh: Kirana Fitria U.
// NIM: 2410501117
// Tanggal: 18 Juni 2026

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', address:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) { setError(err.response?.data?.message || 'Registrasi gagal'); }
    setLoading(false);
  };

  const inp = (extra={}) => ({ width:'100%', padding:'12px 16px', borderRadius:12, border:'0.5px solid rgba(0,0,0,0.15)', fontSize:14, outline:'none', background:'#fff', transition:'border-color 0.15s', ...extra });

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      {/* LEFT FOTO */}
      <div style={{ position:'relative', overflow:'hidden' }}>
        <img src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=900&q=85" alt="Laundry"
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
          onError={e => { e.target.parentElement.style.background='#1D4ED8'; e.target.style.display='none'; }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(17,24,78,0.75)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:40 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'#1D4ED8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'white' }}>LK</div>
            <span style={{ color:'white', fontSize:16, fontWeight:700 }}>LaundryKu</span>
          </div>
          <div>
            <h2 style={{ color:'white', fontSize:26, fontWeight:800, lineHeight:1.3, marginBottom:10, letterSpacing:'-0.02em' }}>Bergabung dengan<br/>LaundryKu sekarang!</h2>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.6, marginBottom:24 }}>Daftar gratis dan nikmati kemudahan laundry profesional dengan pantau status real-time.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {['✅ Pantau status cucian real-time','✅ Notifikasi otomatis setiap update','✅ Riwayat order lengkap','✅ Daftar & gunakan gratis'].map(t => (
                <div key={t} style={{ fontSize:13, color:'rgba(255,255,255,0.8)' }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div style={{ background:'#FAFAF8', display:'flex', alignItems:'center', justifyContent:'center', padding:40, overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:24, fontWeight:800, color:'#1a1a1a', letterSpacing:'-0.02em', marginBottom:6 }}>Buat akun baru</h1>
            <p style={{ fontSize:14, color:'#6B6B6B' }}>Isi data kamu untuk daftar LaundryKu</p>
          </div>

          {error && (
            <div style={{ background:'#FEE2E2', border:'0.5px solid #FCA5A5', borderRadius:10, padding:'12px 16px', fontSize:13, color:'#DC2626', marginBottom:20 }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { label:'Nama Lengkap', key:'name', type:'text', ph:'Nama lengkap kamu' },
              { label:'Email', key:'email', type:'email', ph:'email@example.com' },
              { label:'No. HP', key:'phone', type:'tel', ph:'08xxxxxxxxxx' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', display:'block', marginBottom:7 }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={form[f.key]}
                  onChange={e => setForm({...form,[f.key]:e.target.value})}
                  style={inp()}
                  onFocus={e => e.target.style.borderColor='#1D4ED8'}
                  onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.15)'} />
              </div>
            ))}

            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', display:'block', marginBottom:7 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} placeholder="Min. 6 karakter" value={form.password}
                  onChange={e => setForm({...form,password:e.target.value})}
                  style={inp({ paddingRight:44 })}
                  onFocus={e => e.target.style.borderColor='#1D4ED8'}
                  onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.15)'} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#9CA3AF' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', display:'block', marginBottom:7 }}>Alamat</label>
              <textarea placeholder="Alamat lengkap kamu..." value={form.address}
                onChange={e => setForm({...form,address:e.target.value})}
                style={{ ...inp(), height:80, resize:'none' }}
                onFocus={e => e.target.style.borderColor='#1D4ED8'}
                onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.15)'} />
            </div>

            <button type="submit" disabled={loading}
              style={{ padding:13, borderRadius:12, border:'none', background:loading?'#93B4FC':'#1D4ED8', color:'#fff', fontSize:15, fontWeight:700, marginTop:4, cursor:loading?'not-allowed':'pointer' }}>
              {loading ? '⏳ Mendaftar...' : 'Daftar sekarang gratis'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13, color:'#6B6B6B', marginTop:20 }}>
            Sudah punya akun? <Link to="/login" style={{ color:'#1D4ED8', fontWeight:600 }}>Masuk</Link>
          </p>
          <p style={{ textAlign:'center', marginTop:12 }}>
            <Link to="/" style={{ fontSize:13, color:'#9CA3AF' }}>← Kembali ke halaman utama</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
