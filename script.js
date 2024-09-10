const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];


// ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex"
})

// FECHAR O MODAL QUANDO CLICAR FORA

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none"
  }
})
// fechar modal ao clicar no btn Fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none"
})
//pegando o item clicado do carrinho
menu.addEventListener("click", function (event) {
  //console.log(event.target)
  let parentButton = event.target.closest(".add-to-cart-btn")

  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    //console.log(name);
    //console.log(price);

    addToCart(name, price)

  }

})
//Funcao para adicionar no carrinho (lista de array)
function addToCart(name, price) {
  //alert("O item é " + name )
  const existingItem = cart.find(item => item.name === name)

  if (existingItem) {
    //se o item ja existe , aumenta a qt + 1 
    //console.log(existingItem);
    existingItem.quantity += 1;
    //return;

    // se ele entra no if muda a qt + 1 se nao ele adiciona qt 1
  } else {

    cart.push({
      name,
      price,
      quantity: 1,
    })
  }

  updateCartModal()

}
//Atualiza o carrinho

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  //como é uma lista - uso o foreach q é loop percorrendo o it car
  cart.forEach(item => {
    //console.log(item);
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `
  
  <div class="flex items-center justify-between">
     <div> 
        <p class="font-bold">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2 ">R$ ${item.price.toFixed(2)}</p>

  </div>

    <button class="remover-btn" data-name="${item.name}">
        Remover
    </button> 

</div>
  
  `
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)
  })
  //total da conta
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
  //contador no footer 

  cartCounter.innerHTML = cart.length;
}
//Remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remover-btn")) {
    const name = event.target.getAttribute("data-name")

    //console.log(name)
    removeItemCart(name);
  }
})

function removeItemCart(name) {
  //encontrar a posicao do item na lista
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      // chamada para atualizar a lista depois de excluir
      updateCartModal();
      return;
    }
    //pega a posicao e remove o item da lista 
    cart.splice(index, 1);
    updateCartModal();
  }

}

//acessando e ficando de olho no campo input 
addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden")
  }


})
//finalizar pedido
checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if(!isOpen) {

   Toastify({
     text: "Ops o restaurante está fechado!",
     duration: 3000,
     newWindow: true,
     close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
     stopOnFocus: true, // Prevents dismissing of toast on hover
     style: {
        background: "#ef4444",
      },

    }).showToast();

   return;
}

if (cart.length === 0) return;
if (addressInput.value === "") {
  addressWarn.classList.remove("hidden")
  addressInput.classList.add("border-red-500");
  return;
}
// Calcular o valor total do pedido
  let total = 0;
  const cartItems = cart.map((item) => {
    total += item.price * item.quantity; // Soma o total de cada item
    return (
      `${item.name} \nQuantidade: (${item.quantity}) \nPreço: R$ ${item.price.toFixed(2)}\n`
    );
  }).join("\n");

  // Incluir o total na mensagem
  const message = encodeURIComponent(
    `Pedido:\n\n${cartItems}\nTotal Pedido: R$ ${total.toFixed(2)}\nEndereço Entrega: ${addressInput.value}`
  );

  // Número de telefone do WhatsApp (formato internacional)
  const phone = "+31683836659";

  // Abrir WhatsApp com a mensagem
  window.open(`https://wa.me/${phone}?text=${message}`, "_Blank");

  // Limpar o carrinho após o envio
  cart = [];
  updateCartModal();
});

// checar se o restaurante esta aberto / manipular card horario
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 12 && hora < 22; // true = restaur. aberto

}
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}