// logica.js (consolas de depuración para puntual y semanal)
setInterval(() => {
  const ahora = new Date();
  const horaActual = ahora.toTimeString().slice(0, 5); // HH:MM
  const hoy = ahora.toISOString().split("T")[0]; // YYYY-MM-DD
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const diaActual = diasSemana[ahora.getDay()];

  console.log("🔄 Revisión activadores -", hoy, horaActual, "-", diaActual);

  window.db.ref("activadores").once("value").then(snapshot => {
    snapshot.forEach(child => {
      const a = child.val();
      const key = child.key;

      console.log("🟨 Revisando activador:", a.nombre, "| tipo:", a.tipo);

      const [hAl, mAl] = a.horaAleatoria.split(":").map(Number);
      const minutosAl = hAl * 60 + mAl;

      const [hNow, mNow] = horaActual.split(":").map(Number);
      const minutosNow = hNow * 60 + mNow;

      const dentroDelMargen = Math.abs(minutosNow - minutosAl) <= 2;
      const yaEjecutadoHoy = a.ultimaEjecucion === hoy;

      // ✅ Lógica puntual
      if (a.tipo === "una") {
        console.log("📌 Tipo puntual:", { fecha: a.fecha, hoy, yaEjecutadoHoy, dentroDelMargen });

        if (a.fecha !== hoy) return;
        if (yaEjecutadoHoy) return;

        if (dentroDelMargen) {
          console.log("🚀 Ejecutando webhook puntual:", a.webhook);
          fetch(a.webhook)
            .then(() => {
              window.db.ref(`activadores/${key}`).update({
                ultimaEjecucion: hoy,
                estado: "exitosa"
              });
              console.log("✅ Webhook puntual ejecutado:", a.nombre);
            })
            .catch(() => {
              window.db.ref(`activadores/${key}`).update({
                ultimaEjecucion: hoy,
                estado: "fallida"
              });
              console.warn("❌ Error ejecutando webhook puntual:", a.nombre);
            });
        } else {
          console.log("🕒 No está dentro del margen de hora aleatoria para puntual:", a.nombre);
        }
      }

      // 🔁 Lógica semanal
      if (a.tipo === "semanal") {
        console.log("📆 Tipo semanal:", { dias: a.dias, hoy: diaActual, yaEjecutadoHoy, dentroDelMargen });

        if (!Array.isArray(a.dias) || !a.dias.includes(diaActual)) return;
        if (yaEjecutadoHoy) return;

        if (dentroDelMargen) {
          console.log("🚀 Ejecutando webhook semanal:", a.webhook);
          fetch(a.webhook)
            .then(() => {
              window.db.ref(`activadores/${key}`).update({
                ultimaEjecucion: hoy,
                estado: "exitosa"
              });
              console.log("✅ Webhook semanal ejecutado:", a.nombre);
            })
            .catch(() => {
              window.db.ref(`activadores/${key}`).update({
                ultimaEjecucion: hoy,
                estado: "fallida"
              });
              console.warn("❌ Error ejecutando webhook semanal:", a.nombre);
            });
        } else {
          console.log("🕒 No está dentro del margen de hora aleatoria para semanal:", a.nombre);
        }
      }
    });
  });
}, 15000);

