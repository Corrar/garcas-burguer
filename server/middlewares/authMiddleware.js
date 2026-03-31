import dotenv from 'dotenv';
dotenv.config();

export const protectAdmin = (req, res, next) => {
  // 1. O segurança olha para o "bilhete" que o frontend enviou
  const token = req.headers['x-admin-token'];

  // 2. Compara o bilhete com a senha secreta que definiste no .env
  if (token === process.env.ADMIN_TOKEN) {
    // A senha está correta! O next() diz: "Podes passar para o Controlador!"
    next(); 
  } else {
    // Senha errada ou inexistente! Bloqueia a entrada.
    console.warn('⚠️ Tentativa de acesso não autorizado bloqueada!');
    res.status(401).json({ error: 'Acesso negado. Token de Admin inválido ou ausente.' });
  }
};