import React from 'react';

export default function DocsPage() {
  return (
    <div className="min-h-screen w-screen bg-white dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">TFG CRM Omnicanal — Documentación</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Versión inicial. Este documento describe arquitectura, endpoints y uso del proyecto.</p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Arquitectura</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Frontend: React + Vite + Tailwind. Estructura en src/components y src/services.</li>
          <li>Backend: Spring Boot 3, H2 file DB, seguridad básica con Basic Auth.</li>
          <li>Proxy dev: /dev y /webhooks apuntan a 8080 para evitar CORS.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Autenticación</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Basic Auth en backend. Usuario: admin, Contraseña: admin.</li>
          <li>El frontend guarda Authorization en localStorage y la aplica en /dev/*.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Endpoints Backend</h2>
        <div className="space-y-3 text-sm">
          <div>
            <div className="font-semibold">Mensajes (/dev/messages)</div>
            <ul className="list-disc pl-5">
              <li>GET /latest?limit=N: últimos mensajes</li>
              <li>GET /by-conversation?conversationId=ID&limit=N: mensajes de una conversación</li>
              <li>GET /inboxes: listado de bandejas/inboxes</li>
              <li>POST /send {`{ conversationId, content }`}: enviar mensaje</li>
              <li>POST /conversations/{`{id}`}/resolve: resolver conversación</li>
              <li>POST /conversations/{`{id}`}/open: reabrir conversación</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Estadísticas (/dev/stats)</div>
            <ul className="list-disc pl-5">
              <li>GET /dev/stats: byChannel, byStatus, byChannelStatus</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Contactos (/dev/messages/contacts)</div>
            <ul className="list-disc pl-5">
              <li>GET /dev/messages/contacts: listado de contactos</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-2">Ejemplos Curl</h2>
        <div className="space-y-3 text-xs">
          <div>
            <div className="font-semibold">Auth básica y consultas</div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded"><code>{`# Últimos 5 mensajes
curl -u admin:admin "http://localhost:8080/dev/messages/latest?limit=5"

# Mensajes de una conversación
curl -u admin:admin "http://localhost:8080/dev/messages/by-conversation?conversationId=1&limit=50"

# Inboxes
curl -u admin:admin "http://localhost:8080/dev/messages/inboxes"

# Contactos (ruta correcta)
curl -u admin:admin "http://localhost:8080/dev/messages/contacts"

# Estadísticas
curl -u admin:admin "http://localhost:8080/dev/stats"`}</code></pre>
          </div>
          <div>
            <div className="font-semibold">Acciones</div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded"><code>{`# Enviar mensaje
curl -u admin:admin -H "Content-Type: application/json" \\
  -d '{"conversationId":1,"content":"Hola desde curl"}' \\
  "http://localhost:8080/dev/messages/send"

# Resolver conversación
curl -u admin:admin -X POST "http://localhost:8080/dev/messages/conversations/1/resolve"

# Reabrir conversación
curl -u admin:admin -X POST "http://localhost:8080/dev/messages/conversations/1/open"`}</code></pre>
          </div>
          <div>
            <div className="font-semibold">Webhooks de desarrollo</div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded"><code>{`# WhatsApp (dev)
curl -u admin:admin -H "Content-Type: application/json" \\
  -d '{"from":"+34123456789","text":"Hola!"}' \\
  "http://localhost:8080/dev/webhooks/whatsapp"

# Instagram (dev)
curl -u admin:admin -H "Content-Type: application/json" \\
  -d '{"senderId":"insta_user","text":"DM desde IG"}' \\
  "http://localhost:8080/dev/webhooks/instagram"

# Email (dev)
curl -u admin:admin -H "Content-Type: application/json" \\
  -d '{"from":"user@example.com","to":["agent@example.com"],"subject":"Consulta","text":"Contenido"}' \\
  "http://localhost:8080/dev/webhooks/email"`}</code></pre>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-2">Servicios Frontend</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>api.ts: GET/POST con Authorization</li>
          <li>messages.ts: latest, byConversation, sendMessage, resolveConversation, reopenConversation</li>
          <li>inboxes.ts: getInboxes</li>
          <li>stats.ts: getStats</li>
          <li>contacts.ts: getContacts</li>
          <li>auth.ts: getUsername, logout</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Flujo de Datos (Diagrama)</h2>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto">{`[Entradas Externas]
   Webhooks Meta (WhatsApp/Instagram) -----> InboundService.parseInbound -----> Contact
   Email (dev) -----------------------------> EmailIntegrationService ---------> Contact
                                            |                                   |
                                            v                                   v
                                       Conversation (OPEN) <-------------------/
                                            |
                                            v
                                        Message (INCOMING)

[Acciones Agente]
   ChatWindow -> MessageService.send -> ChannelSender (WhatsApp/Email/Stub)
                                            |
                                            v
                                        Message (OUTGOING)

[Estados]
   ConversationStatus: OPEN | RESOLVED | SNOOZED

[UI]
   InboxesList + ConversationList + ChatWindow + AnalyticsModal`}</pre>

        <h2 className="text-xl font-semibold mt-8 mb-2">Componentes Clave</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Dashboard: layout principal, navegación de sidebar y modales</li>
          <li>InboxesList: bandejas y panel de cuenta inferior</li>
          <li>ConversationList: filtros de estado, menciones y desatendido</li>
          <li>ChatWindow: lectura y envío, resolver/reabrir</li>
          <li>AnalyticsModal: estadísticas por canal/estado</li>
          <li>AccountSettingsModal: ajustes de la cuenta</li>
          <li>UserQuickPanel: disponibilidad, apariencia, enlaces utilitarios</li>
          <li>Toasts: notificaciones simples</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Modo Oscuro</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Configurado con Tailwind darkMode: 'class'</li>
          <li>Se alterna con el panel de cuenta y se persiste en localStorage('theme')</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Troubleshooting</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>401 en /dev/*: asegura credenciales válidas (admin/admin) o re-login en la UI.</li>
          <li>404 en /dev/contacts: usar la ruta correcta /dev/messages/contacts.</li>
          <li>CORS en desarrollo: usar el proxy Vite (frontend) y backend en 8080.</li>
          <li>H2 Console: disponible en /h2-console; DB en backend/backend/data/crmdb.mv.db.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Seguridad Avanzada</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Webhooks Meta requieren verificación de firma: cabeceras X-Hub-Signature-256/sha256 o X-Hub-Signature/sha1.</li>
          <li>Variables necesarias en backend: META_VERIFY_TOKEN y META_APP_SECRET (para handshake y firma).</li>
          <li>Frontend usa HTTP Basic y guarda Authorization en localStorage; se aplica automáticamente en /dev/*.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Notas</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>El H2 Console está disponible en /h2-console</li>
          <li>Los datos se almacenan en backend/backend/data/crmdb.mv.db</li>
          <li>Para arrancar: backend en 8080 y frontend en 5173/5174</li>
        </ul>
      </div>
    </div>
  );
}
