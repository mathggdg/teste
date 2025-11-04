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

document.getElementById('voltar-inicial-lembretes').addEventListener('click', () => abrirTela(telaInicial));
document.getElementById('voltar-inicial-contas').addEventListener('click', () => abrirTela(telaInicial));

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
    if(titulo && desc && data){
        let li = document.createElement('li');
        li.textContent = hora ? `${titulo} - ${desc} - ${data} ${hora}` : `${titulo} - ${desc} - ${data}`;
        li.classList.add('slide-in');
        li.dataset.realizado = 'nao';
        li.addEventListener('click', () => {
            li.dataset.realizado = li.dataset.realizado === 'nao' ? 'sim' : 'nao';
            li.style.textDecoration = li.dataset.realizado === 'sim' ? 'line-through' : 'none';
        });
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
        let li = document.createElement('li');
        li.textContent = `${nome} - ${valor.toFixed(2)} - ${status} - ${vencimento}`;
        li.dataset.status = status;
        li.classList.add('slide-in');
        li.addEventListener('click', () => {
            li.dataset.status = li.dataset.status === 'paga' ? 'nao-paga' : 'paga';
            li.textContent = `${nome} - ${valor.toFixed(2)} - ${li.dataset.status} - ${vencimento}`;
            atualizarResumo();
            salvarNoStorage();
        });
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

// Resumo
function atualizarResumo(){
    let total=0, pago=0, pendente=0;
    Array.from(listaContas.children).forEach(li=>{
        const partes = li.textContent.split(' - ');
        const valor = parseFloat(partes[1]);
        total += valor;
        if(li.dataset.status === 'paga') pago += valor;
        else pendente += valor;
    });
    totalGasto.textContent = total.toFixed(2);
    totalPago.textContent = pago.toFixed(2);
    totalPendente.textContent = pendente.toFixed(2);
}

// Storage
function salvarNoStorage(){
    const lembretes = Array.from(listaLembretes.children).map(li=>({
        texto: li.textContent,
        realizado: li.dataset.realizado
    }));
    const contas = Array.from(listaContas.children).map(li=>({
        texto: li.textContent,
        status: li.dataset.status
    }));
    localStorage.setItem('lembretes', JSON.stringify(lembretes));
    localStorage.setItem('contas', JSON.stringify(contas));
}

function carregarDoStorage(){
    const lembretesSalvos = JSON.parse(localStorage.getItem('lembretes') || '[]');
    lembretesSalvos.forEach(obj=>{
        const li = document.createElement('li');
        li.textContent = obj.texto;
        li.dataset.realizado = obj.realizado || 'nao';
        if(li.dataset.realizado === 'sim') li.style.textDecoration = 'line-through';
        li.addEventListener('click', () => {
            li.dataset.realizado = li.dataset.realizado === 'nao' ? 'sim' : 'nao';
            li.style.textDecoration = li.dataset.realizado === 'sim' ? 'line-through' : 'none';
        });
        listaLembretes.appendChild(li);
    });

    const contasSalvas = JSON.parse(localStorage.getItem('contas') || '[]');
    contasSalvas.forEach(obj=>{
        const li = document.createElement('li');
        li.textContent = obj.texto;
        li.dataset.status = obj.status || 'nao-paga';
        li.addEventListener('click', () => {
            const partes = li.textContent.split(' - ');
            li.dataset.status = li.dataset.status === 'paga' ? 'nao-paga' : 'paga';
            li.textContent = `${partes[0]} - ${parseFloat(partes[1]).toFixed(2)} - ${li.dataset.status} - ${partes[3]}`;
            atualizarResumo();
            salvarNoStorage();
        });
        listaContas.appendChild(li);
    });

    atualizarResumo();
}

window.addEventListener('load', carregarDoStorage);
git 