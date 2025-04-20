# 🚀 Activadores Automáticos para Redes Sociales

Este proyecto permite programar publicaciones automáticas a través de Webhooks utilizando Firebase como backend. Se puede elegir entre dos modos: ejecución **puntual** o **semanal**, con generación de hora aleatoria dentro de una franja horaria.

## 🛠️ Tecnologías utilizadas

- HTML / CSS / JavaScript
- Firebase Realtime Database
- Webhooks personalizados
- GitHub Pages (para despliegue)

## ✅ Funcionalidades

### 🕐 Activador Puntual
- Permite seleccionar una **fecha única**.
- Define una franja horaria (inicio y fin).
- Genera una **hora aleatoria** dentro de la franja.
- Se ejecuta **una sola vez** en esa fecha.
  
### 🔁 Activador Semanal
- Permite elegir uno o varios **días de la semana**.
- Genera una **hora aleatoria** dentro del rango elegido.
- Se ejecuta **una vez por día** cuando corresponda.

### 🧠 Lógica inteligente
- Usa `logica.js` para revisar y ejecutar activadores cada 15 segundos.
- Evita ejecuciones duplicadas gracias al control de `ultimaEjecucion`.

## 🧪 ¿Cómo probarlo?

1. Clonar este repositorio.
2. Configurar tu archivo `firebase-config.js` con tus credenciales de Firebase.
3. Ejecutar el proyecto en local o subirlo a GitHub Pages.
4. Probar creando activadores desde la interfaz.
5. Revisar la consola para verificar ejecuciones correctas.

## 📂 Estructura del proyecto

