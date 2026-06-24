// Pages Member: LaundryKu
// Dikerjakan oleh: Ukhti Zahra Isyana
// NIM: 2410501130
// Tanggal: 17 Juni 2026

import { useEffect, useState } from 'react';
import MemberNavbar from '../../components/member/MemberNavbar';
import { getMe, updateProfile } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MemberProfile() {
  const { user, login, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name:'', phone:'', address:'' });
  const [msg, setMsg] = useState({ text:'', ok:true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMe().then(r => {
      setProfile(r.data);
      setForm({ name:r.data.name||'', phone:r.data.phone||'', address:r.data.address||'' });
    });
  }, []);

  const handleSave = async e => {
    e.preventDefault(); setLoading(true); setMsg({ text:'', ok:true });
    try {
      await updateProfile(form);
      login({ ...user, name:form.name, phone:form.phone }, token);
      setMsg({ text:'✅ Profil berhasil diperbarui!', ok:true });
    } catch { setMsg({ text:'❌ Gagal menyimpan perubahan', ok:false }); }
    setLoading(false);
  };

  const inp = { width:'100%', padding:'12px 16px', borderRadius:12, border:'0.5px solid rgba(0,0,0,0.12)', fontSize:14, outline:'none', background:'#fff', color:'#1a1a1a', transition:'border-color 0.15s' };

  return (
    <div style={{ background:'#F8F7F4', minHeight:'100vh', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <MemberNavbar />
      <div style={{ maxWidth:640, margin:'0 auto', padding:'32px 24px' }}>

        {/* PROFILE HEADER */}
        <div style={{ position:'relative', borderRadius:20, overflow:'hidden', marginBottom:24 }}>
          <img src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=70" alt="Profile"
            style={{ width:'100%', height:140, objectFit:'cover' }} onError={e => { e.target.parentElement.style.background='#1D4ED8'; e.target.style.display='none'; }} />
          <div style={{ position:'absolute', inset:0, background:'rgba(17,24,78,0.7)', display:'flex', alignItems:'flex-end', padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:800, color:'white', border:'3px solid rgba(255,255,255,0.3)', flexShrink:0 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:'white', letterSpacing:'-0.01em' }}>{user?.name}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginTop:2 }}>{user?.email}</div>
                <div style={{ fontSize:12, color:'#93C5FD', marginTop:2, fontWeight:600 }}>Kode: {profile?.Customer?.customer_code||'—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT FORM */}
        <div style={{ background:'#fff', borderRadius:18, padding:24, border:'0.5px solid rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:'#1a1a1a', marginBottom:20 }}>✏️ Edit Profil</h2>

          {msg.text && (
            <div style={{ background:msg.ok?'#DCFCE7':'#FEE2E2', border:`0.5px solid ${msg.ok?'#86EFAC':'#FCA5A5'}`, borderRadius:10, padding:'12px 16px', fontSize:13, color:msg.ok?'#15803D':'#DC2626', marginBottom:20 }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[
              { label:'Nama Lengkap', key:'name', type:'text', ph:'Nama lengkap kamu' },
              { label:'No. HP', key:'phone', type:'tel', ph:'08xxxxxxxxxx' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', display:'block', marginBottom:7 }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={form[f.key]}
                  onChange={e => setForm({...form,[f.key]:e.target.value})} style={inp}
                  onFocus={e => e.target.style.borderColor='#1D4ED8'}
                  onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.12)'} />
              </div>
            ))}

            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', display:'block', marginBottom:7 }}>Alamat</label>
              <textarea placeholder="Alamat lengkap kamu..." value={form.address}
                onChange={e => setForm({...form,address:e.target.value})}
                style={{ ...inp, height:90, resize:'none' }}
                onFocus={e => e.target.style.borderColor='#1D4ED8'}
                onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.12)'} />
            </div>

            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#6B6B6B', display:'block', marginBottom:7 }}>Email (tidak bisa diubah)</label>
              <input value={user?.email} disabled style={{ ...inp, background:'#F3F4F6', color:'#9CA3AF', cursor:'not-allowed' }} />
            </div>

            <button type="submit" disabled={loading}
              style={{ padding:13, borderRadius:12, border:'none', background:loading?'#93B4FC':'#1D4ED8', color:'#fff', fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer', transition:'all 0.15s' }}>
              {loading ? '⏳ Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
