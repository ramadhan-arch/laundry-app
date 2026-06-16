import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MemberNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinks = [
    { to:'/member', label:'Beranda' },
    { to:'/member/orders', label:'Order Saya' },
    { to:'/member/notifications', label:'Notifikasi' },
  ];

  return (
    <nav style={{ background:'#fff', borderBottom:'0.5px solid rgba(0,0,0,0.07)', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', height:58, position:'sticky', top:0, zIndex:100, fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'white' }}>LK</div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>LaundryKu</div>
          <div style={{ fontSize:10, color:'#9CA3AF', letterSpacing:'0.06em', textTransform:'uppercase' }}>Member Portal</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:4 }}>
        {navLinks.map(n => {
          const active = pathname === n.to;
          return (
            <Link key={n.to} to={n.to} style={{ padding:'7px 16px', borderRadius:10, fontSize:13, fontWeight:500, color:active?'#1D4ED8':'#6B6B6B', background:active?'#EFF6FF':'transparent', border:`0.5px solid ${active?'#BFDBFE':'transparent'}`, transition:'all 0.15s' }}
              onMouseEnter={e => { if(!active) { e.currentTarget.style.background='#F8F7F4'; e.currentTarget.style.color='#1a1a1a'; } }}
              onMouseLeave={e => { if(!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#6B6B6B'; } }}>
              {n.label}
            </Link>
          );
        })}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <Link to="/member/profile" style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 14px', borderRadius:10, border:'0.5px solid rgba(0,0,0,0.1)', fontSize:13, color:'#1a1a1a', background:'#F8F7F4', transition:'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#BFDBFE'; e.currentTarget.style.background='#EFF6FF'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,0,0,0.1)'; e.currentTarget.style.background='#F8F7F4'; }}>
          <div style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'white', fontWeight:700 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontWeight:500 }}>{user?.name?.split(' ')[0]}</span>
        </Link>
        <button onClick={() => { logout(); navigate('/'); }}
          style={{ padding:'7px 14px', borderRadius:10, border:'0.5px solid rgba(220,38,38,0.2)', background:'rgba(220,38,38,0.05)', fontSize:13, color:'#DC2626', cursor:'pointer', fontWeight:500 }}
          onMouseEnter={e => { e.target.style.background='rgba(220,38,38,0.1)'; }}
          onMouseLeave={e => { e.target.style.background='rgba(220,38,38,0.05)'; }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
