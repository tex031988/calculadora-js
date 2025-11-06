// app.js - Versão corrigida e comentada

const input = document.getElementById("display");
const botoes = document.getElementById("botoes");
const limparBtn = document.getElementById("limpar");

/* --- Utilitários --- */
function ehOperador(ch) {
  return ch === '+' || ch === '-' || ch === '*' || ch === '/';
}

function sanitizarExpressao(expr) {
  // permite dígitos, operadores básicos, parênteses, ponto e espaços
  return expr.replace(/[^0-9+\-*/().\s]/g, "");
}

function avaliarExpressao(expr) {
  const limpa = sanitizarExpressao(expr).trim();

  // Se estiver vazio, não tentar avaliar
  if (limpa === "") return "Erro";

  try {
    // Envolver entre parênteses evita ambiguidades em algumas expressões
    const resultado = Function('"use strict"; return (' + limpa + ')')();

    // Se não for número finito, consideramos erro (ex.: divisão por zero)
    if (typeof resultado !== 'number' || !isFinite(resultado)) {
      return "Erro";
    }

    // Para evitar exibir longas casas decimais, podemos limitar casas (opcional)
    // Ex.: return Number.isInteger(resultado) ? resultado : parseFloat(resultado.toFixed(10));
    return resultado;
  } catch (e) {
    return "Erro";
  }
}

/* --- Inserção no display com regras --- */
function inserirNoDisplay(valor) {
  const displayAtual = input.value;
  const ultimoCaractere = displayAtual.slice(-1);

  // Se display vazio
  if (displayAtual === "") {
    // Permitir número, '-', ou '.' (transformando '.' em '0.')
    if (!isNaN(valor)) {
      input.value += valor;
    } else if (valor === "-") {
      input.value += valor;
    } else if (valor === ".") {
      input.value += "0.";
    }
    return;
  }

  // Se valor é operador
  if (ehOperador(valor)) {
    // Se último também é operador, substitui
    if (ehOperador(ultimoCaractere)) {
      input.value = displayAtual.slice(0, -1) + valor;
    } else {
      input.value += valor;
    }
    return;
  }

  // Se valor é ponto decimal
  if (valor === ".") {
    // Encontrar posição do último operador para separar a "parcela" atual
    const operadores = ["+", "-", "*", "/"];
    let posOperador = -1;
    for (let op of operadores) {
      const pos = displayAtual.lastIndexOf(op);
      if (pos > posOperador) posOperador = pos;
    }

    const ultimaParte = displayAtual.slice(posOperador + 1);

    // Se já tiver ponto na parcela atual, não insere
    if (ultimaParte.includes(".")) {
      return;
    }

    // Se a parcela estiver vazia (ex.: "5+" e usuário digita '.'), inserir '0.'
    if (ultimaParte === "") {
      input.value += "0.";
    } else {
      input.value += ".";
    }
    return;
  }

  // Se for número
  if (!isNaN(valor)) {
    input.value += valor;
  }
}

/* --- Limpar e apagar último --- */
function limparDisplay() {
  input.value = "";
}

function apagarUltimo() {
  const displayAtual = input.value;
  if (displayAtual.length > 0) {
    // remove o último caractere (slice 0..-1)
    input.value = displayAtual.slice(0, -1);
  }
}

/* --- Delegação de eventos para os botões --- */
botoes.addEventListener("click", (e) => {
  if (e.target.tagName !== 'BUTTON') return;

  const texto = e.target.textContent.trim();

  if (texto === 'C') {
    limparDisplay();
  } else if (texto === '=') {
    const resultado = avaliarExpressao(input.value);
    input.value = (resultado === "Erro") ? "Erro" : String(resultado);
  } else {
    inserirNoDisplay(texto);
  }
});

/* --- Inicialização --- */
function inicializarDisplay() {
  input.value = '';
}

inicializarDisplay();
