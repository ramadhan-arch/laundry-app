const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const { User } = require('./models');

async function resetAdmin() {
  await sequelize.authenticate();
  
  const password = 'admin123';
  const hashed = await bcrypt.hash(password, 10);
  
  // Cek apakah admin sudah ada
  const existing = await User.findOne({ where: { email: 'admin@laundry.com' } });
  
  if (existing) {
    // Update password
    await User.update(
      { password: hashed },
      { where: { email: 'admin@laundry.com' } }
    );
    console.log('✅ Password admin berhasil direset!');
  } else {
    // Buat admin baru
    await User.create({
      name: 'Admin LaundryKu',
      email: 'admin@laundry.com',
      password: hashed,
      role: 'admin',
      phone: '081234567890'
    });
    console.log('✅ Admin berhasil dibuat!');
  }
  
  console.log('📧 Email    : admin@laundry.com');
  console.log('🔑 Password : admin123');
  process.exit(0);
}

resetAdmin().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});