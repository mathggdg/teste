// Telas
const telaInicial = document.getElementById('tela-inicial');
const telaLembretes = document.getElementById('tela-lembretes');
const telaContas = document.getElementById('tela-contas');

function abrirTela(telaEscolhida){
    telaInicial.style.display = 'none';
    telaLembretes.style.display = 'none';
    telaContas.style.display = 'none';
    telaEscolhida.style.display = 'block';
}

document.getElementById('opcao-lembretes').addEventListener('click', () => abrirTela(telaLembretes));
document.getElementById('opcao-contas').addEventListener('click', () => abrirTela(telaContas));
document.getElementById('voltar-lembretes').addEventListener('click', () => telaInicial.style.display = 'flex');
document.getElementById('voltar-contas').addEventListener('click', () => telaInicial.style.display = 'flex');

// Lembretes
const listaLembretes = document.getElementById('lista-lembretes');
const formLembrete = document.getElementById('form-lembrete');

document.getElementById('btn-adicionar-lembrete').addEventListener('click', () => formLembrete.classList.remove('form-hidden'));
document.getElementById('cancelar-lembrete').addEventListener('click', () => formLembrete.classList.add('form-hidden'));
document.getElementById('salvar-lembrete').addEventListener('click', () => {
    const titulo = document.getElementById('titulo-lembrete').value.trim();
    const desc = document.getElementById('descricao-lembrete').value.trim();
    const data = document.getElementById('data-lembrete').value;
    const hora = document.getElementById('hora-lembrete').value;
    const status = document.getElementById('status-lembrete').value;
    if(titulo && desc && data){
        let texto = `${titulo} - ${desc} - ${data}`;
        if(hora) texto += ` ${hora}`;
        texto += ` - ${status}`;
        const li = document.createElement('li');
        li.textContent = texto;
        li.classList.add('slide-in');
        listaLembretes.appendChild(li);
        formLembrete.classList.add('form-hidden');
        document.getElementById('titulo-lembrete').value = '';
        document.getElementById('descricao-lembrete').value = '';
        document.getElementById('data-lembrete').value = '';
        document.getElementById('hora-lembrete').value = '';
        salvarNoStorage();
    }
});

// Contas
const listaContas = document.getElementById('lista-contas');
const formConta = document.getElementById('form-conta');
const totalGasto = document.getElementById('total-gasto');
const totalPago = document.getElementById('total-pago');
const totalPendente = document.getElementById('total-pendente');

document.getElementById('btn-adicionar-conta').addEventListener('click', () => formConta.classList.remove('form-hidden'));
document.getElementById('cancelar-conta').addEventListener('click', () => formConta.classList.add('form-hidden'));
document.getElementById('salvar-conta').addEventListener('click', () => {
    const nome = document.getElementById('nome-conta').value.trim();
    const valor = parseFloat(document.getElementById('valor-conta').value);
    const status = document.getElementById('status-conta').value;
    const vencimento = document.getElementById('vencimento-conta').value;
    if(nome && valor && vencimento){
        const li = document.createElement('li');
        li.textContent = `${nome} - ${valor.toFixed(2)} - ${status} - ${vencimento}`;
        li.classList.add('slide-in');
        listaContas.appendChild(li);
        atualizarResumo();
        formConta.classList.add('form-hidden');
        document.getElementById('nome-conta').value = '';
        document.getElementById('valor-conta').value = '';
        document.getElementById('status-conta').value = 'nao-paga';
        document.getElementById('vencimento-conta').value = '';
        salvarNoStorage();
    }
});

// Resumo financeiro
function atualizarResumo(){
    let total=0, pago=0, pendente=0;
    Array.from(listaContas.children).forEach(li=>{
        const partes = li.textContent.split(' - ');
        const valor = parseFloat(partes[1]);
        total += valor;
        if(partes[2]==='paga') pago += valor;
        else pendente += valor;
    });
    totalGasto.textContent = total.toFixed(2);
    totalPago.textContent = pago.toFixed(2);
    totalPendente.textContent = pendente.toFixed(2);
}

// LocalStorage
function salvarNoStorage(){
    const lembretes = Array.from(listaLembretes.children).map(li=>li.textContent);
    const contas = Array.from(listaContas.children).map(li=>li.textContent);
    localStorage.setItem('lembretes', JSON.stringify(lembretes));
    localStorage.setItem('contas', JSON.stringify(contas));
}

function carregarDoStorage(){
    const lembretesSalvos = JSON.parse(localStorage.getItem('lembretes') || '[]');
    lembretesSalvos.forEach(texto=>{
        const li = document.createElement('li'); li.textContent = texto; li.classList.add('slide-in'); listaLembretes.appendChild(li);
    });
    const contasSalvas = JSON.parse(localStorage.getItem('contas') || '[]');
    contasSalvas.forEach(texto=>{
        const li = document.createElement('li'); li.textContent = texto; li.classList.add('slide-in'); listaContas.appendChild(li);
    });
    atualizarResumo();
}

window.addEventListener('load', carregarDoStorage);
