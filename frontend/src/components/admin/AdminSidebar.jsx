import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const nav = [
  { to:'/admin', icon:'⊞', label:'Dashboard', desc:'Ringkasan data' },
  { to:'/admin/orders', icon:'📋', label:'Order Laundry', desc:'Kelola transaksi' },
  { to:'/admin/services', icon:'🧺', label:'Layanan', desc:'Jenis & harga' },
  { to:'/admin/customers', icon:'👥', label:'Pelanggan', desc:'Data member' },
  { to:'/admin/employees', icon:'👨‍💼', label:'Karyawan', desc:'Tim laundry' },
  { to:'/admin/payments', icon:'💳', label:'Pembayaran', desc:'Riwayat transaksi' },
  { to:'/admin/expenses', icon:'📊', label:'Pengeluaran', desc:'Biaya operasional' },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ width:240, background:'#0D0D14', borderRight:'0.5px solid rgba(255,255,255,0.05)', padding:'20px 14px', display:'flex', flexDirection:'column', height:'100vh', position:'fixed', top:0, left:0 }}>

      {/* LOGO */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px 20px', marginBottom:8, borderBottom:'0.5px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'white', flexShrink:0 }}>LK</div>
        <div>
          <div style={{ color:'white', fontSize:14, fontWeight:700 }}>LaundryKu</div>
          <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>Admin Panel</div>
        </div>
      </div>

      {/* NAV */}
      <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 10px 6px' }}>Menu utama</div>
      {nav.map(n => {
        const active = pathname === n.to;
        return (
          <Link key={n.to} to={n.to} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, marginBottom:2, transition:'all 0.15s', textDecoration:'none',
            background: active ? 'rgba(29,78,216,0.2)' : 'transparent',
            border: active ? '0.5px solid rgba(29,78,216,0.3)' : '0.5px solid transparent',
          }}
            onMouseEnter={e => { if(!active) e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { if(!active) e.currentTarget.style.background='transparent'; }}>
            <div style={{ width:32, height:32, borderRadius:9, background: active ? 'rgba(29,78,216,0.3)' : 'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{n.icon}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:500, color: active ? '#93B4FC' : 'rgba(255,255,255,0.6)' }}>{n.label}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:1 }}>{n.desc}</div>
            </div>
          </Link>
        );
      })}

      {/* USER */}
      <div style={{ marginTop:'auto', paddingTop:14, borderTop:'0.5px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'rgba(255,255,255,0.04)', borderRadius:12, marginBottom:10 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white', flexShrink:0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ color:'white', fontSize:13, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
            <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>Administrator</div>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }}
          style={{ width:'100%', padding:'9px', background:'rgba(220,38,38,0.1)', border:'0.5px solid rgba(220,38,38,0.2)', borderRadius:10, color:'#F87171', fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.15s' }}
          onMouseEnter={e => { e.target.style.background='rgba(220,38,38,0.2)'; }}
          onMouseLeave={e => { e.target.style.background='rgba(220,38,38,0.1)'; }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
