// 📌 Elementos principais
const telaInicial = document.getElementById('tela-inicial');
const telaLembretes = document.getElementById('tela-lembretes');
const telaContas = document.getElementById('tela-contas');

// 📌 Abrir tela escolhida
function abrirTela(telaEscolhida){
    telaInicial.style.display = 'none';
    telaLembretes.style.display = 'none';
    telaContas.style.display = 'none';
    telaEscolhida.style.display = 'block';
}

// Botões de menu inicial
document.getElementById('opcao-lembretes').addEventListener('click', () => abrirTela(telaLembretes));
document.getElementById('opcao-contas').addEventListener('click', () => abrirTela(telaContas));

// Botões de voltar ao menu inicial
document.getElementById('voltar-inicial-lembretes').addEventListener('click', () => abrirTela(telaInicial));
document.getElementById('voltar-inicial-contas').addEventListener('click', () => abrirTela(telaInicial));

// ===================== LEMBRETES =====================
const listaLembretes = document.getElementById('lista-lembretes');
const formLembrete = document.getElementById('form-lembrete');
const filtroMesLembretes = document.getElementById('filtro-mes-lembretes');

// Abrir / fechar formulário
document.getElementById('btn-adicionar-lembrete').addEventListener('click', () => formLembrete.classList.remove('form-hidden'));
document.getElementById('cancelar-lembrete').addEventListener('click', () => formLembrete.classList.add('form-hidden'));

// Salvar lembrete
document.getElementById('salvar-lembrete').addEventListener('click', () => {
    const titulo = document.getElementById('titulo-lembrete').value.trim();
    const desc = document.getElementById('descricao-lembrete').value.trim();
    const data = document.getElementById('data-lembrete').value;
    if(titulo && desc && data){
        const li = document.createElement('li');
        li.textContent = `${titulo} - ${desc} - ${data}`;
        li.dataset.data = data; // para filtro
        li.classList.add('slide-in');
        listaLembretes.appendChild(li);
        formLembrete.classList.add('form-hidden');
        document.getElementById('titulo-lembrete').value = '';
        document.getElementById('descricao-lembrete').value = '';
        document.getElementById('data-lembrete').value = '';
        salvarNoStorage();
        enviarNotificacao("📋 Novo lembrete", `${titulo} - ${desc}`);
        aplicarFiltroLembretes();
    }
});

// Filtrar lembretes por mês
filtroMesLembretes.addEventListener('change', aplicarFiltroLembretes);
function aplicarFiltroLembretes(){
    const mesSelecionado = filtroMesLembretes.value; // YYYY-MM
    Array.from(listaLembretes.children).forEach(li => {
        if(!mesSelecionado || li.dataset.data.startsWith(mesSelecionado)){
            li.style.display = 'flex';
        } else {
            li.style.display = 'none';
        }
    });
}

// ===================== CONTAS =====================
const listaContas = document.getElementById('lista-contas');
const formConta = document.getElementById('form-conta');
const filtroMesContas = document.getElementById('filtro-mes-contas');
const totalGasto = document.getElementById('total-gasto');
const totalPago = document.getElementById('total-pago');
const totalPendente = document.getElementById('total-pendente');

// Abrir / fechar formulário
document.getElementById('btn-adicionar-conta').addEventListener('click', () => formConta.classList.remove('form-hidden'));
document.getElementById('cancelar-conta').addEventListener('click', () => formConta.classList.add('form-hidden'));

// Salvar conta
document.getElementById('salvar-conta').addEventListener('click', () => {
    const nome = document.getElementById('nome-conta').value.trim();
    const valor = parseFloat(document.getElementById('valor-conta').value);
    const status = document.getElementById('status-conta').value;
    const vencimento = document.getElementById('vencimento-conta').value;
    if(nome && valor && vencimento){
        const li = document.createElement('li');
        li.textContent = `${nome} - ${valor.toFixed(2)} - ${status} - ${vencimento}`;
        li.dataset.vencimento = vencimento;
        li.dataset.status = status;
        li.dataset.valor = valor;
        li.classList.add('slide-in');
        listaContas.appendChild(li);
        formConta.classList.add('form-hidden');
        document.getElementById('nome-conta').value = '';
        document.getElementById('valor-conta').value = '';
        document.getElementById('status-conta').value = 'nao-paga';
        document.getElementById('vencimento-conta').value = '';
        salvarNoStorage();
        enviarNotificacao("💰 Nova conta", `${nome} - ${valor.toFixed(2)} - ${status}`);
        aplicarFiltroContas();
        atualizarResumo();
    }
});

// Filtrar contas por mês
filtroMesContas.addEventListener('change', () => {
    aplicarFiltroContas();
    atualizarResumo();
});

function aplicarFiltroContas(){
    const mesSelecionado = filtroMesContas.value; // YYYY-MM
    Array.from(listaContas.children).forEach(li => {
        if(!mesSelecionado || li.dataset.vencimento.startsWith(mesSelecionado)){
            li.style.display = 'flex';
        } else {
            li.style.display = 'none';
        }
    });
}

// Resumo financeiro
function atualizarResumo(){
    let total=0, pago=0, pendente=0;
    Array.from(listaContas.children).forEach(li=>{
        if(li.style.display === 'none') return;
        const valor = parseFloat(li.dataset.valor);
        const status = li.dataset.status;
        total += valor;
        if(status === 'paga') pago += valor;
        else pendente += valor;
    });
    totalGasto.textContent = total.toFixed(2);
    totalPago.textContent = pago.toFixed(2);
    totalPendente.textContent = pendente.toFixed(2);
}

// ===================== LOCALSTORAGE =====================
function salvarNoStorage(){
    const lembretesArray = Array.from(listaLembretes.children).map(li => ({
        texto: li.textContent,
        data: li.dataset.data
    }));
    const contasArray = Array.from(listaContas.children).map(li => ({
        texto: li.textContent,
        valor: li.dataset.valor,
        status: li.dataset.status,
        vencimento: li.dataset.vencimento
    }));
    localStorage.setItem('lembretes', JSON.stringify(lembretesArray));
    localStorage.setItem('contas', JSON.stringify(contasArray));
}

function carregarDoStorage(){
    const lembretesSalvos = JSON.parse(localStorage.getItem('lembretes') || '[]');
    lembretesSalvos.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.texto;
        li.dataset.data = item.data;
        li.classList.add('slide-in');
        listaLembretes.appendChild(li);
    });
    const contasSalvas = JSON.parse(localStorage.getItem('contas') || '[]');
    contasSalvas.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.texto;
        li.dataset.valor = item.valor;
        li.dataset.status = item.status;
        li.dataset.vencimento = item.vencimento;
        li.classList.add('slide-in');
        listaContas.appendChild(li);
    });
    atualizarResumo();
    aplicarFiltroLembretes();
    aplicarFiltroContas();
}

window.addEventListener('load', carregarDoStorage);

// ===================== NOTIFICAÇÕES =====================
function enviarNotificacao(titulo, mensagem){
    if(Notification.permission === 'granted'){
        new Notification(titulo, { body: mensagem });
    } else {
        Notification.requestPermission();
    }
}
