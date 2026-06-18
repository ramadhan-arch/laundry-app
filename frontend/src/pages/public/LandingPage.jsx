// Pages Member: LaundryKu
// Dikerjakan oleh: Kirana Fitria U.
// NIM: 2410501117
// Tanggal: 18 Juni 2026

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../../services/api';

// Foto sesuai nama layanan — pakai picsum.photos yang 100% selalu muncul + unsplash
const SERVICE_PHOTOS = {
  // Cuci reguler — mesin cuci
  'cuci reguler':   'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=500&q=80',
  // Cuci ekspres — jam/cepat
  'cuci ekspres':   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
  // Cuci + setrika — setrika
  'cuci + setrika': 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=500&q=80',
  // Setrika saja — setrika
  'setrika saja':   'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=500&q=80',
  // Cuci sepatu — sepatu
  'cuci sepatu':    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  // Dry cleaning — jas/kemeja formal
  'dry cleaning':   'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80',
  // Cuci selimut — bed/selimut
  'cuci selimut':   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80',
  // Cuci jas
  'cuci jas/blazer':'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80',
};

// Fallback kalau nama tidak cocok
const FALLBACK_PHOTOS = {
  kg:   'https://images.unsplash.com/photo-1626806787461-102c1a7f1b45?w=500&q=80',
  item: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=500&q=80',
  set:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
};

const getServicePhoto = (name, unit) => {
  const key = name?.toLowerCase().trim();
  // coba exact match dulu
  if (SERVICE_PHOTOS[key]) return SERVICE_PHOTOS[key];
  // coba partial match
  const partial = Object.keys(SERVICE_PHOTOS).find(k => key?.includes(k) || k.includes(key));
  if (partial) return SERVICE_PHOTOS[partial];
  // fallback by unit
  return FALLBACK_PHOTOS[unit] || FALLBACK_PHOTOS.kg;
};

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const S = {
  btnP: { padding:'10px 22px', borderRadius:10, border:'none', background:'#1D4ED8', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, transition:'all 0.15s' },
  btnG: { padding:'10px 18px', borderRadius:10, border:'0.5px solid rgba(0,0,0,0.15)', background:'transparent', color:'#1a1a1a', fontSize:14, fontWeight:500, cursor:'pointer', transition:'all 0.15s' },
};

export default function LandingPage() {
  const [services, setServices] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    getServices().then(r => setServices(r.data)).catch(() => {});
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const defaultServices = [
    { id:1, name:'Cuci Reguler', description:'Bersih & wangi dalam 3 hari', price_per_kg:7000, unit:'kg', is_active:true },
    { id:2, name:'Cuci Ekspres', description:'Selesai dalam 1 hari kerja', price_per_kg:12000, unit:'kg', is_active:true },
    { id:3, name:'Cuci + Setrika', description:'Rapi siap pakai langsung', price_per_kg:10000, unit:'kg', is_active:true },
    { id:4, name:'Setrika Saja', description:'Khusus setrika pakaian', price_per_item:3000, unit:'item', is_active:true },
    { id:5, name:'Dry Cleaning', description:'Khusus bahan halus & jas', price_per_item:25000, unit:'item', is_active:true },
    { id:6, name:'Cuci Sepatu', description:'Bersih mengilap seperti baru', price_per_item:35000, unit:'item', is_active:true },
    { id:7, name:'Cuci Selimut', description:'Selimut & bed cover bersih', price_per_item:20000, unit:'item', is_active:true },
    { id:8, name:'Cuci Jas/Blazer', description:'Pakaian formal bersih rapi', price_per_item:30000, unit:'item', is_active:true },
  ];

  const displayServices = services.length > 0
    ? services.filter(s => s.is_active).slice(0, 6)
    : defaultServices.slice(0, 6);

  return (
    <div style={{ background:'#FAFAF8', minHeight:'100vh', fontFamily:"'Inter',-apple-system,sans-serif" }}>

      {/* NAV */}
      <nav style={{ background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff', borderBottom:'0.5px solid rgba(0,0,0,0.07)', padding:'0 40px', display:'flex', alignItems:'center', justifyContent:'space-between', height:58, position:'sticky', top:0, zIndex:100, transition:'all 0.2s', boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => scrollTo('hero')}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:'white' }}>LK</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#1a1a1a', letterSpacing:'-0.01em' }}>LaundryKu</div>
            <div style={{ fontSize:10, color:'#9CA3AF', letterSpacing:'0.08em', textTransform:'uppercase' }}>Professional Laundry</div>
          </div>
        </div>

        {/* NAV LINKS — bisa diklik! */}
        <div style={{ display:'flex', gap:4 }}>
          {[
            { label:'Beranda', id:'hero' },
            { label:'Layanan', id:'services' },
            { label:'Cara Kerja', id:'howitworks' },
            { label:'Tentang', id:'about' },
          ].map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)}
              style={{ padding:'7px 16px', borderRadius:10, border:'none', background:'transparent', color:'#6B6B6B', fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.15s' }}
              onMouseEnter={e => { e.target.style.background='#F3F4F6'; e.target.style.color='#1a1a1a'; }}
              onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='#6B6B6B'; }}>
              {n.label}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', gap:8 }}>
          <Link to="/login"><button style={S.btnG}
            onMouseEnter={e => e.currentTarget.style.background='#F3F4F6'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>Masuk</button></Link>
          <Link to="/register"><button style={S.btnP}
            onMouseEnter={e => e.currentTarget.style.background='#1E40AF'}
            onMouseLeave={e => e.currentTarget.style.background='#1D4ED8'}>✨ Daftar gratis</button></Link>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:520, background:'#fff', borderBottom:'0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ padding:'56px 48px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#EFF6FF', color:'#1D4ED8', fontSize:12, fontWeight:500, padding:'5px 14px', borderRadius:20, marginBottom:20, border:'0.5px solid #BFDBFE', width:'fit-content' }}>
            ⭐ Dipercaya 500+ pelanggan Jakarta
          </div>
          <h1 style={{ fontSize:38, fontWeight:800, lineHeight:1.12, letterSpacing:'-0.03em', color:'#1a1a1a', marginBottom:14 }}>
            Laundry Bersih,<br />Wangi & <span style={{ color:'#1D4ED8' }}>Tepat Waktu</span>
          </h1>
          <p style={{ fontSize:15, color:'#6B6B6B', lineHeight:1.75, marginBottom:28, maxWidth:400 }}>
            Percayakan cucian kamu ke LaundryKu. Pantau status real-time, dapat notifikasi otomatis, dan bayar mudah.
          </p>
          <div style={{ display:'flex', gap:10, marginBottom:36 }}>
            <Link to="/register">
              <button style={{ ...S.btnP, padding:'12px 24px', fontSize:15 }}
                onMouseEnter={e => e.currentTarget.style.background='#1E40AF'}
                onMouseLeave={e => e.currentTarget.style.background='#1D4ED8'}>
                🚀 Pesan sekarang
              </button>
            </Link>
            <button style={{ ...S.btnG, padding:'12px 20px', fontSize:15 }} onClick={() => scrollTo('services')}
              onMouseEnter={e => e.currentTarget.style.background='#F3F4F6'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              Lihat layanan
            </button>
          </div>
          <div style={{ display:'flex', gap:28, paddingTop:24, borderTop:'0.5px solid rgba(0,0,0,0.07)' }}>
            {[['500+','Pelanggan puas'],['99%','Tepat waktu'],['4.9★','Rating'],['3+','Tahun berpengalaman']].map(([v,l]) => (
              <div key={l}><div style={{ fontSize:20, fontWeight:800, color:'#1D4ED8' }}>{v}</div><div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{ position:'relative', overflow:'hidden' }}>
          <img src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=900&q=85" alt="Laundry profesional"
            style={{ width:'100%', height:'100%', objectFit:'cover' }}
            onError={e => { e.target.parentElement.style.background='#1D4ED8'; e.target.style.display='none'; }} />
          <div style={{ position:'absolute', inset:0, background:'rgba(17,24,78,0.25)' }} />
          <div style={{ position:'absolute', bottom:24, left:24, background:'rgba(255,255,255,0.95)', borderRadius:16, padding:'14px 18px', backdropFilter:'blur(4px)' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:3 }}>
              <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:'#16A34A', marginRight:6 }}></span>
              58 order sedang diproses
            </div>
            <div style={{ fontSize:12, color:'#6B6B6B' }}>Rata-rata selesai dalam 2 hari</div>
          </div>
          <div style={{ position:'absolute', top:24, right:24, background:'#1D4ED8', borderRadius:14, padding:'12px 18px', color:'white', textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:800 }}>24/7</div>
            <div style={{ fontSize:11, opacity:0.8 }}>Siap melayani</div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding:'64px 40px', background:'#fff', borderTop:'0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#EFF6FF', color:'#1D4ED8', fontSize:12, fontWeight:500, padding:'4px 14px', borderRadius:20, marginBottom:12, border:'0.5px solid #BFDBFE' }}>
            Layanan kami
          </div>
          <h2 style={{ fontSize:28, fontWeight:800, color:'#1a1a1a', letterSpacing:'-0.02em', marginBottom:8 }}>Semua kebutuhan laundry ada di sini</h2>
          <p style={{ fontSize:14, color:'#6B6B6B' }}>Harga terjangkau, kualitas terjamin, hasil memuaskan</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
          {displayServices.map((s) => (
            <div key={s.id} style={{ borderRadius:18, overflow:'hidden', border:'0.5px solid rgba(0,0,0,0.07)', background:'#fff', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor='#BFDBFE'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='rgba(0,0,0,0.07)'; }}>
              <div style={{ position:'relative', height:180, overflow:'hidden' }}>
                <img
                  src={getServicePhoto(s.name, s.unit)}
                  alt={s.name}
                  style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }}
                  onMouseEnter={e => e.target.style.transform='scale(1.06)'}
                  onMouseLeave={e => e.target.style.transform='scale(1)'}
                  onError={e => {
                    // coba foto cadangan dulu
                    if (!e.target.dataset.fallback) {
                      e.target.dataset.fallback = '1';
                      e.target.src = 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&q=80';
                    } else {
                      // kalau masih error, tampilkan placeholder emoji
                      e.target.style.display='none';
                      e.target.nextElementSibling.style.display='flex';
                    }
                  }} />
                <div style={{ display:'none', position:'absolute', inset:0, background:'#EFF6FF', alignItems:'center', justifyContent:'center', fontSize:48 }}>🧺</div>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                <div style={{ position:'absolute', bottom:14, left:14, background:'#1D4ED8', color:'white', fontSize:13, fontWeight:700, padding:'5px 12px', borderRadius:20 }}>
                  Rp {s.unit==='kg' ? Number(s.price_per_kg).toLocaleString('id-ID') : Number(s.price_per_item).toLocaleString('id-ID')}/{s.unit}
                </div>
              </div>
              <div style={{ padding:'16px 18px' }}>
                <div style={{ fontSize:15, fontWeight:700, color:'#1a1a1a', marginBottom:5 }}>{s.name}</div>
                <div style={{ fontSize:13, color:'#6B6B6B', lineHeight:1.5, marginBottom:10 }}>{s.description}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'#DCFCE7', color:'#16A34A', fontWeight:600 }}>✓ Tersedia</span>
                  <span style={{ fontSize:12, color:'#9CA3AF' }}>Per {s.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT / WHY */}
      <section id="about" style={{ padding:'64px 40px', background:'#F8F7F4' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' }}>
          <div style={{ borderRadius:24, overflow:'hidden', height:400, position:'relative' }}>
            <img src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=700&q=85" alt="Tentang LaundryKu"
              style={{ width:'100%', height:'100%', objectFit:'cover' }}
              onError={e => { e.target.parentElement.style.background='#DBEAFE'; e.target.style.display='none'; }} />
            <div style={{ position:'absolute', inset:0, background:'rgba(17,24,78,0.15)' }} />
          </div>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#EFF6FF', color:'#1D4ED8', fontSize:12, fontWeight:500, padding:'4px 14px', borderRadius:20, marginBottom:14, border:'0.5px solid #BFDBFE' }}>
              Tentang kami
            </div>
            <h2 style={{ fontSize:26, fontWeight:800, color:'#1a1a1a', letterSpacing:'-0.02em', marginBottom:10 }}>Kenapa pilih LaundryKu?</h2>
            <p style={{ fontSize:14, color:'#6B6B6B', marginBottom:24, lineHeight:1.7 }}>
              Kami berkomitmen memberikan layanan laundry terbaik dengan teknologi modern — pantau cucian real-time, notifikasi otomatis, dan hasil yang memuaskan.
            </p>
            {[
              { icon:'⏰', title:'Tepat waktu dijamin', desc:'Selesai sesuai estimasi, terlambat kami ganti rugi 100%' },
              { icon:'📱', title:'Pantau status real-time', desc:'Notifikasi otomatis tiap update status cucian kamu' },
              { icon:'🛡️', title:'Aman & terpercaya', desc:'Pakaian ditangani profesional dengan deterjen premium' },
              { icon:'💳', title:'Bayar mudah', desc:'Cash, transfer bank, atau QRIS semua bisa' },
            ].map(w => (
              <div key={w.title} style={{ display:'flex', gap:14, alignItems:'flex-start', padding:'14px 16px', background:'#fff', borderRadius:14, border:'0.5px solid rgba(0,0,0,0.07)', marginBottom:10, transition:'all 0.15s', cursor:'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#BFDBFE'; e.currentTarget.style.background='#EFF6FF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,0,0,0.07)'; e.currentTarget.style.background='#fff'; }}>
                <div style={{ width:42, height:42, borderRadius:12, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{w.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginBottom:3 }}>{w.title}</div>
                  <div style={{ fontSize:13, color:'#6B6B6B', lineHeight:1.5 }}>{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="howitworks" style={{ padding:'64px 40px', background:'#fff', borderTop:'0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#EFF6FF', color:'#1D4ED8', fontSize:12, fontWeight:500, padding:'4px 14px', borderRadius:20, marginBottom:12, border:'0.5px solid #BFDBFE' }}>
            Cara kerja
          </div>
          <h2 style={{ fontSize:28, fontWeight:800, color:'#1a1a1a', letterSpacing:'-0.02em', marginBottom:8 }}>Cara mudah pakai LaundryKu</h2>
          <p style={{ fontSize:14, color:'#6B6B6B' }}>Cuma 4 langkah, cucian beres!</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {[
            { n:'01', icon:'👤', title:'Daftar akun', desc:'Buat akun gratis dalam 1 menit, langsung bisa pantau order', img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=70' },
            { n:'02', icon:'🧺', title:'Antar cucian', desc:'Bawa ke toko atau hubungi kami untuk layanan jemput', img:'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=70' },
            { n:'03', icon:'🔄', title:'Pantau status', desc:'Lihat progress real-time, dapat notifikasi tiap update', img:'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=70' },
            { n:'04', icon:'✅', title:'Ambil & bayar', desc:'Cucian bersih siap, bayar mudah sesuai layanan dipilih', img:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=70' },
          ].map(s => (
            <div key={s.n} style={{ borderRadius:18, overflow:'hidden', border:'0.5px solid rgba(0,0,0,0.07)', background:'#F8F7F4', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#EFF6FF'; e.currentTarget.style.borderColor='#BFDBFE'; e.currentTarget.style.transform='translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#F8F7F4'; e.currentTarget.style.borderColor='rgba(0,0,0,0.07)'; e.currentTarget.style.transform='translateY(0)'; }}>
              <div style={{ height:110, overflow:'hidden', position:'relative' }}>
                <img src={s.img} alt={s.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}
                  onError={e => { e.target.style.display='none'; }} />
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.2)' }} />
                <div style={{ position:'absolute', top:12, left:12, width:36, height:36, borderRadius:10, background:'#1D4ED8', color:'white', fontSize:14, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.n}</div>
              </div>
              <div style={{ padding:'16px' }}>
                <div style={{ fontSize:20, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginBottom:6 }}>{s.title}</div>
                <div style={{ fontSize:13, color:'#6B6B6B', lineHeight:1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding:'64px 40px', background:'#F8F7F4' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <h2 style={{ fontSize:28, fontWeight:800, color:'#1a1a1a', letterSpacing:'-0.02em', marginBottom:8 }}>Kata pelanggan kami</h2>
          <p style={{ fontSize:14, color:'#6B6B6B' }}>Lebih dari 500 pelanggan puas di Jakarta</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[
            { name:'Rafi Ananda', role:'Mahasiswa UPN Jakarta', init:'RA', color:'#1D4ED8', bg:'#DBEAFE', text:'"Cucian bersih banget dan wangi! Yang paling suka bisa pantau status dari HP, jadi ga perlu bolak-balik nanya ke toko."' },
            { name:'Siti Kurniawati', role:'Karyawan Swasta', init:'SK', color:'#16A34A', bg:'#DCFCE7', text:'"Ekspres 1 hari beneran selesai! Pakaian kerja saya rapi dan tepat waktu. Recommended banget buat yang sibuk!"' },
            { name:'Dika Pratama', role:'Wiraswasta', init:'DP', color:'#D97706', bg:'#FEF3C7', text:'"Sepatu lama saya jadi kinclong lagi! Pelayanannya ramah, harga wajar, hasil memuaskan. Udah pelanggan setia!"' },
          ].map(r => (
            <div key={r.name} style={{ background:'#fff', borderRadius:18, padding:22, border:'0.5px solid rgba(0,0,0,0.07)', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#BFDBFE'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,0,0,0.07)'; e.currentTarget.style.transform='translateY(0)'; }}>
              <div style={{ color:'#F59E0B', fontSize:18, marginBottom:12, letterSpacing:2 }}>★★★★★</div>
              <p style={{ fontSize:14, color:'#4B5563', lineHeight:1.7, marginBottom:18, fontStyle:'italic' }}>{r.text}</p>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:42, height:42, borderRadius:'50%', background:r.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:r.color }}>{r.init}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{r.name}</div>
                  <div style={{ fontSize:12, color:'#9CA3AF' }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding:'0 40px 64px' }}>
        <div style={{ position:'relative', borderRadius:24, overflow:'hidden', minHeight:220 }}>
          <img src="https://images.unsplash.com/photo-1521656189096-b8f4b5eb2124?w=1400&q=85" alt="Banner"
            style={{ width:'100%', height:220, objectFit:'cover' }}
            onError={e => { e.target.style.display='none'; }} />
          <div style={{ position:'absolute', inset:0, background:'rgba(17,24,78,0.85)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'40px 52px' }}>
            <div>
              <h2 style={{ color:'white', fontSize:26, fontWeight:800, lineHeight:1.3, marginBottom:8, letterSpacing:'-0.02em' }}>
                Siap laundry hari ini?<br />Daftar gratis sekarang!
              </h2>
              <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14 }}>Promo member baru: gratis ongkos antar pertama kali</p>
            </div>
            <Link to="/register">
              <button style={{ background:'white', color:'#1D4ED8', border:'none', padding:'14px 32px', borderRadius:14, fontSize:15, fontWeight:800, cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='#EFF6FF'}
                onMouseLeave={e => e.currentTarget.style.background='white'}>
                Mulai sekarang →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'#1a1a1a', padding:'32px 40px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, paddingBottom:20, borderBottom:'0.5px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'#1D4ED8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'white' }}>LK</div>
            <div>
              <div style={{ color:'white', fontSize:14, fontWeight:700 }}>LaundryKu</div>
              <div style={{ color:'#6B6B6B', fontSize:11 }}>Professional Laundry Service</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:20 }}>
            {['Layanan','Tentang','Kontak','Privasi'].map(l => (
              <span key={l} style={{ fontSize:13, color:'#6B6B6B', cursor:'pointer', transition:'color 0.15s' }}
                onMouseEnter={e => e.target.style.color='white'} onMouseLeave={e => e.target.style.color='#6B6B6B'}>{l}</span>
            ))}
          </div>
          <div style={{ fontSize:12, color:'#4B5563' }}>© 2026 LaundryKu. All rights reserved.</div>
        </div>
        <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
          {[['📍','Jl. Raya No. 1, Jakarta'],['📞','021-1234567'],['💬','WA: 0812-3456-7890'],['🕐','Buka: 07.00 - 21.00 WIB']].map(([icon,text]) => (
            <div key={text} style={{ fontSize:12, color:'#6B6B6B', display:'flex', alignItems:'center', gap:6 }}>
              <span>{icon}</span> {text}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
