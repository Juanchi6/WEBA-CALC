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
  contenedor.textContent = `${num1} ${operator} ${num2}`;

  let form1 = getRandom(maximo * 2);
  let form2 = getRandom(maximo * 2);
  while (form2 === form1 || form1 === resultado || form2 === resultado) {
    form1 = getRandom(maximo * 2);
    form2 = getRandom(maximo * 2);
  }

  const opciones = [resultado, form1, form2].sort(() => Math.random() - 0.5);

  document.getElementById("1").textContent = opciones[0];
  document.getElementById("2").textContent = opciones[1];
  document.getElementById("3").textContent = opciones[2];

  window.respuestaCorrecta = resultado;

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

let max = 100;
let cuenta = calculo(max);
let seleccionada = null;
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

document.getElementById("boton").addEventListener("click", () => {
  const botonSeleccionado = document.getElementById(seleccionada.id);
  const botones = document.querySelectorAll(".opciones button");

  const resp = document.createElement("span");
  resp.style.display = 'none';
  resp.classList.add("respuestasAnt");
  resp.textContent = cuenta + " = " + document.getElementById(seleccionada.id).innerText;
  document.getElementById("sideBar").prepend(resp)

  const valor = parseInt(botonSeleccionado.textContent);
  if (valor === window.respuestaCorrecta) {
    botonSeleccionado.classList.add("correcta");
    botonSeleccionado.textContent += " ✔";
    botonSeleccionado.style.backgroundColor = "rgb(106, 153, 78)";
    resp.style.backgroundColor = "rgb(106, 153, 78)";
  } else {
    botonSeleccionado.classList.add("incorrecta");
    botonSeleccionado.textContent += " ✘";
    botonSeleccionado.style.backgroundColor = "rgb(188, 71, 73)";
    resp.style.backgroundColor = "rgb(188, 71, 73)";
  }

  botones.forEach(boton => {
    boton.disabled = true;
  });

  setTimeout(() => {
    resp.style.display = "initial"
    botones.forEach(b => {
      b.disabled = false;
      b.classList.remove("correcta", "incorrecta");
      b.style.backgroundColor = "rgb(195, 186, 164)";
    });
    cuenta = calculo(max);
    seleccionada = null;
    max *= 1.1;
  }, 1000);
});
