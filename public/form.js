document.addEventListener("DOMContentLoaded", function () {
  //Nombre de los cursos

  const data = {
    courses: [
      /* {
        course_code: "RIA-A",
        course_name: "Bootcamp creación de recursos educativos digitales con IA",
        start_date:
          "Inicia el miércoles 1 de abril de 19 a 21 hs. (Hora de Argentina)",
      }, */
      {
        course_code: "LIA-J",
        course_name: "Lab de IA y educación (comisión jueves)",
        start_date:
          "Inicia el jueves 23 de abril de 19 a 21 hs. (Hora de Argentina)",
      },
      /* {
        course_code: "LIA-S",
        course_name: "Lab de IA y educación (comisión sábados)",
        start_date:
          "Inicia el sábado 18 de abril de 14.30 a 16.30 hs. (Hora de Argentina)",
      }, */
      {
        course_code: "BOT-J",
        course_name: "Lab de IA y chatbots educativos",
        start_date:
          "Inicia el miércoles 14 de mayo de 19 a 21 hs. (Hora de Argentina)",
      },
      {
        course_code: "INF",
        course_name: "Entre infancias y pantallas",
        start_date:
          "Inicia el sábado 13 de junio de 10 a 12 hs. (Hora de Argentina)",
      },
      {
        course_code: "EIA-M",
        course_name: "Lab de IA y evaluación educativa",
        start_date:
          "Inicia el martes 9 de junio de 19 a 21 hs. (Hora de Argentina)",
      },
      {
        course_code: "MAT",
        course_name: "Diseño de materiales didácticos digitales",
        start_date:
          "Inicia el martes 9 de junio de 18.30 a 20 hs. (Hora de Argentina)",
      },
    ],
  };

  //const data = fetchData();

  const modalConfirm = document.querySelector("#modal-confirm");
  if (!modalConfirm) return;

  const urlParams = new URLSearchParams(window.location.search);
  const ide = urlParams.get("ide");
  if (!ide) return;

  //Modal confirm footer y botón
  const confirmButton = modalConfirm.querySelector("#modal-confirmar-button");

  if (confirmButton) {
    confirmButton.className = "btn btn-light";
    confirmButton.disabled = true;
  }

  const title = modalConfirm.querySelector(".modal-header b"); // Usar solo uno, no querySelectorAll
  title.innerHTML = "Selección de cursos";

  // Obtener el modal-body
  const modalBody = modalConfirm.querySelector(".modal-body"); // Usar solo uno, no querySelectorAll

  if (modalBody && data) {
    modifyModalConfirm(data, modalBody, ide);
  }
});

function modifyModalConfirm(data, modalBody, ide) {
  // 1. Guardar el div con class .mb-3 si existe
  const mb3 = modifyInputCode(modalBody);

  // 2. Limpiar el contenido actual
  modalBody.innerHTML = "";

  // 3. Crear y agregar el div de descripción
  const formDesc = formDescription(ide);
  modalBody.appendChild(formDesc);

  // 4. Crear los checkboxes con callback para actualizar el input hidden
  const checkboxContainer = createCheckboxesFromData(data, modalBody, ide);

  modalBody.appendChild(checkboxContainer);

  // 5. Agregar nuevamente el div .mb-3 si existía
  if (mb3) {
    modalBody.appendChild(mb3);
  }
}

function formDescription(ide) {
  const formDescription = document.createElement("div");
  formDescription.className = "form-description";

  //Segun id de formulario, se define la cantidad de cursos a seleccionar
  const cant = ide === "2182" ? "3" : ide === "2172" ? "2" : "al menos 1";

  const descriptionText = document.createElement("p");
  descriptionText.innerHTML = `Por favor, indicá que propuestas cursarás.<br/>Debés elegir ${cant}.`;

  formDescription.appendChild(descriptionText);
  return formDescription;
}

function createCheckboxesFromData(data, modalBody, ide) {
  const checkboxContainer = document.createElement("div");
  checkboxContainer.className = "course-checkbox";

  data.courses.forEach((course) => {
    const formCheck = document.createElement("div");
    formCheck.className = "form-check d-flex mb-3";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input mt-1"; // mt-1 para subir un poco el checkbox
    checkbox.id = course.course_code;
    checkbox.value = course.course_code;

    const label = document.createElement("label");
    label.className = "form-check-label ms-2"; // Separación izquierda del checkbox
    label.htmlFor = course.course_code;
    label.innerHTML = `<strong>${course.course_name}.</strong> ${course.start_date}`;

    // Callback para manejar el cambio de estado del checkbox
    checkbox.addEventListener("change", () => {
      onChangeCallback(ide, modalBody);
    });

    formCheck.appendChild(checkbox);
    formCheck.appendChild(label);

    checkboxContainer.appendChild(formCheck);
  });

  return checkboxContainer;
}

function modifyInputCode(modalBody) {
  // 1. Guardar el div con class .mb-3 si existe
  const mb3 = modalBody.querySelector(".mb-3");

  if (!mb3) return null;

  // Si existe, cambiar su id a 'content-code'
  mb3.id = "content-code";

  const label = mb3.querySelector("label");

  if (label) {
    label.style.display = "none";
  }

  // 2. Cambiar el input con id="code" a tipo hidden
  const codeInput = mb3.querySelector("#code");

  if (codeInput) {
    codeInput.type = "hidden";
  }

  return mb3;
}

function onChangeCallback(ide, modalBody) {
  const codeInput = document.querySelector("#code");
  const confirmButton = document.querySelector("#modal-confirmar-button");
  const content_code = document.querySelector("#content-code");

  if (!codeInput || !confirmButton || !content_code) return;

  const cant = ide === "2182" ? 3 : ide === "2172" ? 2 : 1;

  const selectedCheckboxes = Array.from(
    modalBody.querySelectorAll(
      '.course-checkbox input[type="checkbox"]:checked'
    )
  ).map((checkbox) => checkbox.value);

  // Setear el valor del input hidden
  codeInput.value = selectedCheckboxes.join(", ");

  // Verificar si ya hay un mensaje de alerta
  let msj = content_code.querySelector(".alert-danger");

  if (selectedCheckboxes.length === cant) {
    confirmButton.className = "btn btn-success";
    confirmButton.disabled = false;

    if (msj) {
      content_code.removeChild(msj);
    }
  } else {
    confirmButton.className = "btn btn-light";
    confirmButton.disabled = true;

    if (selectedCheckboxes.length > cant) {
      if (!msj) {
        msj = document.createElement("p");
        msj.className = "alert alert-danger";
        msj.innerHTML =
          "Has seleccionado más cursos de los permitidos. Por favor, seleccioná solo la cantidad indicada.";
        content_code.appendChild(msj);
      }
    } else {
      if (msj) {
        content_code.removeChild(msj);
      }
    }
  }
}

async function fetchData() {
  try {
    const response = await fetch(
      "https://redaccion.pent.org.ar/sites/default/files/courses.json"
    );
    if (!response.ok) {
      throw new Error("Error al cargar course.json");
    }
    const data = await response.json();

    console.log("Datos de cursos cargados:", data);

    return data;
  } catch (error) {
    console.log("Error al procesar los cursos:", error);
  }
}
