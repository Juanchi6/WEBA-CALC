function getRandom(max) {
    return Math.floor(Math.random() * max);
  }
  
  function calculo(maximo) {
    const contenedor = document.getElementById("calculo");
  
    const num1 = getRandom(maximo);
    const num2 = getRandom(maximo);
    const resultado = num1 + num2;
  
    contenedor.textContent = `${num1} + ${num2}`;
  
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
  }
  
  let max = 100;
  calculo(max);
  
  let seleccionada = null;
  
  document.querySelectorAll(".opciones button").forEach(boton => {
    boton.addEventListener("click", () => {
      seleccionada = parseInt(boton.textContent);
  
      document.querySelectorAll(".opciones button").forEach(b => {
        b.classList.remove("correcta", "incorrecta");
        b.style.backgroundColor = "rgb(182, 177, 177)";
      });
  
      boton.style.backgroundColor = "#ccc";
    });
  });
  
  document.getElementById("boton").addEventListener("click", () => {
    const botones = document.querySelectorAll(".opciones button");
  
    botones.forEach(boton => {
      const valor = parseInt(boton.textContent);
      if (valor === window.respuestaCorrecta) {
        boton.classList.add("correcta");
        boton.textContent += "✔";
      } else {
        boton.classList.add("incorrecta");
        boton.textContent += " ❌";
      }
      boton.disabled = true;
    });
  
    setTimeout(() => {
      botones.forEach(b => {
        b.disabled = false;
        b.classList.remove("correcta", "incorrecta");
      });
      calculo(max);
      seleccionada = null;
      max *= 1.1;
    }, 2000);
  });
  