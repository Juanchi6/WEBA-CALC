async function TraerDatos() {
  try {
    const res = await fetch("http://localhost:3000/datos");
    if (!res.ok) throw new Error("Error al cargar datos");
    const datos = await res.json();

    const sideBar = document.getElementById("sideBar");

    datos
      .slice()
      .forEach((dato) => {
        let span = document.createElement("span");
        span.id = dato.id;
        span.classList.add("respuestasAnt");
        span.textContent = dato.cuenta + " = " + dato.seleccionada;

        let botonBorrar = document.createElement("button");
        botonBorrar.textContent = "✖"
        botonBorrar.classList.add("borrar")
        botonBorrar.addEventListener("click", () => {
          span.remove();
          removeFromFile(dato.id);
        })
        span.appendChild(botonBorrar);

        if (dato.seleccionada == dato.correcta) {
          span.classList.add("bien");
        } else {
          span.classList.add("mal");
        }
        sideBar.prepend(span);
      });
  } catch (err) {
    console.error(err);
  }
}

async function removeFromFile(dato_id) {
  try {
    const res = await fetch(`http://localhost:3000/datos/${dato_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) throw new Error("Error al borrar respuesta");
  } catch (err) {
    console.error(err);
  }
}

async function CargarJson(cuentaCargar, opcionesCargar, seleccionadaCargar, correctaCargar) {
  try {
    const res = await fetch("http://localhost:3000/datos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cuenta: cuentaCargar, opciones: opcionesCargar, seleccionada: seleccionadaCargar, correcta: correctaCargar })
    });
    if (!res.ok) throw new Error("Error al agregar post");
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

function getRandom(max) {
  return Math.floor(Math.random() * max);
}

function calculo(maximo) {
  const contenedor = document.getElementById("calculo");

  let num1 = getRandom(maximo);
  let num2 = getRandom(maximo);

  while (num1 === num2) {
    num2 = getRandom(maximo);
  }

  const operators = ["/", "-", "+", "x"];
  const operator = operators[getRandom(operators.length)];

  if (operator === "/") {
    num1 = (Math.floor(Math.random() * 8) + 2) * num2;
  }

  const resultado = getQuestionAnswer(num1, num2, operator);

  const cuenta = `${num1} ${operator} ${num2}`;
  contenedor.textContent = cuenta;

  opciones.add(resultado);

  while (opciones.size < 4) {
    opciones.add(getRandom(maximo*2));
  }

  opciones = [... opciones].sort(() => Math.random() - 0.5);

  document.getElementById("1").textContent = opciones[0];
  document.getElementById("2").textContent = opciones[1];
  document.getElementById("3").textContent = opciones[2];
  document.getElementById("4").textContent = opciones[3];

  correcta = resultado;

  return cuenta
}

function getQuestionAnswer(num1, num2, operator) {
  switch (operator) {
    case "/":
      return num1 / num2;
    case "-":
      return num1 - num2;
    case "+":
      return num1 + num2;
    case "x":
      return num1 * num2;
  }
}

TraerDatos();
let max = 100;
let seleccionada = null;
let opciones = new Set();
let correcta = null;
let cuenta = calculo(max);
const opButtons = document.querySelectorAll(".opciones button");

opButtons.forEach(boton => {
  boton.addEventListener("click", (event) => {
    seleccionada = event.target;

    opButtons.forEach(button => {
      button.style.backgroundColor = "rgb(195, 186, 164)"
    });

    seleccionada.style.backgroundColor = "rgb(148, 140, 120)";

  });
});

const botonContinuar = document.getElementById("boton"); 

botonContinuar.addEventListener("click", async () => {
  if (seleccionada !== null) {
    botonContinuar.disabled = true;
    const botones = document.querySelectorAll(".opciones button");
    
    const respuesta = await CargarJson(cuenta, opciones, seleccionada.innerText, correcta);

    const resp = document.createElement("span");
    resp.id = respuesta.id;
    resp.classList.add("respuestasAnt");
    resp.textContent = `${cuenta} = ${document.getElementById(seleccionada.id).innerText}`;
  
    const valor = parseInt(seleccionada.textContent);
    if (valor === correcta) {
      seleccionada.classList.add("correcta");
      seleccionada.textContent += " ✔";
      seleccionada.style.backgroundColor = "rgb(106, 153, 78)";
      resp.classList.add("bien");
    } else {
      seleccionada.classList.add("incorrecta");
      seleccionada.textContent += " ✘";
      seleccionada.style.backgroundColor = "rgb(188, 71, 73)";
      resp.classList.add("mal");
    }
    
    let botonBorrar = document.createElement("button");
    botonBorrar.textContent = "✖"
    botonBorrar.classList.add("borrar")
    botonBorrar.addEventListener("click", () => {
      resp.remove();
      removeFromFile(resp.id);
    })
    resp.appendChild(botonBorrar);

    document.getElementById("sideBar").prepend(resp);
  
    botones.forEach(boton => {
      boton.disabled = true;
    });
  
    setTimeout(() => {
      resp.style.display = "initial"
      botones.forEach(b => {
        b.disabled = false;
        botonContinuar.disabled = false;
        b.style.backgroundColor = "rgb(195, 186, 164)";
      });
      opciones = new Set();
      cuenta = calculo(max);
      seleccionada = null;
      max *= 1.1;
    }, 1000);
  } else {
    alert("seleccione una opción");
  }
  
});