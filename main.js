document.addEventListener("DOMContentLoaded", () => {
  const tipo = document.getElementById("tipo");
  const diasSemanaDiv = document.getElementById("diasSemana");
  const fechaContainer = document.getElementById("fechaPuntualContainer");
  const btnGuardar = document.getElementById("btnGuardar");
  const lista = document.getElementById("listaActivadores");

  tipo.addEventListener("change", () => {
    const esSemanal = tipo.value === "semanal";
    diasSemanaDiv.style.display = esSemanal ? "block" : "none";
    fechaContainer.style.display = esSemanal ? "none" : "block";
  
    // ✅ Limpiar los checks si se vuelve a "una vez"
    if (!esSemanal) {
      document.querySelectorAll("#diasSemana input").forEach(cb => cb.checked = false);
    }
  });
  

  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreProgramador").value;
    const comentario = document.getElementById("comentario").value;
    const tipoVal = tipo.value;
    const inicio = document.getElementById("horaInicio").value;
    const fin = document.getElementById("horaFin").value;
    const webhook = document.getElementById("webhook").value;
    const dias = Array.from(document.querySelectorAll("#diasSemana input:checked")).map(cb => cb.value);
    const fecha = document.getElementById("fechaUnica").value;

    if (!nombre || !comentario || !inicio || !fin || !webhook || (tipoVal === 'una' && !fecha)) {
      alert("Completa todos los campos.");
      return;
    }

    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fin.split(":").map(Number);
    const t1 = h1 * 60 + m1;
    const t2 = h2 * 60 + m2;

    let horaAleatoria = inicio;
    if (t2 > t1) {
      let randomMin = Math.floor(Math.random() * (t2 - t1 + 1)) + t1;
      if ((t2 - t1) > 0 && randomMin === t1) randomMin += 1;
      horaAleatoria = `${String(Math.floor(randomMin / 60)).padStart(2, "0")}:${String(randomMin % 60).padStart(2, "0")}`;
    }

    const activador = {
      nombre, comentario, tipo: tipoVal, dias, fecha, inicio, fin, webhook,
      horaAleatoria, ultimaEjecucion: "", estado: "pendiente"
    };

    window.db.ref("activadores").push(activador).then(() => {
      mostrarToast("✅ Activador guardado con hora aleatoria: " + horaAleatoria);
      limpiarFormulario();
      cargarActivadores();
    });
  });

  function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.innerText = mensaje;
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 3000);
  }

  function limpiarFormulario() {
    document.getElementById("nombreProgramador").value = "";
    document.getElementById("comentario").value = "";
    document.getElementById("horaInicio").value = "";
    document.getElementById("horaFin").value = "";
    document.getElementById("webhook").value = "";
    document.getElementById("fechaUnica").value = "";
    tipo.value = "una";
    diasSemanaDiv.style.display = "none";
    fechaContainer.style.display = "block";
    document.querySelectorAll("#diasSemana input").forEach(cb => cb.checked = false);
  }

  function cargarActivadores() {
    window.db.ref("activadores").on("value", snapshot => {
      lista.innerHTML = "";
      snapshot.forEach(child => {
        const a = child.val();
        const key = child.key;
        const div = document.createElement("div");
        div.className = "activador";
        div.innerHTML = `
          <strong>Nombre:</strong> ${a.nombre}<br>
          <strong>Comentario:</strong> ${a.comentario}<br>
          <strong>Franja horaria:</strong> ${a.inicio} - ${a.fin}<br>
          <strong>Hora aleatoria:</strong> ${a.horaAleatoria}<br>
          ${a.tipo === 'una' ? `<strong>Fecha puntual:</strong> ${a.fecha}<br>` : ''}
          ${a.tipo === 'semanal' ? `<strong>Días:</strong> ${(a.dias || []).join(", ")}<br>` : ''}
          <strong>Webhook:</strong> ${a.webhook}<br>
          <strong>Última ejecución:</strong> ${a.ultimaEjecucion || 'Nunca'} (${a.estado || 'pendiente'})<br>
          <button onclick="eliminarActivador('${key}')">❌ Eliminar</button>
          <hr>`;
        lista.appendChild(div);
      });
    });
  }

  window.eliminarActivador = function (id) {
    window.db.ref("activadores/" + id).remove().then(() => {
      mostrarToast("❌ Activador eliminado");
    });
  };

  cargarActivadores();
});