// Elementos
const telaInicial = document.getElementById('tela-inicial');
const telaLembretes = document.getElementById('tela-lembretes');
const telaContas = document.getElementById('tela-contas');

// Abrir telas
document.getElementById('opcao-lembretes').addEventListener('click', () => {
    telaInicial.style.display = 'none';
    telaLembretes.style.display = 'block';
});

document.getElementById('opcao-contas').addEventListener('click', () => {
    telaInicial.style.display = 'none';
    telaContas.style.display = 'block';
});

// Botões voltar
document.getElementById('voltar-inicial-lembretes').addEventListener('click', () => {
    telaLembretes.style.display = 'none';
    telaInicial.style.display = 'flex';
});
document.getElementById('voltar-inicial-contas').addEventListener('click', () => {
    telaContas.style.display = 'none';
    telaInicial.style.display = 'flex';
});

// Lembretes
const listaLembretes = document.getElementById('lista-lembretes');
const formLembrete = document.getElementById('form-lembrete');
document.getElementById('btn-adicionar-lembrete').addEventListener('click', () => formLembrete.style.display='block');
document.getElementById('cancelar-lembrete').addEventListener('click', () => formLembrete.style.display='none');

document.getElementById('salvar-lembrete').addEventListener('click', () => {
    const titulo = document.getElementById('titulo-lembrete').value.trim();
    const desc = document.getElementById('descricao-lembrete').value.trim();
    const data = document.getElementById('data-lembrete').value;
    if(titulo && desc && data){
        const li = document.createElement('li');
        li.innerHTML = `${titulo} - ${desc} - ${data} <span class="status-btn">❌ Não realizado</span>`;
        listaLembretes.appendChild(li);

        // Toggle status
        li.querySelector('.status-btn').addEventListener('click', function(){
            if(this.textContent.includes('❌')){
                this.textContent = '✅ Realizado';
            } else {
                this.textContent = '❌ Não realizado';
            }
            salvarNoStorage();
        });

        formLembrete.style.display='none';
        document.getElementById('titulo-lembrete').value='';
        document.getElementById('descricao-lembrete').value='';
        document.getElementById('data-lembrete').value='';
        salvarNoStorage();
    }
});

// Contas
const listaContas = document.getElementById('lista-contas');
const formConta = document.getElementById('form-conta');
const totalGasto = document.getElementById('total-gasto');
const totalPago = document.getElementById('total-pago');
const totalPendente = document.getElementById('total-pendente');

document.getElementById('btn-adicionar-conta').addEventListener('click', () => formConta.style.display='block');
document.getElementById('cancelar-conta').addEventListener('click', () => formConta.style.display='none');

document.getElementById('salvar-conta').addEventListener('click', () => {
    const nome = document.getElementById('nome-conta').value.trim();
    const valor = parseFloat(document.getElementById('valor-conta').value);
    const status = document.getElementById('status-conta').value;
    const vencimento = document.getElementById('vencimento-conta').value;
    if(nome && valor && vencimento){
        const li = document.createElement('li');
        li.innerHTML = `${nome} - R$${valor.toFixed(2)} - <span class="status-btn">${status==='paga'?'✅ Paga':'⏳ Não Paga'}</span> - ${vencimento}`;
        listaContas.appendChild(li);

        // Toggle status
        li.querySelector('.status-btn').addEventListener('click', function(){
            if(this.textContent.includes('⏳')){
                this.textContent = '✅ Paga';
            } else {
                this.textContent = '⏳ Não Paga';
            }
            atualizarResumo();
            salvarNoStorage();
        });

        formConta.style.display='none';
        document.getElementById('nome-conta').value='';
        document.getElementById('valor-conta').value='';
        document.getElementById('status-conta').value='nao-paga';
        document.getElementById('vencimento-conta').value='';
        atualizarResumo();
        salvarNoStorage();
    }
});

// Resumo
function atualizarResumo(){
    let total=0, pago=0, pendente=0;
    Array.from(listaContas.children).forEach(li=>{
        const partes = li.textContent.split(' - ');
        const valor = parseFloat(partes[1].replace('R$',''));
        total+=valor;
        if(partes[2].includes('✅')) pago+=valor;
        else pendente+=valor;
    });
    totalGasto.textContent = `R$${total.toFixed(2)}`;
    totalPago.textContent = `R$${pago.toFixed(2)}`;
    totalPendente.textContent = `R$${pendente.toFixed(2)}`;
}

// LocalStorage
function salvarNoStorage(){
    const lembretes = Array.from(listaLembretes.children).map(li=>li.innerHTML);
    const contas = Array.from(listaContas.children).map(li=>li.innerHTML);
    localStorage.setItem('lembretes', JSON.stringify(lembretes));
    localStorage.setItem('contas', JSON.stringify(contas));
}

function carregarDoStorage(){
    const lembretesSalvos = JSON.parse(localStorage.getItem('lembretes')||'[]');
    lembretesSalvos.forEach(html=>{
        const li = document.createElement('li'); li.innerHTML=html;
        listaLembretes.appendChild(li);
        li.querySelector('.status-btn').addEventListener('click', function(){
            if(this.textContent.includes('❌')){
                this.textContent='✅ Realizado';
            } else { this.textContent='❌ Não realizado'; }
            salvarNoStorage();
        });
    });
    const contasSalvas = JSON.parse(localStorage.getItem('contas')||'[]');
    contasSalvas.forEach(html=>{
        const li=document.createElement('li'); li.innerHTML=html;
        listaContas.appendChild(li);
        li.querySelector('.status-btn').addEventListener('click', function(){
            if(this.textContent.includes('⏳')){
                this.textContent='✅ Paga';
            } else { this.textContent='⏳ Não Paga'; }
            atualizarResumo();
            salvarNoStorage();
        });
    });
    atualizarResumo();
}

window.addEventListener('load', carregarDoStorage);
