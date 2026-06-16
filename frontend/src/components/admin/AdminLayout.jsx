import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title, subtitle, action }) {
  return (
    <div style={{ display:'flex', background:'#0D0D14', minHeight:'100vh', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, flex:1, minWidth:0 }}>
        {/* TOPBAR */}
        {title && (
          <div style={{ background:'#111118', borderBottom:'0.5px solid rgba(255,255,255,0.05)', padding:'16px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 }}>
            <div>
              <h1 style={{ color:'white', fontSize:18, fontWeight:700, letterSpacing:'-0.02em' }}>{title}</h1>
              {subtitle && <p style={{ color:'rgba(255,255,255,0.35)', fontSize:12, marginTop:2 }}>{subtitle}</p>}
            </div>
            {action}
          </div>
        )}
        <div style={{ padding:24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
