/**
 * Simulación de sesión de cliente autenticado para MVP.
 * En producción, esto vendría del sistema de autenticación (JWT, OAuth, etc).
 */
export const CLIENTE_AUTENTICADO = {
  dni: '99999999',
  email: 'cliente.demo@gmail.com',
  telefono: '+51987654321',

  nombres: 'Juan Carlos',
  apellidoPaterno: 'Pérez',
  apellidoMaterno: 'García',
  nombreCompleto: 'Juan Carlos Pérez García',
  fechaNacimiento: '1985-03-15',

  sessionId: 'sess_abc123xyz789',
  loginTimestamp: '2025-10-12T08:30:00Z',
  lastActivity: '2025-10-12T09:45:00Z',
  ipAddress: '190.237.45.123',

  platform: 'web', // 'web' | 'mobile-app' | 'tablet'
  deviceType: 'desktop', // 'desktop' | 'mobile' | 'tablet'
  browser: 'Chrome 118.0',
  os: 'Windows 10',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/118.0.0.0',

  role: 'customer', // 'customer' | 'admin' | 'agent'
  permissions: ['view_policies', 'search_workshops', 'report_claims'],

  language: 'es-PE',
  timezone: 'America/Lima',
  notificationsEnabled: true,

  accountStatus: 'active', // 'active' | 'suspended' | 'inactive'
  isVerified: true,
  hasActivePolicies: true,
};
