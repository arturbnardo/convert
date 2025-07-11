// Chave da ExchangeRate API
const API_KEY = 'c4bd3d740e4562e7eaaaee37'

// Obtendo os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const currency = document.getElementById("currency")
const footer = document.querySelector("main footer")
const description = document.getElementById("description")
const result = document.getElementById("result")

// Manipulando o input amount para receber somente números.
amount.addEventListener("input", () => {
  const hasCharactersRegex = /\D+/g
  amount.value = amount.value.replace(hasCharactersRegex, "")
})

// Evento de submit do formulário.
form.onsubmit = async (event) => {
  event.preventDefault()

  const valorInput = amount.value
  const moedaDestino = currency.value

  if (!valorInput || !moedaDestino) {
    alert("Preencha todos os campos.")
    return
  }

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${moedaDestino}`)
    const data = await response.json()

    if (data.result !== "success") {
      throw new Error("Erro ao buscar taxas")
    }

    // A taxa é o valor de 1 unidade da moeda escolhida (USD/EUR/GBP) em BRL
    const taxa = data.conversion_rates["BRL"]

    // Define o símbolo
    const simbolo = {
      "USD": "US$",
      "EUR": "€",
      "GBP": "£"
    }[moedaDestino] || ""

    convertCurrency(valorInput, taxa, simbolo)

  } catch (error) {
    footer.classList.remove("show-result")
    console.error(error)
    alert("Erro ao buscar taxa de câmbio. Tente novamente mais tarde.")
  }
}

// Função que realiza a conversão e atualiza o resultado
function convertCurrency(amount, price, symbol){
  try {
    description.textContent = `${symbol} 1 = ${formatCurrencyBRL(price)}`
    
    let total = amount * price

    if(isNaN(total)){
      return alert("Por favor, digite o valor corretamente para converter")
    }

    total = formatCurrencyBRL(total).replace("R$", "")
    result.textContent = `${total} Reais`
    footer.classList.add("show-result")
  } catch (error) {
    footer.classList.remove("show-result")
    console.error(error)
    alert("Erro ao processar a conversão.")
  }
}

// Formata para moeda brasileira
function formatCurrencyBRL(value){
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}