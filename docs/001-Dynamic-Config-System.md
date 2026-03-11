# 001 - Sistema de Configuración Dinámica (Dynamic Config System)

## Descripción General
Este documento describe la implementación de un sistema de configuración dinámica que permite gestionar las credenciales de APIs externas (como WhatsApp, Instagram, etc.) directamente desde la base de datos, sin necesidad de redesplegar el backend.

## 1. Modelo de Datos (Backend)

### Entidad: `SystemConfig`
Se utilizará una tabla simple de clave-valor para almacenar las configuraciones.

- **Table Name**: `system_configs`
- **Columns**:
    - `key` (String, Primary Key): Identificador único de la configuración (ej. `whatsapp_api_token`).
    - `value` (String, Text): Valor de la configuración (puede ser largo).
    - `description` (String): Descripción opcional para entender qué hace la clave.

### Claves Iniciales
- `whatsapp_api_token`: Token de acceso temporal/permanente de Meta.
- `whatsapp_phone_number_id`: ID del número de teléfono de WhatsApp Business.

## 2. API Endpoints

### `ConfigController`
Controlador REST para gestionar las configuraciones.

- **GET /api/configs/{key}**: Obtiene el valor de una configuración específica.
- **POST /api/configs**: Crea o actualiza una configuración.
    - Body: `{ "key": "...", "value": "..." }`
- **GET /api/configs/whatsapp**: (Helper) Devuelve un objeto con todas las configs de WhatsApp.

## 3. Lógica de Negocio (Service Layer)

### `WhatsAppService`
Actualmente lee las credenciales de `application.properties`. Se modificará para:
1. Intentar leer la configuración de la base de datos (`SystemConfigRepository`).
2. Si no existe en BD, usar el valor por defecto de las variables de entorno (para mantener compatibilidad hacia atrás).

## 4. Frontend (React)

### Página: `Settings`
Nueva ruta `/settings` accesible desde el menú lateral.

- **Sección WhatsApp**:
    - Input: API Token
    - Input: Phone Number ID
    - Botón: "Guardar Configuración"

### Integración
- Al cargar la página, se llama a `GET /api/configs/whatsapp` para rellenar los inputs.
- Al guardar, se llama a `POST /api/configs` para actualizar los valores.

## 5. Seguridad
- Los endpoints de configuración (`/api/configs/**`) deben estar protegidos y solo accesibles para usuarios con rol `ADMIN`.
