// Script de verificación post-despliegue
// verify-deployment.js
const axios = require('axios');

async function verifyDeployment() {
  const baseURL = 'https://taskflow.com';
  const apiURL = 'https://api.taskflow.com';

  console.log('🔍 Verificando despliegue...');

  try {
    // Verificar frontend
    const frontendResponse = await axios.get(baseURL);
    console.log('✅ Frontend: OK');

    // Verificar API health
    const apiHealth = await axios.get(`${apiURL}/health`);
    console.log('✅ API Health: OK');

    // Verificar base de datos
    const dbTest = await axios.get(`${apiURL}/api/debug/db-status`);
    console.log('✅ Database: OK');

    // Verificar funcionalidades críticas
    const loginTest = await axios.post(`${apiURL}/api/auth/login`, {
      email: 'demo@taskflow.com',
      password: 'demo123'
    });
    console.log('✅ Authentication: OK');

    // Verificar SSL
    const sslResponse = await axios.get(baseURL, {
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: true
      })
    });
    console.log('✅ SSL Certificate: OK');

    console.log('\n🎉 ¡Despliegue verificado exitosamente!');
    console.log(`🌐 Frontend: ${baseURL}`);
    console.log(`📡 API: ${apiURL}`);

  } catch (error) {
    console.error('❌ Error en verificación:', error.message);
    process.exit(1);
  }
}

verifyDeployment();