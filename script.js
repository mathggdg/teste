// ================== TELA INICIAL ==================
const telaInicial = document.getElementById('tela-inicial');
const telaLembretes = document.getElementById('tela-lembretes');
const telaContas = document.getElementById('tela-contas');

document.getElementById('opcao-lembretes').addEventListener('click', () => {
    telaInicial.style.display = 'none';
    telaLembretes.style.display = 'block';
});

document.getElementById('opcao-contas').addEventListener('click', () => {
    telaInicial.style.display = 'none';
    telaContas.style.display = 'block';
});

document.getElementById('voltar-inicial-lembretes').addEventListener('click', () => {
    telaLembretes.style.display = 'none';
    telaInicial.style.display = 'block';
});

document.getElementById('voltar-inicial-contas').addEventListener('click', () => {
    telaContas.style.display = 'none';
    telaInicial.style.display = 'block';
});

// ================== LEMBRETES ==================
const listaLembretes = document.getElementById('lista-lembretes');
const formLembrete = document.getElementById('form-lembrete');

document.getElementById('btn-adicionar-lembrete').addEventListener('click', () => formLembrete.classList.remove('form-hidden'));
document.getElementById('cancelar-lembrete').addEventListener('click', () => formLembrete.classList.add('form-hidden'));

document.getElementById('salvar-lembrete').addEventListener('click', () => {
    const titulo = document.getElementById('titulo-lembrete').value.trim();
    const desc = document.getElementById('descricao-lembrete').value.trim();
    const data = document.getElementById('data-lembrete').value;
    const status = document.getElementById('status-lembrete').value;

    if (titulo && desc && data) {
        const li = document.createElement('li');
        li.textContent = `${titulo} - ${desc} - ${data} - ${status}`;
        li.classList.add('slide-in');
        li.addEventListener('click', () => toggleStatusLembrete(li));
        listaLembretes.appendChild(li);
        formLembrete.classList.add('form-hidden');
        document.getElementById('titulo-lembrete').value = '';
        document.getElementById('descricao-lembrete').value = '';
        document.getElementById('data-lembrete').value = '';
        document.getElementById('status-lembrete').value = 'nao-realizado';
        salvarNoStorage();
    }
});

function toggleStatusLembrete(li) {
    let partes = li.textContent.split(' - ');
    partes[3] = partes[3] === 'realizado' ? 'nao-realizado' : 'realizado';
    li.textContent = partes.join(' - ');
    li.classList.add('slide-in');
    salvarNoStorage();
}

// Filtro mês lembretes
document.getElementById('filtro-mes-lembretes').addEventListener('change', e => {
    const mesFiltro = e.target.value; // formato YYYY-MM
    Array.from(listaLembretes.children).forEach(li => {
        li.style.display = li.textContent.includes(mesFiltro) ? 'flex' : 'none';
    });
});

// ================== CONTAS ==================
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

    if (nome && valor && vencimento) {
        const li = document.createElement('li');
        li.textContent = `${nome} - ${valor.toFixed(2)} - ${status} - ${vencimento}`;
        li.classList.add('slide-in');
        li.addEventListener('click', () => toggleStatusConta(li));
        listaContas.appendChild(li);
        formConta.classList.add('form-hidden');
        document.getElementById('nome-conta').value = '';
        document.getElementById('valor-conta').value = '';
        document.getElementById('vencimento-conta').value = '';
        document.getElementById('status-conta').value = 'nao-paga';
        atualizarResumo();
        salvarNoStorage();
    }
});

function toggleStatusConta(li) {
    let partes = li.textContent.split(' - ');
    partes[2] = partes[2] === 'paga' ? 'nao-paga' : 'paga';
    li.textContent = partes.join(' - ');
    li.classList.add('slide-in');
    atualizarResumo();
    salvarNoStorage();
}

// Filtro mês contas
document.getElementById('filtro-mes-contas').addEventListener('change', e => {
    const mesFiltro = e.target.value;
    Array.from(listaContas.children).forEach(li => {
        li.style.display = li.textContent.includes(mesFiltro) ? 'flex' : 'none';
    });
});

// ================== RESUMO ==================
function atualizarResumo() {
    let total = 0, pago = 0, pendente = 0;
    Array.from(listaContas.children).forEach(li => {
        const partes = li.textContent.split(' - ');
        const valor = parseFloat(partes[1]);
        total += valor;
        if (partes[2] === 'paga') pago += valor;
        else pendente += valor;
    });
    totalGasto.textContent = total.toFixed(2);
    totalPago.textContent = pago.toFixed(2);
    totalPendente.textContent = pendente.toFixed(2);
}

// ================== LOCALSTORAGE ==================
function salvarNoStorage() {
    const lembretes = Array.from(listaLembretes.children).map(li => li.textContent);
    const contas = Array.from(listaContas.children).map(li => li.textContent);
    localStorage.setItem('lembretes', JSON.stringify(lembretes));
    localStorage.setItem('contas', JSON.stringify(contas));
}

function carregarDoStorage() {
    const lembretesSalvos = JSON.parse(localStorage.getItem('lembretes') || '[]');
    lembretesSalvos.forEach(texto => {
        const li = document.createElement('li');
        li.textContent = texto;
        li.classList.add('slide-in');
        li.addEventListener('click', () => toggleStatusLembrete(li));
        listaLembretes.appendChild(li);
    });

    const contasSalvas = JSON.parse(localStorage.getItem('contas') || '[]');
    contasSalvas.forEach(texto => {
        const li = document.createElement('li');
        li.textContent = texto;
        li.classList.add('slide-in');
        li.addEventListener('click', () => toggleStatusConta(li));
        listaContas.appendChild(li);
    });
    atualizarResumo();
}

window.addEventListener('load', carregarDoStorage);
