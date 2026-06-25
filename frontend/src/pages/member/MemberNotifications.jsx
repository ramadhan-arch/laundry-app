import { useEffect, useState } from 'react';
import MemberNavbar from '../../components/member/MemberNavbar';
import { getNotifications, readNotification } from '../../services/api';

export default function MemberNotifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => getNotifications().then(r => setNotifs(r.data)).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const handleRead = async id => {
    await readNotification(id);
    setNotifs(n => n.map(x => x.id===id ? {...x, is_read:true} : x));
  };

  const handleReadAll = async () => {
    await Promise.all(notifs.filter(n=>!n.is_read).map(n => readNotification(n.id)));
    setNotifs(n => n.map(x => ({...x, is_read:true})));
  };

  const unread = notifs.filter(n => !n.is_read).length;

  const getIcon = title => {
    const t = title.toLowerCase();
    if (t.includes('diterima') || t.includes('berhasil dibuat')) return { icon:'📬', bg:'#DBEAFE', color:'#1D4ED8' };
    if (t.includes('jemput') || t.includes('pickup')) return { icon:'🛵', bg:'#E0F2FE', color:'#0369A1' }; 
    if (t.includes('dicuci') || t.includes('washing') || t.includes('proses')) return { icon:'🫧', bg:'#EDE9FE', color:'#7C3AED' };
    if (t.includes('selesai') || t.includes('done')) return { icon:'✅', bg:'#DCFCE7', color:'#16A34A' };
    if (t.includes('dikirim') || t.includes('antar') || t.includes('delivery')) return { icon:'🚚', bg:'#F0FDF4', color:'#15803D' }; 
    return { icon:'🔔', bg:'#FEF3C7', color:'#D97706' };
  };

  return (
    <div style={{ background:'#F8F7F4', minHeight:'100vh', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <MemberNavbar />
      <div style={{ maxWidth: 640, margin:'0 auto', padding:'32px 24px' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <h1 style={{ fontSize:22, fontWeight:800, color:'#1a1a1a', letterSpacing:'-0.02em' }}>Notifikasi</h1>
              {unread > 0 && (
                <span style={{ fontSize:12, padding:'3px 10px', borderRadius:20, background:'#1D4ED8', color:'white', fontWeight:700 }}>{unread} baru</span>
              )}
            </div>
            <p style={{ fontSize:13, color:'#9CA3AF', marginTop:3 }}>Update status order laundry kamu</p>
          </div>
          {unread > 0 && (
            <button onClick={handleReadAll}
              style={{ fontSize:13, color:'#1D4ED8', background:'#EFF6FF', border:'0.5px solid #BFDBFE', borderRadius:10, padding:'8px 16px', cursor:'pointer', fontWeight:500 }}>
              Tandai semua dibaca
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:60 }}>
            <div style={{ display:'inline-block', width:24, height:24, border:'2.5px solid #1D4ED8', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
            <p style={{ marginTop:12, fontSize:13, color:'#9CA3AF' }}>Memuat notifikasi...</p>
          </div>
        ) : notifs.length === 0 ? (
          <div style={{ textAlign:'center', padding:80 }}>
            <div style={{ fontSize:56, marginBottom:14 }}>🔔</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#1a1a1a', marginBottom:6 }}>Belum ada notifikasi</div>
            <div style={{ fontSize:14, color:'#9CA3AF' }}>Update status order akan muncul di sini</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {notifs.map(n => {
              const { icon, bg, color } = getIcon(n.title);
              return (
                <div key={n.id} onClick={() => !n.is_read && handleRead(n.id)}
                  style={{ background: n.is_read ? '#fff' : '#EFF6FF', border:`0.5px solid ${n.is_read ? 'rgba(0,0,0,0.07)' : '#BFDBFE'}`, borderRadius:16, padding:18, cursor:n.is_read?'default':'pointer', transition:'all 0.15s' }}
                  onMouseEnter={e => { if(!n.is_read) e.currentTarget.style.background='#DBEAFE'; }}
                  onMouseLeave={e => { if(!n.is_read) e.currentTarget.style.background='#EFF6FF'; }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:14, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:4 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title}</div>
                        {!n.is_read && (
                          <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:'#1D4ED8', color:'white', fontWeight:600, flexShrink:0 }}>Baru</span>
                        )}
                      </div>
                      <div style={{ fontSize:13, color:'#6B6B6B', lineHeight:1.6, marginBottom:8 }}>{n.message}</div>
                      <div style={{ fontSize:11, color:'#9CA3AF' }}>
                        🕐 {new Date(n.created_at).toLocaleString('id-ID', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}