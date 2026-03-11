import React, { useState } from 'react';
import { getInboxes } from '../services/inboxes';
import { registerUser } from '../services/auth';

type Props = {
  onLoggedIn: () => void;
};

export default function Login({ onLoggedIn }: Props) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // Registro
        await registerUser(username, password, email);
        // Auto-login tras registro o pedir login manual?
        // Vamos a pedir login manual para simplificar flujo o auto-logear
        setIsRegister(false);
        setError('Usuario creado correctamente. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      // Login
      // Probamos credenciales contra un endpoint protegido (getInboxes)
      // Guardamos auth temporalmente
      const token = 'Basic ' + btoa(`${username}:${password}`);
      localStorage.setItem('auth', token);

      await getInboxes();
      // Si no lanza error, es válido
      onLoggedIn();
    } catch (e: any) {
      if (isRegister) {
        setError('Error al registrar: ' + (e.message || 'Inténtalo de nuevo'));
      } else {
        setError('Credenciales inválidas');
        localStorage.removeItem('auth');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded-lg p-6 w-[360px]">
        <h1 className="text-xl font-bold mb-6 text-center text-gray-800">
          {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ej: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {isRegister && (
             <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
             <input
               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
               placeholder="Ej: usuario@empresa.com"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
             />
           </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className={`text-sm p-2 rounded ${error.includes('correctamente') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {error}
            </div>
          )}

          <button
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={submit}
            disabled={loading || !username || !password || (isRegister && !email)}
          >
            {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Entrar')}
          </button>

          <div className="text-center pt-2">
            <button 
              className="text-sm text-gray-500 hover:text-blue-600 underline"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setUsername('');
                setPassword('');
                setEmail('');
              }}
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
