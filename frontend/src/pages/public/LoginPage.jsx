import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await login(form);
      authLogin(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/member');
    } catch (err) { setError(err.response?.data?.message || 'Login gagal, cek email & password'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      {/* LEFT - FOTO */}
      <div style={{ position:'relative', overflow:'hidden' }}>
        <img src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=900&q=85" alt="Laundry"
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
          onError={e => { e.target.parentElement.style.background='#1D4ED8'; e.target.style.display='none'; }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(17,24,78,0.75)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:40 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'auto', paddingTop:8 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'#1D4ED8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'white' }}>LK</div>
            <span style={{ color:'white', fontSize:16, fontWeight:700 }}>LaundryKu</span>
          </div>
          <div>
            <h2 style={{ color:'white', fontSize:28, fontWeight:800, lineHeight:1.3, marginBottom:10, letterSpacing:'-0.02em' }}>Laundry bersih,<br/>wangi & tepat waktu</h2>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.6, marginBottom:24 }}>Pantau status cucian kamu real-time, dapat notifikasi otomatis setiap update.</p>
            <div style={{ display:'flex', gap:16 }}>
              {[['500+','Pelanggan'],['99%','Tepat waktu'],['4.9★','Rating']].map(([v,l]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:18, fontWeight:800, color:'white' }}>{v}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT - FORM */}
      <div style={{ background:'#FAFAF8', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
        <div style={{ width:'100%', maxWidth:380 }}>
          <div style={{ marginBottom:32 }}>
            <h1 style={{ fontSize:26, fontWeight:800, color:'#1a1a1a', letterSpacing:'-0.02em', marginBottom:6 }}>Selamat datang!</h1>
            <p style={{ fontSize:14, color:'#6B6B6B' }}>Masuk ke akun LaundryKu kamu</p>
          </div>

          {error && (
            <div style={{ background:'#FEE2E2', border:'0.5px solid #FCA5A5', borderRadius:10, padding:'12px 16px', fontSize:13, color:'#DC2626', marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', display:'block', marginBottom:7 }}>Email</label>
              <input type="email" placeholder="email@example.com" value={form.email}
                onChange={e => setForm({...form,email:e.target.value})}
                style={{ width:'100%', padding:'12px 16px', borderRadius:12, border:'0.5px solid rgba(0,0,0,0.15)', fontSize:14, outline:'none', background:'#fff', transition:'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor='#1D4ED8'}
                onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.15)'} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', display:'block', marginBottom:7 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} placeholder="Masukkan password" value={form.password}
                  onChange={e => setForm({...form,password:e.target.value})}
                  style={{ width:'100%', padding:'12px 44px 12px 16px', borderRadius:12, border:'0.5px solid rgba(0,0,0,0.15)', fontSize:14, outline:'none', background:'#fff', transition:'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor='#1D4ED8'}
                  onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.15)'} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#9CA3AF' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ padding:'13px', borderRadius:12, border:'none', background:loading?'#93B4FC':'#1D4ED8', color:'#fff', fontSize:15, fontWeight:700, marginTop:4, cursor:loading?'not-allowed':'pointer', transition:'all 0.15s' }}>
              {loading ? '⏳ Masuk...' : 'Masuk sekarang'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:20 }}>
            <p style={{ fontSize:13, color:'#6B6B6B' }}>
              Belum punya akun? <Link to="/register" style={{ color:'#1D4ED8', fontWeight:600 }}>Daftar gratis</Link>
            </p>
          </div>

          <div style={{ marginTop:20, padding:'14px 16px', background:'#EFF6FF', borderRadius:12, border:'0.5px solid #BFDBFE' }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#1D4ED8', marginBottom:6 }}>Demo login:</div>
            <div style={{ fontSize:12, color:'#3B82F6' }}>Admin: admin@laundry.com / password</div>
          </div>

          <div style={{ textAlign:'center', marginTop:20 }}>
            <Link to="/" style={{ fontSize:13, color:'#9CA3AF' }}>← Kembali ke halaman utama</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
