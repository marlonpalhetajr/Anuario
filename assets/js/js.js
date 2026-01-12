// <!-- Autor: Andrei Antony da Cunha Castro -->
// <!-- Autor: Waldiney Joaci da Silva Barros -->
//escrever o tiulo nas tabelas
window.onload = function () {
  var titulo = document.getElementById('title');
  if (titulo) {
    titulo.innerHTML = '<div>Anuário Estatístico do Pará 2024</div>';
  }
}; //Fim

//desmarcar o input RADIO
function mudar() {
  var allRadios = document.getElementsByName('nome');
  var booRadio;
  var x = 0;
  for (x = 0; x < allRadios.length; x++) {
    allRadios[x].onclick = function () {
      if (booRadio === this) {
        this.checked = false;
        booRadio = null;
      } else {
        booRadio = this;
      }
    };
  }
}

//fechar menu responsivo para tela pequena
function fechar() {
  var box = document.getElementById('bt_menu');
  if (box.checked === true) {
    box.checked = false;
  }
}
