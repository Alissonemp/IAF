const pageNames = {
  overview: "Visão geral", explore: "Explore", documents: "Documentos", editor: "Editor de documentos",
  projects: "Projetos", assets: "Patrimônio", purchases: "Compras",
  maintenance: "Manutenção", users: "Usuários e acessos", audit: "Registros de auditoria"
};
const pageDescriptions = {
  explore: "Consulte os módulos, ferramentas e recursos disponibilizados no ambiente institucional.",
  documents: "Criação, edição, padronização e organização de documentos institucionais.",
  projects: "Cadastro e acompanhamento administrativo de projetos, responsáveis e prazos.",
  assets: "Inventário, localização, situação e responsabilidade por bens e equipamentos.",
  purchases: "Registro e acompanhamento de solicitações e processos de aquisição.",
  maintenance: "Controle administrativo de solicitações e histórico de manutenção.",
  audit: "Consulta demonstrativa a eventos de acesso e alterações do sistema."
};
const icons = {explore:"⌕",documents:"▤",editor:"✎",projects:"▣",assets:"◫",purchases:"▧",maintenance:"⚙",audit:"≡"};
const demoCredential = { password: "IAFdemo2026!" };
let currentUser = null;
let users = [
  {id:1,name:"Administrador do Sistema",username:"admin@iaf.local",unit:"Comando Geral",role:"Administrador",status:"Ativo"}
];

const $ = (selector) => document.querySelector(selector);
const initials = (name) => name.split(/\\s+/).slice(0,2).map(part=>part[0]).join("").toUpperCase();

$("#toggle-password").addEventListener("click", () => {
  const field = $("#login-password");
  field.type = field.type === "password" ? "text" : "password";
  $("#toggle-password").textContent = field.type === "password" ? "◉" : "◎";
  $("#toggle-password").setAttribute("aria-label", field.type === "password" ? "Mostrar senha" : "Ocultar senha");
});

$("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const password = $("#login-password").value;
  const feedback = $("#login-feedback");
  feedback.className = "login-feedback error";
  if (!password) {
    feedback.textContent = "Informe a senha de acesso.";
    return;
  }
  if (password === demoCredential.password) {
    currentUser = {name:"Administrador do Sistema", username:"admin@iaf.local", role:"Administrador"};
    feedback.textContent = "";
    $("#login-screen").classList.add("hidden");
    $("#app-shell").classList.remove("hidden");
    $("#sidebar-name").textContent = currentUser.name;
    $("#sidebar-avatar").textContent = initials(currentUser.name);
    $("#top-avatar").textContent = initials(currentUser.name);
    renderOverview();
  } else {
    feedback.textContent = "Senha incorreta. Verifique e tente novamente.";
    $("#login-password").focus();
    $("#login-password").select();
  }
});

$("#logout-button").addEventListener("click", () => {
  auditEvent("LOGOUT", "Encerrou a sessão");
  currentUser = null;
  $("#app-shell").classList.add("hidden");
  $("#login-screen").classList.remove("hidden");
  $("#login-password").value = "";
  $("#login-feedback").textContent = "";
  $("#login-password").focus();
});

function renderOverview() {
  $("#crumb-current").textContent = "Visão geral";
  $("#content-view").innerHTML = `
    <div class="welcome-row"><div><div class="eyebrow"><span class="eyebrow-line"></span> PAINEL INSTITUCIONAL</div><h1>Visão geral</h1><p class="lead">Bem-vindo, ${escapeHtml(currentUser.name)}. Esta é a área administrativa do ambiente.</p></div><div class="welcome-meta"><span class="meta-label">CLASSIFICAÇÃO</span><strong>USO INTERNO</strong></div></div>
    <div class="notice"><span class="notice-icon">i</span><div><strong>Ambiente demonstrativo</strong><p>Os dados são temporários e não representam autenticação ou armazenamento seguro de produção.</p></div></div>
    <div class="section-title"><div><span class="section-index">01</span><h2>Resumo administrativo</h2></div><span class="section-note">DADOS ILUSTRATIVOS</span></div>
    <div class="stats-grid"><article class="stat-card"><div class="stat-head"><span>DOCUMENTOS</span><span class="stat-icon">▤</span></div><div class="stat-value">024</div><div class="stat-foot">Registros demonstrativos</div></article><article class="stat-card"><div class="stat-head"><span>PROJETOS</span><span class="stat-icon">▣</span></div><div class="stat-value">006</div><div class="stat-foot">Em acompanhamento</div></article><article class="stat-card"><div class="stat-head"><span>PATRIMÔNIO</span><span class="stat-icon">◫</span></div><div class="stat-value">038</div><div class="stat-foot">Itens ilustrativos</div></article><article class="stat-card"><div class="stat-head"><span>USUÁRIOS</span><span class="stat-icon">♙</span></div><div class="stat-value">${String(users.length).padStart(3,"0")}</div><div class="stat-foot">Contas nesta sessão</div></article></div>
    <div class="dashboard-grid"><section class="panel activity-panel"><div class="panel-heading"><div><span class="section-index">02</span><h2>Atividade administrativa</h2></div><button class="text-button" data-view="audit">Ver registros →</button></div><div class="activity-list"><div class="activity-item"><div class="activity-marker blue-marker"></div><div class="activity-body"><strong>Sessão de demonstração iniciada</strong><span>Controle do sistema · Agora</span></div><span class="activity-type">ACESSO</span></div><div class="activity-item"><div class="activity-marker gray-marker"></div><div class="activity-body"><strong>Estrutura inicial do IAF carregada</strong><span>Sistema · Nesta sessão</span></div><span class="activity-type">SISTEMA</span></div></div></section><section class="panel quick-panel"><div class="panel-heading"><div><span class="section-index">03</span><h2>Acesso rápido</h2></div></div><div class="quick-links"><button data-view="users"><span class="quick-icon">♙</span><span><strong>Gerenciar usuários</strong><small>Contas, unidades e perfis</small></span><b>↗</b></button><button data-view="documents"><span class="quick-icon">▤</span><span><strong>Novo documento</strong><small>Abrir editor institucional</small></span><b>↗</b></button><button data-view="explore"><span class="quick-icon">⌕</span><span><strong>Explorar recursos</strong><small>Conhecer os módulos</small></span><b>↗</b></button></div></section></div>
    <div class="bottom-strip"><div><span class="strip-mark">IAF</span><span><strong>PLATAFORMA INSTITUCIONAL</strong><small>Gestão administrativa interna</small></span></div><span class="strip-right">ACESSO AUTORIZADO · AMBIENTE DE TESTE</span></div><footer>IAF — SISTEMA INSTITUCIONAL <span>•</span> PROTÓTIPO <span>•</span> V0.2.0</footer>`;
  bindViewButtons();
}

function renderUsers() {
  $("#crumb-current").textContent = pageNames.users;
  $("#content-view").innerHTML = `
    <div class="welcome-row"><div><div class="eyebrow"><span class="eyebrow-line"></span> CONTROLE DO SISTEMA</div><h1>Usuários e acessos</h1><p class="lead">Cadastro administrativo de contas, unidades e perfis de acesso.</p></div><div class="welcome-meta"><span class="meta-label">PERMISSÃO</span><strong>ADMINISTRADOR</strong></div></div>
    <div class="notice"><span class="notice-icon">i</span><div><strong>Cadastro demonstrativo</strong><p>Os usuários adicionados aqui existem somente na memória desta sessão. Convites, senhas e permissões reais serão implementados no servidor.</p></div></div>
    <div class="user-admin-grid">
      <section class="panel user-form-panel"><div class="panel-heading"><div><span class="section-index">01</span><h2>Novo usuário</h2></div><span class="section-note">CADASTRO</span></div>
        <form id="user-form" class="user-form" novalidate>
          <div class="field"><label for="new-name">Nome completo</label><input id="new-name" maxlength="100" placeholder="Nome e sobrenome" required></div>
          <div class="field"><label for="new-username">Usuário / e-mail institucional</label><input id="new-username" type="email" maxlength="120" placeholder="usuario@instituicao.local" required></div>
          <div class="field"><label for="new-unit">Vínculo organizacional</label><select id="new-unit" required><option value="">Selecione uma unidade</option><option>Comando Geral</option><option>Comando Administrativo</option><option>Unidade de Projetos</option><option>Unidade de Patrimônio</option><option>Unidade de Documentação</option><option>Outra unidade</option></select></div>
          <div class="field"><label for="new-role">Perfil de acesso</label><select id="new-role" required><option value="">Selecione um perfil</option><option>Administrador</option><option>Gestor</option><option>Operador</option><option>Consulta</option></select></div>
          <div class="field field-full"><label for="new-notes">Observação (opcional)</label><input id="new-notes" maxlength="160" placeholder="Informação administrativa não sensível"></div>
          <p class="form-feedback field-full" id="user-feedback" role="alert"></p>
          <div class="form-actions field-full"><button type="reset" class="secondary-button">LIMPAR</button><button type="submit" class="primary-button">ADICIONAR USUÁRIO <span>→</span></button></div>
        </form>
      </section>
      <section class="panel user-list-panel"><div class="panel-heading"><div><span class="section-index">02</span><h2>Contas cadastradas</h2></div><span class="user-total" id="user-total">${users.length} CONTA(S)</span></div>
        <div class="user-search"><input id="user-search" placeholder="Pesquisar por nome ou usuário..." aria-label="Pesquisar usuários"></div>
        <div class="user-table-wrap"><table class="user-table"><thead><tr><th>USUÁRIO</th><th>UNIDADE / PERFIL</th><th>STATUS</th><th></th></tr></thead><tbody id="user-table-body">${renderUserRows()}</tbody></table></div>
        <div class="table-foot">LISTA TEMPORÁRIA · NÃO SINCRONIZADA</div>
      </section>
    </div>
    <div class="permission-note"><strong>Princípio de acesso mínimo</strong><p>O perfil define o que a conta poderá consultar ou alterar. Na versão conectada, cada módulo terá permissões específicas, e nenhuma conta receberá privilégios administrativos por padrão.</p></div>
    <footer>IAF — CONTROLE DE USUÁRIOS <span>•</span> PROTÓTIPO <span>•</span> V0.2.0</footer>`;
  $("#user-form").addEventListener("submit", addUser);
  $("#user-form").addEventListener("reset", () => { $("#user-feedback").textContent = ""; });
  $("#user-search").addEventListener("input", (event) => {
    $("#user-table-body").innerHTML = renderUserRows(event.target.value);
  });
  $("#user-table-body").addEventListener("click", (event) => {
    const action = event.target.closest("[data-user-id]");
    if (!action) return;
    const target = users.find(user => user.id === Number(action.dataset.userId));
    if (!target || target.id === 1) return;
    target.status = target.status === "Ativo" ? "Inativo" : "Ativo";
    auditEvent("ALTERACAO_STATUS_USUARIO", `${target.name}: status alterado para ${target.status}`);
    $("#user-table-body").innerHTML = renderUserRows($("#user-search").value);
  });
}

function renderUserRows(filter = "") {
  const q = filter.trim().toLowerCase();
  const filtered = users.filter(user => `${user.name} ${user.username} ${user.unit} ${user.role}`.toLowerCase().includes(q));
  if (!filtered.length) return `<tr><td colspan="4" class="no-users">Nenhum usuário encontrado.</td></tr>`;
  return filtered.map(user => `<tr><td><div class="table-user"><span class="mini-avatar">${initials(user.name)}</span><span><strong>${escapeHtml(user.name)}</strong><small>${escapeHtml(user.username)}</small></span></div></td><td><strong>${escapeHtml(user.unit)}</strong><small class="table-role">${escapeHtml(user.role)}</small></td><td><span class="status-pill ${user.status === "Ativo" ? "status-active" : "status-pending"}">${user.status}</span></td><td><button class="row-action" data-user-id="${user.id}" title="${user.status === "Ativo" ? "Desativar" : "Ativar"}" aria-label="${user.status === "Ativo" ? "Desativar" : "Ativar"} ${escapeHtml(user.name)}">${user.status === "Ativo" ? "Ⅱ" : "▶"}</button></td></tr>`).join("");
}

function addUser(event) {
  event.preventDefault();
  const name = $("#new-name").value.trim();
  const username = $("#new-username").value.trim().toLowerCase();
  const unit = $("#new-unit").value;
  const role = $("#new-role").value;
  const feedback = $("#user-feedback");
  feedback.className = "form-feedback error";
  if (name.length < 3) { feedback.textContent = "Informe o nome completo (mínimo de 3 caracteres)."; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) { feedback.textContent = "Informe um e-mail válido."; return; }
  if (!unit || !role) { feedback.textContent = "Selecione o vínculo organizacional e o perfil de acesso."; return; }
  if (users.some(user => user.username === username)) { feedback.textContent = "Já existe uma conta com esse usuário/e-mail."; return; }
  users.push({id:Date.now(),name,username,unit,role,status:"Pendente"});
  auditEvent("CRIACAO_USUARIO", `Cadastrou o usuário ${name} (${username}) com perfil ${role}`);
  $("#user-table-body").innerHTML = renderUserRows($("#user-search").value);
  $("#user-total").textContent = `${users.length} CONTA(S)`;
  $("#user-count-card") && ($("#user-count-card").textContent = String(users.length).padStart(3,"0"));
  feedback.className = "form-feedback success";
  feedback.textContent = "Usuário adicionado à lista temporária. A ativação real será feita por convite do servidor.";
  $("#user-form").reset();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

function showView(view) {
  document.querySelectorAll(".nav-link").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  if (view === "overview") return renderOverview();
  if (view === "users") return renderUsers();
  $("#crumb-current").textContent = pageNames[view] || "Módulo";
  $("#content-view").innerHTML = `<div class="welcome-row"><div><div class="eyebrow"><span class="eyebrow-line"></span> AMBIENTE INSTITUCIONAL</div><h1>${pageNames[view] || "Módulo"}</h1><p class="lead">${pageDescriptions[view] || "Área administrativa do sistema."}</p></div><div class="welcome-meta"><span class="meta-label">CLASSIFICAÇÃO</span><strong>USO INTERNO</strong></div></div><div class="empty-view"><div><div class="empty-symbol">${icons[view] || "◇"}</div><h2>Módulo em desenvolvimento</h2><p>Esta área está prevista na estrutura do IAF. As funções, regras de acesso e armazenamento serão implementadas em etapas próprias.</p><div class="coming">ESTRUTURA INICIAL · AGUARDANDO IMPLEMENTAÇÃO</div></div></div><footer>IAF — SISTEMA INSTITUCIONAL <span>•</span> PROTÓTIPO <span>•</span> V0.2.0</footer>`;
  bindViewButtons();
}
function bindViewButtons() {
  document.querySelectorAll("[data-view]").forEach(el => el.addEventListener("click", () => showView(el.dataset.view)));
}
bindViewButtons();
$("#today-label").textContent = new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",year:"numeric"}).format(new Date()).toUpperCase();

/* IAF v0.3.0 — auditoria local e gerenciador de documentos */
const AUDIT_KEY = 'iaf_audit_v030';
const DOCS_KEY = 'iaf_docs_v030';
const DB_NAME = 'IAFDocumentStore';
let currentFolderId = 'root';
let auditFilters = {query:'', type:'', from:'', to:''};

function createId() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `iaf-${Date.now()}-${Math.random().toString(36).slice(2)}`; }
function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
}
function getAudit() { return readJSON(AUDIT_KEY, []); }
function saveAudit(items) { localStorage.setItem(AUDIT_KEY, JSON.stringify(items.slice(-10000))); }
function auditEvent(action, details = '', result = 'Sucesso') {
  const item = {id: createId(), at:new Date().toISOString(), user:currentUser?.name || 'Não autenticado', username:currentUser?.username || '—', action, details:String(details), result, page:pageNames[document.querySelector('.nav-link.active')?.dataset.view] || 'Autenticação'};
  const entries = getAudit(); entries.push(item); saveAudit(entries);
}
function openDatabase() {
  return new Promise((resolve,reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => { const db=request.result; if(!db.objectStoreNames.contains('files')) db.createObjectStore('files',{keyPath:'id'}); };
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
}
async function storeFile(fileRecord) {
  const db=await openDatabase(); return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(fileRecord);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});
}
async function getStoredFile(id) {
  const db=await openDatabase(); return new Promise((resolve,reject)=>{const tx=db.transaction('files','readonly');const req=tx.objectStore('files').get(id);req.onsuccess=()=>{db.close();resolve(req.result);};req.onerror=()=>{db.close();reject(req.error);};});
}
async function deleteStoredFile(id) {
  const db=await openDatabase(); return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').delete(id);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});
}
function getDocs() { return readJSON(DOCS_KEY, [{id:'folder-institucional',name:'Documentos Institucionais',type:'folder',parentId:'root',createdAt:new Date().toISOString()}]); }
function saveDocs(items) { localStorage.setItem(DOCS_KEY,JSON.stringify(items)); }
function formatBytes(bytes) { if(bytes<1024)return `${bytes} B`; if(bytes<1048576)return `${(bytes/1024).toFixed(1)} KB`; return `${(bytes/1048576).toFixed(1)} MB`; }
function iconForFile(name) { const ext=(name.split('.').pop()||'').toLowerCase(); return ({pdf:'▤',doc:'W',docx:'W',xls:'X',xlsx:'X',ppt:'P',pptx:'P',png:'▧',jpg:'▧',jpeg:'▧',txt:'≡',zip:'▣'})[ext]||'▧'; }
function renderDocuments() {
  const docs=getDocs(); const current=docs.find(x=>x.id===currentFolderId && x.type==='folder'); if(!current) currentFolderId='root';
  const folder=docs.find(x=>x.id===currentFolderId); const children=docs.filter(x=>x.parentId===currentFolderId).sort((a,b)=>a.type===b.type?a.name.localeCompare(b.name):a.type==='folder'?-1:1);
  const crumbs=[]; let node=folder; while(node){crumbs.unshift(node);node=docs.find(x=>x.id===node.parentId);}
  $('#crumb-current').textContent='Documentos';
  $('#content-view').innerHTML=`<div class="welcome-row"><div><div class="eyebrow"><span class="eyebrow-line"></span> ARQUIVOS INSTITUCIONAIS</div><h1>Documentos</h1><p class="lead">Organize, armazene, consulte e compartilhe os documentos do ambiente.</p></div><div class="welcome-meta"><span class="meta-label">ARMAZENAMENTO</span><strong>LOCAL DO NAVEGADOR</strong></div></div>
  <div class="notice"><span class="notice-icon">i</span><div><strong>Armazenamento desta demonstração</strong><p>Os arquivos ficam neste navegador e dispositivo (IndexedDB). Para uso multiusuário, sincronização e segurança institucional, será necessário conectar armazenamento no servidor.</p></div></div>
  <section class="panel doc-manager"><div class="doc-toolbar"><div class="doc-crumbs"><button class="crumb-button" data-folder="root">Início</button>${crumbs.map(c=>`<span> / </span><button class="crumb-button" data-folder="${c.id}">${escapeHtml(c.name)}</button>`).join('')}</div><div class="doc-actions"><button class="secondary-button" id="new-folder-btn">＋ NOVA PASTA</button><label class="primary-button upload-label" for="doc-upload">↑ ENVIAR ARQUIVOS</label><input id="doc-upload" type="file" multiple hidden></div></div>
  <div class="doc-summary"><span>${children.length} item(ns) nesta pasta</span><input id="doc-search" placeholder="Pesquisar nesta pasta..." aria-label="Pesquisar documentos"></div>
  <div class="doc-list-wrap"><table class="doc-table"><thead><tr><th>NOME</th><th>TIPO</th><th>TAMANHO</th><th>MODIFICADO EM</th><th>AÇÕES</th></tr></thead><tbody id="doc-rows">${children.length?children.map(docRow).join(''):'<tr><td colspan="5" class="no-users">Esta pasta está vazia. Crie uma pasta ou envie arquivos.</td></tr>'}</tbody></table></div>
  <div class="doc-foot">DICA: abra uma pasta clicando no nome. Use as ações para abrir, baixar, renomear ou excluir.</div></section><footer>IAF — GERENCIADOR DE DOCUMENTOS <span>•</span> V0.3.0</footer>`;
  $('#new-folder-btn').addEventListener('click', createFolder);
  $('#doc-upload').addEventListener('change', uploadFiles);
  $('#doc-search').addEventListener('input',e=>{const q=e.target.value.toLowerCase();const rows=docs.filter(x=>x.parentId===currentFolderId&&x.name.toLowerCase().includes(q));$('#doc-rows').innerHTML=rows.length?rows.map(docRow).join(''):'<tr><td colspan="5" class="no-users">Nenhum item encontrado.</td></tr>';});
  $('#doc-rows').addEventListener('click',handleDocAction);
  document.querySelectorAll('[data-folder]').forEach(btn=>btn.addEventListener('click',()=>{currentFolderId=btn.dataset.folder;auditEvent('NAVEGACAO_PASTA',`Acessou a pasta ${folderPath(currentFolderId)}`);renderDocuments();}));
  auditEvent('ACESSO_MODULO','Acessou o gerenciador de documentos');
}
function docRow(item) { const isFolder=item.type==='folder'; return `<tr><td><div class="doc-name"><span class="doc-file-icon ${isFolder?'folder-icon':''}">${isFolder?'▰':iconForFile(item.name)}</span><button class="doc-name-button" data-action="${isFolder?'folder':'open'}" data-id="${item.id}">${escapeHtml(item.name)}</button></div></td><td>${isFolder?'PASTA':escapeHtml((item.name.split('.').pop()||'ARQUIVO').toUpperCase())}</td><td>${isFolder?'—':formatBytes(item.size||0)}</td><td>${new Date(item.updatedAt||item.createdAt).toLocaleString('pt-BR')}</td><td><div class="doc-row-actions">${isFolder?'':`<button data-action="download" data-id="${item.id}" title="Baixar">↓</button>`}<button data-action="move" data-id="${item.id}" title="Mover">↗</button><button data-action="rename" data-id="${item.id}" title="Renomear">✎</button><button data-action="delete" data-id="${item.id}" title="Excluir">×</button></div></td></tr>`; }
function folderPath(id) { const docs=getDocs();const names=[];let n=docs.find(x=>x.id===id);while(n){names.unshift(n.name);n=docs.find(x=>x.id===n.parentId);}return names.join('/')||'Início'; }
function createFolder() { const name=prompt('Nome da nova pasta:');if(!name||!name.trim())return;const docs=getDocs();if(docs.some(x=>x.parentId===currentFolderId&&x.name.toLowerCase()===name.trim().toLowerCase())){alert('Já existe um item com esse nome nesta pasta.');return;}docs.push({id:createId(),name:name.trim(),type:'folder',parentId:currentFolderId,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});saveDocs(docs);auditEvent('CRIACAO_PASTA',`Criou a pasta ${folderPath(currentFolderId)}/${name.trim()}`);renderDocuments(); }
async function uploadFiles(event) { const files=[...event.target.files];for(const file of files){const id=createId();try{await storeFile({id,name:file.name,type:file.type,size:file.size,blob:file});const docs=getDocs();docs.push({id,name:file.name,type:'file',mime:file.type,size:file.size,parentId:currentFolderId,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});saveDocs(docs);auditEvent('UPLOAD',`Enviou ${file.name} (${formatBytes(file.size)}) para ${folderPath(currentFolderId)}`);}catch(err){auditEvent('UPLOAD_FALHA',`Falha ao enviar ${file.name}: ${err.message}`,'Falha');alert(`Não foi possível armazenar ${file.name}. Verifique o espaço disponível.`);}}event.target.value='';renderDocuments(); }
async function handleDocAction(event) { const btn=event.target.closest('[data-action]');if(!btn)return;const id=btn.dataset.id;const action=btn.dataset.action;const item=getDocs().find(x=>x.id===id);if(!item)return;
 if(action==='folder'){currentFolderId=id;auditEvent('ACESSO_PASTA',`Abriu a pasta ${folderPath(id)}`);renderDocuments();return;}
 if(action==='open'){const file=await getStoredFile(id);if(!file){alert('Arquivo não encontrado no armazenamento local.');auditEvent('ABERTURA_FALHA',`Não foi possível abrir ${item.name}`,'Falha');return;}const url=URL.createObjectURL(file.blob);window.open(url,'_blank','noopener');setTimeout(()=>URL.revokeObjectURL(url),60000);auditEvent('ABERTURA_ARQUIVO',`Abriu o arquivo ${item.name}`);return;}
 if(action==='download'){const file=await getStoredFile(id);if(!file){alert('Arquivo não encontrado.');return;}const url=URL.createObjectURL(file.blob);const a=document.createElement('a');a.href=url;a.download=item.name;a.click();URL.revokeObjectURL(url);auditEvent('DOWNLOAD',`Baixou o arquivo ${item.name}`);return;}
 if(action==='move'){const docs=getDocs();const folders=docs.filter(x=>x.type==='folder'&&x.id!==id);const options=folders.map(f=>`${f.name} [${f.id}]`).join('\n');const destination=prompt(`Digite o nome exato da pasta de destino:\n${options}\n(ou deixe vazio para cancelar)`);if(!destination)return;const target=folders.find(f=>f.name.toLowerCase()===destination.trim().toLowerCase());if(!target){alert('Pasta de destino não encontrada.');return;}let parent=target;while(parent){if(parent.id===id){alert('Não é possível mover uma pasta para dentro dela mesma.');return;}parent=docs.find(x=>x.id===parent.parentId);}const oldPath=folderPath(item.parentId);item.parentId=target.id;item.updatedAt=new Date().toISOString();saveDocs(docs);auditEvent('MOVIMENTACAO',`Moveu ${item.name} de ${oldPath} para ${folderPath(target.id)}`);renderDocuments();return;}
 if(action==='rename'){const name=prompt('Novo nome:',item.name);if(!name||!name.trim()||name.trim()===item.name)return;const docs=getDocs();const old=item.name;item.name=name.trim();item.updatedAt=new Date().toISOString();saveDocs(docs);if(item.type==='file'){const file=await getStoredFile(id);if(file){file.name=item.name;await storeFile(file);}}auditEvent('RENOMEACAO',`Renomeou ${old} para ${item.name}`);renderDocuments();return;}
 if(action==='delete'){if(!confirm(`Excluir ${item.type==='folder'?'a pasta e todo seu conteúdo':'o arquivo'} "${item.name}"? Esta ação não poderá ser desfeita.`))return;await deleteDocTree(id);auditEvent('EXCLUSAO',`Excluiu ${item.type==='folder'?'a pasta':'o arquivo'} ${item.name}`);renderDocuments();}
}
async function deleteDocTree(id) { const docs=getDocs();const item=docs.find(x=>x.id===id);if(!item)return;for(const child of docs.filter(x=>x.parentId===id))await deleteDocTree(child.id);if(item.type==='file')await deleteStoredFile(id);saveDocs(getDocs().filter(x=>x.id!==id)); }
function renderAudit() { const all=getAudit().slice().reverse();const q=auditFilters.query.toLowerCase();const filtered=all.filter(x=>(!q||`${x.user} ${x.username} ${x.action} ${x.details}`.toLowerCase().includes(q))&&(!auditFilters.type||x.action===auditFilters.type)&&(!auditFilters.from||x.at.slice(0,10)>=auditFilters.from)&&(!auditFilters.to||x.at.slice(0,10)<=auditFilters.to));$('#crumb-current').textContent='Registros de auditoria';$('#content-view').innerHTML=`<div class="welcome-row"><div><div class="eyebrow"><span class="eyebrow-line"></span> CONTROLE E RASTREABILIDADE</div><h1>Registros de auditoria</h1><p class="lead">Histórico cronológico de acessos e operações realizados no sistema.</p></div><div class="welcome-meta"><span class="meta-label">EVENTOS REGISTRADOS</span><strong>${all.length}</strong></div></div><div class="notice"><span class="notice-icon">i</span><div><strong>Auditoria demonstrativa local</strong><p>Os eventos são persistidos neste navegador. Em produção, os registros precisam ser gravados no servidor com proteção contra alteração e exclusão.</p></div></div><section class="panel audit-panel"><div class="audit-filters"><input id="audit-query" placeholder="Pesquisar usuário, ação ou documento..." value="${escapeHtml(auditFilters.query)}"><select id="audit-type"><option value="">Todas as atividades</option>${[...new Set(all.map(x=>x.action))].sort().map(t=>`<option ${auditFilters.type===t?'selected':''}>${escapeHtml(t)}</option>`).join('')}</select><input id="audit-from" type="date" value="${auditFilters.from}" aria-label="Data inicial"><input id="audit-to" type="date" value="${auditFilters.to}" aria-label="Data final"><button class="secondary-button" id="audit-clear">LIMPAR</button><button class="primary-button" id="audit-export">EXPORTAR CSV ↓</button></div><div class="doc-list-wrap"><table class="doc-table"><thead><tr><th>DATA / HORA</th><th>USUÁRIO</th><th>ATIVIDADE</th><th>DETALHES</th><th>RESULTADO</th></tr></thead><tbody>${filtered.length?filtered.map(x=>`<tr><td>${new Date(x.at).toLocaleString('pt-BR')}</td><td><strong>${escapeHtml(x.user)}</strong><small class="table-role">${escapeHtml(x.username)}</small></td><td><span class="audit-action">${escapeHtml(x.action)}</span></td><td>${escapeHtml(x.details)}</td><td><span class="status-pill ${x.result==='Sucesso'?'status-active':'status-pending'}">${escapeHtml(x.result)}</span></td></tr>`).join(''):'<tr><td colspan="5" class="no-users">Nenhum evento encontrado.</td></tr>'}</tbody></table></div><div class="doc-foot">Exibindo ${filtered.length} de ${all.length} eventos. O histórico local mantém até 10.000 registros.</div></section><footer>IAF — AUDITORIA DO SISTEMA <span>•</span> V0.3.0</footer>`;
 $('#audit-query').addEventListener('change',e=>{auditFilters.query=e.target.value;renderAudit();});$('#audit-type').addEventListener('change',e=>{auditFilters.type=e.target.value;renderAudit();});$('#audit-from').addEventListener('change',e=>{auditFilters.from=e.target.value;renderAudit();});$('#audit-to').addEventListener('change',e=>{auditFilters.to=e.target.value;renderAudit();});$('#audit-clear').addEventListener('click',()=>{auditFilters={query:'',type:'',from:'',to:''};renderAudit();});$('#audit-export').addEventListener('click',exportAudit); }
function exportAudit(){const rows=[['Data/hora','Usuário','Login','Atividade','Detalhes','Resultado','Tela'],...getAudit().map(x=>[x.at,x.user,x.username,x.action,x.details,x.result,x.page])];const csv='\uFEFF'+rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(';')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`iaf-auditoria-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);auditEvent('EXPORTACAO_AUDITORIA','Exportou o histórico de auditoria em CSV');}

// Instrumenta ações já existentes sem alterar a aparência nem o fluxo do protótipo.
const originalShowView = showView;
showView = function(view) { auditEvent('ACESSO_MODULO',`Acessou o módulo ${pageNames[view]||view}`); if(view==='documents')return renderDocuments(); if(view==='audit')return renderAudit(); return originalShowView(view); };
const loginForm = $('#login-form');
loginForm.addEventListener('submit',()=>{const pass=$('#login-password').value;setTimeout(()=>{if(currentUser)auditEvent('LOGIN','Autenticou-se no sistema');else auditEvent('TENTATIVA_LOGIN','Tentativa de autenticação com senha inválida','Falha');},0);});


/* IAF v0.4.0 — busca global de conteúdo e editor institucional */
const SEARCH_CACHE_KEY = 'iaf_search_index_v040';
const TEMPLATE_KEY = 'iaf_document_templates_v040';
let editorDocumentId = null;
let editorDirty = false;
let searchBusy = false;
const searchTextCache = readJSON(SEARCH_CACHE_KEY, {});

function saveSearchCache(){ try{localStorage.setItem(SEARCH_CACHE_KEY,JSON.stringify(searchTextCache));}catch(e){} }
function loadExternalScript(src, test){return new Promise((resolve,reject)=>{if(test&&test()){resolve();return;}const old=document.querySelector(`script[src="${src}"]`);if(old){old.addEventListener('load',resolve,{once:true});old.addEventListener('error',reject,{once:true});return;}const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.head.appendChild(script);});}
async function extractDocumentText(item, stored){
  if(searchTextCache[item.id]) return searchTextCache[item.id];
  const blob=stored?.blob;if(!blob)return '';
  const ext=(item.name.split('.').pop()||'').toLowerCase();let text='';
  try{
    if(['txt','csv','md','json','xml','html','htm','log'].includes(ext)) text=await blob.text();
    else if(ext==='pdf'){
      await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',()=>!!window.pdfjsLib);
      window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const pdf=await window.pdfjsLib.getDocument({data:await blob.arrayBuffer()}).promise;let pages=[];
      for(let n=1;n<=pdf.numPages;n++){const page=await pdf.getPage(n);const content=await page.getTextContent();pages.push(content.items.map(x=>x.str).join(' '));}
      text=pages.join('\n');
    } else if(ext==='docx'){
      await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js',()=>!!window.mammoth);
      const result=await window.mammoth.extractRawText({arrayBuffer:await blob.arrayBuffer()});text=result.value||'';
    } else if(['png','jpg','jpeg','webp','bmp'].includes(ext)){
      // OCR sob demanda: tenta reconhecer texto visível em imagens; nomes e metadados também entram no índice.
      await loadExternalScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',()=>!!window.Tesseract);
      const result=await window.Tesseract.recognize(blob,'por+eng');text=result.data?.text||'';
    }
  }catch(err){console.warn('Não foi possível indexar o conteúdo de',item.name,err);}
  searchTextCache[item.id]=String(text).slice(0,500000);saveSearchCache();return searchTextCache[item.id];
}
function highlightMatch(text,q){const safe=escapeHtml(text);if(!q)return safe;const i=safe.toLowerCase().indexOf(escapeHtml(q).toLowerCase());return i<0?safe:safe.slice(Math.max(0,i-75),i)+'<mark>'+safe.slice(i,i+q.length)+'</mark>'+safe.slice(i+q.length,Math.min(safe.length,i+q.length+125));}
async function runGlobalSearch(query){
  const q=query.trim().toLowerCase();if(!q)return [];
  const docs=getDocs();const matches=[];let checked=0;
  for(const item of docs){
    const path=folderPath(item.parentId);
    if(item.name.toLowerCase().includes(q))matches.push({item,kind:item.type==='folder'?'Pasta':'Nome do arquivo',snippet:path});
    if(item.type==='file'){
      const stored=await getStoredFile(item.id);const body=await extractDocumentText(item,stored);const idx=body.toLowerCase().indexOf(q);
      if(idx>=0){const start=Math.max(0,idx-100);matches.push({item,kind:'Conteúdo do documento',snippet:body.slice(start,Math.min(body.length,idx+q.length+180)).replace(/\s+/g,' '),offset:idx});}
    }
    checked++;const status=$('#explore-status');if(status)status.textContent=`Verificando conteúdo: ${checked} de ${docs.length} itens…`;
  }
  auditEvent('PESQUISA_GLOBAL',`Pesquisou por "${query}"; ${matches.length} resultado(s)`);
  return matches;
}
function renderExplore(){
  $('#crumb-current').textContent='Explore';
  $('#content-view').innerHTML=`<div class="welcome-row"><div><div class="eyebrow"><span class="eyebrow-line"></span> PESQUISA INSTITUCIONAL</div><h1>Explore</h1><p class="lead">Pesquise em todo o IAF: pastas, nomes de arquivos, imagens e textos dentro de documentos.</p></div><div class="welcome-meta"><span class="meta-label">ESCOPO</span><strong>TODO O SISTEMA</strong></div></div>
  <section class="panel explore-panel"><div class="global-search"><span>⌕</span><input id="global-search-input" type="search" placeholder="Pesquise por nome, assunto, palavra ou trecho de texto…" autocomplete="off"><button id="global-search-button" class="primary-button">PESQUISAR</button></div><div class="explore-capabilities"><span>✓ Pastas e subpastas</span><span>✓ PDF e DOCX</span><span>✓ TXT, CSV e HTML</span><span>✓ Imagens por nome e OCR</span></div><div class="explore-status" id="explore-status">A pesquisa percorre todos os documentos armazenados no navegador.</div><div id="global-search-results" class="global-search-results"><div class="search-empty"><strong>Encontre qualquer informação</strong><p>Digite um termo para localizar arquivos e também ocorrências dentro do conteúdo dos documentos.</p></div></div></section><footer>IAF — PESQUISA GLOBAL <span>•</span> V0.4.0</footer>`;
  const input=$('#global-search-input'),button=$('#global-search-button');
  const search=async()=>{const q=input.value.trim();if(!q||searchBusy)return;searchBusy=true;button.disabled=true;$('#explore-status').textContent='Preparando pesquisa…';$('#global-search-results').innerHTML='<div class="search-empty">Pesquisando em todos os arquivos…</div>';try{const results=await runGlobalSearch(q);$('#explore-status').textContent=`Pesquisa concluída · ${results.length} resultado(s) encontrado(s).`;$('#global-search-results').innerHTML=results.length?results.map((r,i)=>`<article class="search-result"><div class="search-result-icon">${r.item.type==='folder'?'▰':iconForFile(r.item.name)}</div><div class="search-result-body"><div class="search-result-top"><strong>${escapeHtml(r.item.name)}</strong><span>${escapeHtml(r.kind)}</span></div><p>${highlightMatch(r.snippet,q)}</p><small>${escapeHtml(folderPath(r.item.parentId))}</small></div><div class="search-result-actions">${r.item.type==='folder'?`<button data-search-open="${r.item.id}">ABRIR PASTA</button>`:`<button data-search-open="${r.item.id}">ABRIR</button>`}</div></article>`).join(''):'<div class="search-empty"><strong>Nenhum resultado encontrado</strong><p>Tente outra palavra ou confirme se o arquivo já foi enviado ao gerenciador de documentos.</p></div>';}catch(err){$('#explore-status').textContent='Não foi possível concluir a pesquisa.';$('#global-search-results').innerHTML='<div class="search-empty">Ocorreu um erro durante a pesquisa.</div>';}finally{searchBusy=false;button.disabled=false;}};
  button.addEventListener('click',search);input.addEventListener('keydown',e=>{if(e.key==='Enter')search();});
  $('#global-search-results').addEventListener('click',async e=>{const b=e.target.closest('[data-search-open]');if(!b)return;const item=getDocs().find(x=>x.id===b.dataset.searchOpen);if(!item)return;if(item.type==='folder'){currentFolderId=item.id;showView('documents');}else{await openDocumentFromSearch(item);}});
  auditEvent('ACESSO_MODULO','Acessou a pesquisa global Explore');
}
async function openDocumentFromSearch(item){const file=await getStoredFile(item.id);if(!file){alert('Arquivo não encontrado no armazenamento.');auditEvent('ABERTURA_FALHA',`Falha ao abrir ${item.name}`,'Falha');return;}const url=URL.createObjectURL(file.blob);const ext=(item.name.split('.').pop()||'').toLowerCase();if(['pdf','png','jpg','jpeg','webp','txt','html','htm'].includes(ext)){window.open(url,'_blank','noopener');setTimeout(()=>URL.revokeObjectURL(url),60000);}else{const a=document.createElement('a');a.href=url;a.download=item.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}auditEvent('ABERTURA_ARQUIVO',`Abriu ${item.name} a partir da pesquisa Explore`);}

function getTemplates(){return readJSON(TEMPLATE_KEY,[{id:'modelo-oficio',name:'Ofício institucional',html:'<h1 style="text-align:center">OFÍCIO Nº ____/2026</h1><p>À</p><p><strong>[DESTINATÁRIO]</strong></p><p><br></p><p><strong>Assunto:</strong> [Assunto do documento]</p><p><br></p><p>Senhor(a),</p><p>Apresentamos, por meio deste, [descreva o conteúdo].</p><p><br></p><p>Atenciosamente,</p><p><br><p>[NOME / CARGO]</p>'},{id:'modelo-memorando',name:'Memorando',html:'<h1 style="text-align:center">MEMORANDO</h1><p><strong>De:</strong> [Setor de origem]</p><p><strong>Para:</strong> [Destinatário]</p><p><strong>Data:</strong> [Data]</p><p><strong>Assunto:</strong> [Assunto]</p><hr><p>[Corpo do memorando]</p>'},{id:'modelo-relatorio',name:'Relatório',html:'<h1 style="text-align:center">RELATÓRIO</h1><h2>1. Objetivo</h2><p>[Descreva o objetivo]</p><h2>2. Desenvolvimento</h2><p>[Descreva as atividades]</p><h2>3. Conclusão</h2><p>[Apresente a conclusão]</p>'}]);}
function saveTemplates(items){localStorage.setItem(TEMPLATE_KEY,JSON.stringify(items));}
function editorToolbar(){return `<div class="editor-toolbar"><button data-cmd="bold" title="Negrito"><b>B</b></button><button data-cmd="italic" title="Itálico"><i>I</i></button><button data-cmd="underline" title="Sublinhado"><u>U</u></button><span></span><select id="editor-format"><option value="p">Texto normal</option><option value="h1">Título 1</option><option value="h2">Título 2</option><option value="h3">Título 3</option><option value="blockquote">Citação</option></select><select id="editor-font"><option value="Inter">Inter</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Times New Roman">Times New Roman</option></select><select id="editor-size"><option value="3">12 pt</option><option value="4">14 pt</option><option value="5">18 pt</option><option value="6">24 pt</option><option value="7">32 pt</option></select><span></span><button data-cmd="justifyLeft" title="Alinhar à esquerda">☰</button><button data-cmd="justifyCenter" title="Centralizar">≡</button><button data-cmd="justifyRight" title="Alinhar à direita">☷</button><button data-cmd="insertUnorderedList" title="Lista">• Lista</button><button data-cmd="insertOrderedList" title="Lista numerada">1. Lista</button><span></span><label class="editor-color-label">Cor <input type="color" id="editor-color" value="#24364b"></label><button data-cmd="createLink" title="Inserir link">↗ Link</button><button id="editor-image-button" title="Inserir imagem">▧ Imagem</button><input type="file" id="editor-image-input" accept="image/*" hidden><button data-cmd="insertHorizontalRule">Linha</button><button id="editor-table-button">Tabela</button></div>`;}
function renderEditor(){
  $('#crumb-current').textContent='Editor de documentos';const templates=getTemplates();
  $('#content-view').innerHTML=`<div class="welcome-row"><div><div class="eyebrow"><span class="eyebrow-line"></span> CRIAÇÃO E DIAGRAMAÇÃO</div><h1>Editor de documentos</h1><p class="lead">Crie documentos institucionais, use modelos prontos e personalize o layout em um espaço de edição visual.</p></div><div class="welcome-meta"><span class="meta-label">FERRAMENTA</span><strong>EDITOR + MODELOS</strong></div></div>
  <div class="editor-layout"><aside class="panel editor-side"><div class="editor-side-head"><strong>MODELOS</strong><button id="save-template-button" title="Salvar como modelo">＋</button></div><button class="template-item active" data-template="blank">Documento em branco</button>${templates.map(t=>`<button class="template-item" data-template="${t.id}">${escapeHtml(t.name)}</button>`).join('')}<div class="editor-side-note">Seus modelos ficam disponíveis para reutilização neste navegador.</div><hr><strong class="editor-side-label">CONFIGURAÇÃO DA PÁGINA</strong><label>Formato<select id="editor-page-size"><option value="A4">A4</option><option value="Letter">Carta</option></select></label><label>Orientação<select id="editor-orientation"><option value="portrait">Retrato</option><option value="landscape">Paisagem</option></select></label><label>Margens<select id="editor-margin"><option value="normal">Normal</option><option value="narrow">Estreita</option><option value="wide">Larga</option></select></label></aside>
  <section class="editor-workspace"><div class="editor-main-actions"><input id="editor-title" value="Documento sem título" aria-label="Nome do documento"><div><button class="secondary-button" id="editor-open">ABRIR</button><button class="secondary-button" id="editor-new">NOVO</button><button class="secondary-button" id="editor-print">EXPORTAR PDF</button><button class="secondary-button" id="editor-word">BAIXAR WORD</button><button class="primary-button" id="editor-save">SALVAR DOCUMENTO</button></div></div>${editorToolbar()}<div class="editor-canvas-wrap"><article id="document-canvas" class="document-canvas" contenteditable="true" spellcheck="true"><h1>Documento sem título</h1><p>Comece a escrever seu documento aqui…</p></article></div><div class="editor-status"><span id="editor-status-text">Pronto para editar</span><span>A edição é salva no gerenciador de documentos.</span></div></section></div><footer>IAF — EDITOR DE DOCUMENTOS <span>•</span> V0.4.0</footer>`;
  const canvas=$('#document-canvas');canvas.addEventListener('input',()=>{editorDirty=true;$('#editor-status-text').textContent='Alterações não salvas';});
  document.querySelectorAll('[data-template]').forEach(btn=>btn.addEventListener('click',()=>{const t=templates.find(x=>x.id===btn.dataset.template);document.querySelectorAll('[data-template]').forEach(x=>x.classList.toggle('active',x===btn));canvas.innerHTML=t?t.html:'<h1>Documento sem título</h1><p>Comece a escrever seu documento aqui…</p>';$('#editor-title').value=t?t.name:'Documento sem título';editorDocumentId=null;editorDirty=true;$('#editor-status-text').textContent='Modelo carregado · alterações não salvas';auditEvent('MODELO_DOCUMENTO','Carregou o modelo '+(t?.name||'em branco'));}));
  document.querySelectorAll('[data-cmd]').forEach(btn=>btn.addEventListener('click',()=>{canvas.focus();const cmd=btn.dataset.cmd;if(cmd==='createLink'){const url=prompt('Endereço do link:');if(url)document.execCommand(cmd,false,url);}else document.execCommand(cmd,false,null);editorDirty=true;}));
  $('#editor-format').addEventListener('change',e=>{canvas.focus();document.execCommand('formatBlock',false,e.target.value);});$('#editor-font').addEventListener('change',e=>{canvas.focus();document.execCommand('fontName',false,e.target.value);});$('#editor-size').addEventListener('change',e=>{canvas.focus();document.execCommand('fontSize',false,e.target.value);});$('#editor-color').addEventListener('input',e=>{canvas.focus();document.execCommand('foreColor',false,e.target.value);});
  $('#editor-image-button').addEventListener('click',()=>$('#editor-image-input').click());$('#editor-image-input').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;const data=await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.readAsDataURL(f);});canvas.focus();document.execCommand('insertImage',false,data);editorDirty=true;e.target.value='';});
  $('#editor-save').addEventListener('click',saveEditorDocument);$('#editor-table-button').addEventListener('click',()=>{const rows=Math.min(12,Math.max(1,Number(prompt('Quantidade de linhas:', '3'))||3));const cols=Math.min(8,Math.max(1,Number(prompt('Quantidade de colunas:', '3'))||3));let html='<table><tbody>';for(let r=0;r<rows;r++){html+='<tr>';for(let c=0;c<cols;c++)html+=`<td>${r===0?'Cabeçalho':'Texto'}</td>`;html+='</tr>';}html+='</tbody></table><p></p>';canvas.focus();document.execCommand('insertHTML',false,html);editorDirty=true;});$('#editor-open').addEventListener('click',openExistingDocumentInEditor);$('#editor-new').addEventListener('click',()=>{if(editorDirty&&!confirm('Descartar as alterações não salvas?'))return;editorDocumentId=null;$('#editor-title').value='Documento sem título';canvas.innerHTML='<h1>Documento sem título</h1><p>Comece a escrever seu documento aqui…</p>';editorDirty=false;$('#editor-status-text').textContent='Novo documento';});
  $('#editor-print').addEventListener('click',()=>{auditEvent('EXPORTACAO_PDF','Preparou impressão/PDF de '+$('#editor-title').value);printEditorDocument();});$('#editor-word').addEventListener('click',downloadWordDocument);$('#save-template-button').addEventListener('click',()=>{const name=prompt('Nome do modelo:');if(!name?.trim())return;const arr=getTemplates();arr.push({id:createId(),name:name.trim(),html:canvas.innerHTML});saveTemplates(arr);auditEvent('CRIACAO_MODELO',`Criou o modelo ${name.trim()}`);alert('Modelo salvo. Reabra o Editor de documentos para atualizar a lista.');});
  auditEvent('ACESSO_MODULO','Acessou o editor de documentos');
}
async function saveEditorDocument(){const title=$('#editor-title').value.trim()||'Documento sem título';const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:Arial,sans-serif;color:#222;line-height:1.55;margin:2cm}img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #aaa;padding:6px}</style></head><body>${$('#document-canvas').innerHTML}</body></html>`;const blob=new Blob([html],{type:'text/html;charset=utf-8'});let id=editorDocumentId;const docs=getDocs();if(id){const item=docs.find(x=>x.id===id);if(item){item.name=title.toLowerCase().endsWith('.html')?title:title+'.html';item.size=blob.size;item.updatedAt=new Date().toISOString();await storeFile({id,name:item.name,type:blob.type,size:blob.size,blob});saveDocs(docs);}}else{id=createId();const name=title.toLowerCase().endsWith('.html')?title:title+'.html';await storeFile({id,name,type:blob.type,size:blob.size,blob});docs.push({id,name,type:'file',mime:blob.type,size:blob.size,parentId:currentFolderId,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});saveDocs(docs);editorDocumentId=id;}delete searchTextCache[id];saveSearchCache();editorDirty=false;$('#editor-status-text').textContent='Documento salvo no gerenciador de documentos';auditEvent('SALVAR_DOCUMENTO',`Salvou ${title} em ${folderPath(currentFolderId)}`);}
function printEditorDocument(){const title=$('#editor-title').value||'Documento';const w=window.open('','_blank');if(!w){alert('Permita pop-ups para exportar o PDF.');return;}const size=$('#editor-page-size').value,orientation=$('#editor-orientation').value,margin=$('#editor-margin').value;const margins={normal:'20mm',narrow:'10mm',wide:'30mm'};w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>@page{size:${size} ${orientation};margin:${margins[margin]}}body{font-family:Arial,sans-serif;color:#222;line-height:1.5}img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #aaa;padding:6px}</style></head><body>${$('#document-canvas').innerHTML}<script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close();}
function downloadWordDocument(){const title=$('#editor-title').value.trim()||'Documento';const html=`<html><head><meta charset="utf-8"></head><body>${$('#document-canvas').innerHTML}</body></html>`;const blob=new Blob(['\ufeff',html],{type:'application/msword'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=(title.replace(/[\\/:*?"<>|]/g,'_'))+'.doc';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);auditEvent('EXPORTACAO_WORD',`Exportou ${title} em formato DOC compatível com Word`);}

const previousShowViewV040=showView;
showView=function(view){if(view==='explore'){document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.view===view));return renderExplore();}if(view==='editor'){document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.view===view));return renderEditor();}return previousShowViewV040(view);};


async function openExistingDocumentInEditor(){
 const files=getDocs().filter(x=>x.type==='file');if(!files.length){alert('Não há arquivos no gerenciador de documentos.');return;}
 const list=files.map((f,i)=>`${i+1}. ${f.name}`).join('\n');const answer=prompt(`Digite o número do documento que deseja abrir para edição:\n${list}`);if(!answer)return;const item=files[Number(answer)-1];if(!item){alert('Número inválido.');return;}
 const stored=await getStoredFile(item.id);if(!stored){alert('Arquivo não encontrado no armazenamento.');return;}const ext=(item.name.split('.').pop()||'').toLowerCase();let html='';
 try{
  if(['html','htm'].includes(ext)){const raw=await stored.blob.text();const doc=new DOMParser().parseFromString(raw,'text/html');html=doc.body.innerHTML||raw;}
  else if(['txt','md','csv','log'].includes(ext)){html='<pre>'+escapeHtml(await stored.blob.text())+'</pre>';}
  else if(ext==='docx'){await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js',()=>!!window.mammoth);const result=await window.mammoth.convertToHtml({arrayBuffer:await stored.blob.arrayBuffer()});html=result.value;}
  else if(ext==='pdf'){await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',()=>!!window.pdfjsLib);window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';const pdf=await window.pdfjsLib.getDocument({data:await stored.blob.arrayBuffer()}).promise;for(let n=1;n<=pdf.numPages;n++){const page=await pdf.getPage(n);const content=await page.getTextContent();html+=`<p>${escapeHtml(content.items.map(x=>x.str).join(' '))}</p>`;}}
  else{alert('Este formato pode ser consultado no Explore, mas ainda não pode ser convertido para edição. Formatos editáveis: HTML, TXT, DOCX e PDF com texto.');return;}
 }catch(err){alert('Não foi possível importar este documento. Verifique se o formato é compatível.');return;}
 editorDocumentId=item.id;$('#editor-title').value=item.name.replace(/\.[^.]+$/,'');$('#document-canvas').innerHTML=html||'<p></p>';editorDirty=false;$('#editor-status-text').textContent=`Documento carregado: ${item.name}`;auditEvent('EDICAO_DOCUMENTO',`Abriu ${item.name} no editor para edição`);
}


/* IAF v0.6.0 — auditoria temporariamente pausada + conexão consentida entre dispositivos */
// Pausa solicitada: nenhuma nova atividade é gravada até reativação deliberada em versão futura.
auditEvent = function(){ /* registro temporariamente suspenso */ };
pageNames.devices = 'Conexão entre dispositivos';
pageNames.locations = 'Localização de dispositivos';
pageDescriptions.devices = 'Conexão de mídia entre dispositivos com autorização explícita no aparelho que transmite.';
pageDescriptions.locations = 'Compartilhamento voluntário da localização GPS do próprio dispositivo.';
icons.devices = '▣'; icons.locations = '⌖';
let iafPeer = null, iafLocalStream = null, iafLocationWatch = null, iafLocationChannel = null, iafRemoteStream = null;
const deviceIdKey='iaf_device_id_v050';
function getDeviceId(){let id=localStorage.getItem(deviceIdKey);if(!id){id=(crypto.randomUUID?crypto.randomUUID():`IAF-${Date.now()}-${Math.random().toString(36).slice(2,8)}`);localStorage.setItem(deviceIdKey,id);}return id;}
function deviceLabel(){return `${/Android|iPhone|iPad/i.test(navigator.userAgent)?'Dispositivo móvel':'Computador'} · ${navigator.platform||'Navegador'}`;}
function secureContextNotice(){return window.isSecureContext?'Conexão segura detectada (HTTPS/localhost).':'Atenção: câmera, microfone, tela e GPS exigem HTTPS ou localhost.';}
function renderDevices(){
  $('#crumb-current').textContent=pageNames.devices;
  $('#content-view').innerHTML=`<div class="welcome-row"><div><div class="eyebrow"><span class="eyebrow-line"></span> CONEXÃO AUTORIZADA</div><h1>Conexão entre dispositivos</h1><p class="lead">Conecte o celular ao computador para transmitir câmera ou tela. A transmissão só começa depois da autorização no dispositivo de origem.</p></div><div class="welcome-meta"><span class="meta-label">IDENTIFICAÇÃO DESTE APARELHO</span><strong>${escapeHtml(getDeviceId().slice(0,12))}</strong></div></div>
  <div class="notice"><span class="notice-icon">i</span><div><strong>Privacidade e consentimento</strong><p>${escapeHtml(secureContextNotice())} O navegador sempre exibirá a solicitação de permissão. Não há ativação silenciosa de câmera, tela ou localização.</p></div></div>
  <div class="device-grid"><section class="panel device-panel"><div class="panel-heading"><div><span class="section-index">01</span><h2>Transmitir deste dispositivo (celular)</h2></div><span class="section-note">APARELHO DE ORIGEM</span></div>
    <p class="device-help">No celular, cole o convite do computador e toque uma vez em <strong>Conectar e compartilhar câmera</strong>. A câmera frontal é a opção inicial; o navegador pode pedir confirmação novamente por segurança.</p>
    <label class="device-field">Oferta recebida do computador<textarea id="device-offer-in" rows="5" placeholder="Cole aqui o código de conexão recebido do computador"></textarea></label>
    <div class="device-controls"><label class="device-check"><input type="checkbox" id="device-share-camera" checked> Compartilhar câmeras disponíveis</label><label class="device-check"><input type="checkbox" id="device-share-mic"> Compartilhar microfone</label><label class="device-check"><input type="checkbox" id="device-share-screen"> Compartilhar tela (se suportado)</label></div>
    <div class="camera-discovery"><button class="secondary-button" id="device-detect-cameras" type="button">DETECTAR CÂMERAS DESTE CELULAR</button><p id="device-camera-help">Autorize o acesso para listar as câmeras que este aparelho e navegador disponibilizam. Até três poderão ser tentadas simultaneamente.</p><div id="device-camera-list" class="camera-list"><span>Nenhuma câmera detectada ainda.</span></div></div>
    <div class="device-actions"><button class="primary-button" id="device-accept-offer">CONECTAR E COMPARTILHAR CÂMERA</button></div>
    <label class="device-field">Resposta para enviar ao computador<textarea id="device-answer-out" rows="5" readonly placeholder="A resposta aparecerá aqui após a conexão"></textarea></label><button class="secondary-button" id="device-copy-answer">COPIAR RESPOSTA</button>
    <div class="device-preview"><video id="device-local-preview" autoplay muted playsinline></video><span>Prévia local da câmera / tela</span></div>
  </section>
  <section class="panel device-panel"><div class="panel-heading"><div><span class="section-index">02</span><h2>Visualizar neste computador</h2></div><span class="section-note">APARELHO RECEPTOR</span></div>
    <p class="device-help">No computador, toque em iniciar e envie o convite ao celular. Depois, cole aqui a confirmação recebida para exibir a câmera. A troca de códigos ainda é necessária até configurarmos o servidor de conexão automática.</p>
    <button class="primary-button" id="device-create-offer">INICIAR CONEXÃO / GERAR CONVITE</button>
    <label class="device-field">Código para enviar ao celular<textarea id="device-offer-out" rows="5" readonly placeholder="Clique em gerar código"></textarea></label><button class="secondary-button" id="device-copy-offer">COPIAR CÓDIGO</button>
    <label class="device-field">Resposta recebida do celular<textarea id="device-answer-in" rows="5" placeholder="Cole aqui a resposta gerada no celular"></textarea></label><button class="primary-button" id="device-finish-connect">CONECTAR E EXIBIR CÂMERA</button>
    <div class="device-remote-area"><div id="device-remote-grid" class="device-remote-grid"><div class="camera-empty">Aguardando conexão autorizada</div></div><div id="device-connection-status" class="device-connection-status">Nenhuma câmera recebida.</div></div>
  </section></div>
  <div class="device-status" id="device-status">Nenhuma conexão ativa. Os códigos de pareamento são temporários.</div><footer>IAF — CONEXÃO ENTRE DISPOSITIVOS <span>•</span> V0.6.0</footer>`;
  bindDeviceControls();
}
function waitIce(pc,timeoutMs=12000){return new Promise(resolve=>{if(pc.iceGatheringState==='complete')return resolve();let settled=false;const finish=()=>{if(settled)return;settled=true;pc.removeEventListener('icegatheringstatechange',done);clearTimeout(timer);resolve();};const done=()=>{if(pc.iceGatheringState==='complete')finish();};const timer=setTimeout(finish,timeoutMs);pc.addEventListener('icegatheringstatechange',done);});}
let iafAvailableCameras=[];
let iafRemoteCameraCount=0;
let iafCameraStreams=[];
let iafAudioStream=null;
let iafScreenStream=null;
async function detectDeviceCameras(){
 const help=$('#device-camera-help'),list=$('#device-camera-list'),btn=$('#device-detect-cameras');
 if(!navigator.mediaDevices?.getUserMedia||!navigator.mediaDevices?.enumerateDevices)throw new Error('Este navegador não oferece detecção de câmeras. Use HTTPS e um navegador atualizado.');
 if(btn){btn.disabled=true;btn.textContent='DETECTANDO…';}
 if(help)help.textContent='Solicitando permissão para identificar as câmeras…';
 let probe;
 try{
  probe=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
  probe.getTracks().forEach(t=>t.stop());
  const devices=await navigator.mediaDevices.enumerateDevices();
  iafAvailableCameras=devices.filter(d=>d.kind==='videoinput');
  if(!iafAvailableCameras.length){if(list)list.innerHTML='<span>Nenhuma câmera foi disponibilizada pelo navegador.</span>';if(help)help.textContent='Verifique as permissões e se há câmeras disponíveis.';return;}
  if(list)list.innerHTML=iafAvailableCameras.map((d,i)=>`<label class="camera-option"><input type="checkbox" class="device-camera-choice" value="${escapeHtml(d.deviceId)}" ${i<3?'checked':''}><span><strong>${escapeHtml(d.label||`Câmera ${i+1}`)}</strong><small>${i<3?'Selecionada inicialmente':'Disponível'}</small></span></label>`).join('');
  if(help)help.textContent=`${iafAvailableCameras.length} câmera(s) disponibilizada(s) por este navegador. Selecione até três. O aparelho pode limitar o uso simultâneo.`;
 }finally{if(probe)probe.getTracks().forEach(t=>t.stop());if(btn){btn.disabled=false;btn.textContent='ATUALIZAR LISTA DE CÂMERAS';}}
}
function selectedCameraIds(){
 return [...document.querySelectorAll('.device-camera-choice:checked')].map(el=>el.value).slice(0,3);
}
function renderRemoteCamera(track,stream,transceiver){
 const grid=$('#device-remote-grid'),status=$('#device-connection-status');if(!grid)return;
 const index=Math.max(0,iafRemoteCameraCount++);
 const card=document.createElement('div');card.className='remote-camera-card';
 const heading=document.createElement('div');heading.className='remote-camera-heading';heading.textContent=`Câmera ${index+1}`;
 const video=document.createElement('video');video.autoplay=true;video.muted=true;video.playsInline=true;video.controls=true;
 video.srcObject=stream||new MediaStream([track]);
 const meta=document.createElement('small');meta.textContent='Aguardando imagem…';
 card.append(heading,video,meta);grid.append(card);
 const update=()=>{meta.textContent=track.readyState==='live'?(video.videoWidth?`Ao vivo · ${video.videoWidth} × ${video.videoHeight}`:'Faixa ativa · aguardando quadros'):'Transmissão encerrada';if(status)status.textContent=`${grid.querySelectorAll('video').length} câmera(s) recebida(s).`;};
 track.onunmute=async()=>{try{await video.play();}catch(e){meta.textContent='Vídeo recebido. Toque para reproduzir.';}update();};
 track.onmute=()=>{meta.textContent='Sinal temporariamente pausado.';};
 video.onloadedmetadata=async()=>{try{await video.play();}catch(e){meta.textContent='Toque no vídeo para reproduzir.';}update();};
 video.onplaying=update;update();
}
function makePeer(receiver){
 const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
 if(receiver){
  iafRemoteCameraCount=0;
  const grid=$('#device-remote-grid');if(grid)grid.innerHTML='';
  for(let i=0;i<3;i++)pc.addTransceiver('video',{direction:'sendrecv'});
  pc.addTransceiver('audio',{direction:'sendrecv'});
 }else{
  pc.ondatachannel=e=>{iafLocationChannel=e.channel;iafLocationChannel.onopen=()=>{const s=$('#device-status');if(s)s.textContent='Canal de localização seguro conectado.';};};
 }
 pc.ontrack=e=>{
  if(e.track.kind==='video'){renderRemoteCamera(e.track,e.streams?.[0],e.transceiver);}
  else if(e.track.kind==='audio'){const a=document.createElement('audio');a.autoplay=true;a.srcObject=e.streams?.[0]||new MediaStream([e.track]);a.play().catch(()=>{});}
 };
 pc.onconnectionstatechange=()=>{const s=$('#device-status');if(s)s.textContent=`Estado da conexão: ${pc.connectionState}`;};
 pc.oniceconnectionstatechange=()=>{const s=$('#device-status');if(s)s.textContent=`Conexão WebRTC: ${pc.iceConnectionState} · sinalização: ${pc.signalingState}`;};
 if(receiver){iafLocationChannel=pc.createDataChannel('iaf-location');iafLocationChannel.onmessage=e=>showRemoteLocation(e.data);}
 return pc;
}
function setBusy(button,busy,label){if(!button)return;button.disabled=busy;if(busy){button.dataset.originalLabel=button.textContent;button.textContent=label||'AGUARDE…';}else if(button.dataset.originalLabel){button.textContent=button.dataset.originalLabel;delete button.dataset.originalLabel;}}
function stopLocalMedia(){
 [iafLocalStream,...(iafCameraStreams||[]),iafAudioStream,iafScreenStream].filter(Boolean).forEach(s=>s.getTracks().forEach(t=>t.stop()));
 iafLocalStream=null;iafCameraStreams=[];iafAudioStream=null;iafScreenStream=null;
 const v=$('#device-local-preview');if(v)v.srcObject=null;
}
function bindDeviceControls(){
 const detectBtn=$('#device-detect-cameras');
 detectBtn.onclick=async()=>{try{await detectDeviceCameras();}catch(e){const h=$('#device-camera-help');if(h)h.textContent=`Não foi possível detectar câmeras: ${e.message}`;}};
 const createBtn=$('#device-create-offer'),acceptBtn=$('#device-accept-offer'),finishBtn=$('#device-finish-connect');
 createBtn.onclick=async()=>{setBusy(createBtn,true,'GERANDO…');try{stopLocalMedia();iafPeer?.close();iafLocationChannel=null;iafPeer=makePeer(true);const offer=await iafPeer.createOffer();await iafPeer.setLocalDescription(offer);$('#device-status').textContent='Preparando código de conexão…';await waitIce(iafPeer);if(iafPeer.signalingState!=='have-local-offer')throw new Error('A oferta deixou de estar válida. Gere um novo código.');$('#device-offer-out').value=JSON.stringify(iafPeer.localDescription);$('#device-answer-in').value='';$('#device-status').textContent='Convite pronto. Envie-o ao celular e aguarde a autorização.';}catch(e){$('#device-status').textContent=`Não foi possível criar a oferta: ${e.message}`;}finally{setBusy(createBtn,false);}};
 acceptBtn.onclick=async()=>{setBusy(acceptBtn,true,'CONECTANDO…');try{
 const offer=JSON.parse($('#device-offer-in').value);
 if(offer.type!=='offer'||!offer.sdp)throw new Error('Código de oferta inválido. Gere um novo convite no computador.');
 stopLocalMedia();iafPeer?.close();iafLocationChannel=null;iafPeer=makePeer(false);const pc=iafPeer;
 // Primeiro aplica a oferta: os transceptores de áudio/vídeo já existem neste ponto.
 await pc.setRemoteDescription(offer);
 const wantCam=$('#device-share-camera').checked,wantMic=$('#device-share-mic').checked;
 iafCameraStreams=[];let screenStream=null;
 if(wantCam){
  if(!navigator.mediaDevices?.getUserMedia)throw new Error('Câmeras indisponíveis. Use HTTPS e um navegador compatível.');
  if(!iafAvailableCameras.length)await detectDeviceCameras();
  const ids=selectedCameraIds();
  if(!ids.length)throw new Error('Selecione pelo menos uma câmera disponível.');
  const results=await Promise.allSettled(ids.map(deviceId=>navigator.mediaDevices.getUserMedia({video:{deviceId:{exact:deviceId}},audio:false})));
  iafCameraStreams=results.filter(r=>r.status==='fulfilled').map(r=>r.value);
  const failures=results.filter(r=>r.status==='rejected');
  if(!iafCameraStreams.length)throw new Error('O navegador não conseguiu abrir nenhuma das câmeras selecionadas.');
  iafLocalStream=iafCameraStreams[0];$('#device-local-preview').srcObject=iafCameraStreams[0];
  if(failures.length){const h=$('#device-camera-help');if(h)h.textContent=`${iafCameraStreams.length} câmera(s) aberta(s); ${failures.length} não puderam ser usadas simultaneamente neste aparelho.`;}
 }
 if(wantMic){
  const audioOnly=await navigator.mediaDevices.getUserMedia({video:false,audio:true});
  if(!iafLocalStream)iafLocalStream=audioOnly;else audioOnly.getAudioTracks().forEach(t=>iafLocalStream.addTrack(t));
  iafAudioStream=audioOnly;
 }
 if($('#device-share-screen').checked){
   if(!navigator.mediaDevices?.getDisplayMedia)throw new Error('Este navegador não permite compartilhar tela.');
   screenStream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:false});iafScreenStream=screenStream;
   if(!iafLocalStream)iafLocalStream=new MediaStream();
   screenStream.getTracks().forEach(t=>iafLocalStream.addTrack(t));
   $('#device-local-preview').srcObject=screenStream;
   screenStream.getVideoTracks()[0].onended=()=>{$('#device-status').textContent='Compartilhamento de tela encerrado pelo usuário.';};
 }
 const streamsToSend=screenStream?[screenStream]:iafCameraStreams;
  if(!streamsToSend.length)throw new Error('Nenhuma câmera foi aberta para transmissão.');
  streamsToSend.slice(0,3).forEach(stream=>{const track=stream.getVideoTracks()[0];if(track)pc.addTrack(track,stream);});
  if(iafAudioStream?.getAudioTracks()[0])pc.addTrack(iafAudioStream.getAudioTracks()[0],iafAudioStream);
 const answer=await pc.createAnswer();await pc.setLocalDescription(answer);await waitIce(pc);
 $('#device-answer-out').value=JSON.stringify(pc.localDescription);
 $('#device-status').textContent='Permissões concedidas. Envie a resposta ao computador para iniciar a transmissão.';
 }catch(e){stopLocalMedia();$('#device-status').textContent=`Conexão não iniciada: ${e.message}. Gere um novo convite e verifique as permissões.`;}finally{setBusy(acceptBtn,false);}};
 finishBtn.onclick=async()=>{setBusy(finishBtn,true,'FINALIZANDO…');try{if(!iafPeer)throw new Error('Gere primeiro o código de conexão no computador.');if(iafPeer.signalingState!=='have-local-offer')throw new Error(iafPeer.signalingState==='stable'?'Esta resposta já foi aplicada ou a conexão já foi negociada. Para reconectar, gere um novo código.':`A conexão não está aguardando resposta (estado: ${iafPeer.signalingState}). Gere uma nova oferta.`);const answer=JSON.parse($('#device-answer-in').value);if(answer.type!=='answer'||!answer.sdp)throw new Error('Resposta inválida. Cole a resposta gerada pelo celular.');await iafPeer.setRemoteDescription(answer);$('#device-status').textContent='Confirmação aplicada. Aguardando a câmera do celular…';}catch(e){$('#device-status').textContent=`Não foi possível finalizar: ${e.message}`;}finally{setBusy(finishBtn,false);}};
 $('#device-copy-offer').onclick=()=>copyField('device-offer-out');$('#device-copy-answer').onclick=()=>copyField('device-answer-out');
}
function copyField(id){const el=$('#'+id);if(!el?.value)return;el.select();if(navigator.clipboard?.writeText)navigator.clipboard.writeText(el.value).then(()=>{$('#device-status').textContent='Código copiado.';}).catch(()=>document.execCommand('copy'));else document.execCommand('copy');}
function renderLocations(){
 $('#crumb-current').textContent=pageNames.locations;
 $('#content-view').innerHTML=`<div class="welcome-row"><div><div class="eyebrow"><span class="eyebrow-line"></span> LOCALIZAÇÃO COM CONSENTIMENTO</div><h1>Localização de dispositivos</h1><p class="lead">Compartilhe a posição GPS deste aparelho voluntariamente e visualize a posição recebida em outro dispositivo conectado.</p></div><div class="welcome-meta"><span class="meta-label">PRIVACIDADE</span><strong>PERMISSÃO EXPLÍCITA</strong></div></div>
 <div class="notice"><span class="notice-icon">i</span><div><strong>O usuário controla o compartilhamento</strong><p>A localização só é solicitada após clicar em iniciar. O navegador mostra a permissão de GPS; o compartilhamento pode ser interrompido a qualquer momento. Não existe rastreamento oculto.</p></div></div>
 <div class="location-grid"><section class="panel device-panel"><div class="panel-heading"><div><span class="section-index">01</span><h2>Compartilhar localização deste aparelho</h2></div></div><p class="device-help">O próprio usuário deve aceitar a solicitação de localização do navegador.</p><button class="primary-button" id="location-start">PERMITIR E COMPARTILHAR GPS</button><button class="secondary-button" id="location-stop" disabled>PARAR COMPARTILHAMENTO</button><div class="location-data" id="location-own">Localização ainda não compartilhada.</div></section>
 <section class="panel device-panel"><div class="panel-heading"><div><span class="section-index">02</span><h2>Localização recebida</h2></div></div><div class="location-data" id="location-remote">Aguardando dados de um dispositivo conectado.</div><a id="location-map-link" class="secondary-button location-map-link hidden" target="_blank" rel="noopener">ABRIR NO MAPA</a></section></div><div class="device-status">Para transmitir GPS entre aparelhos, estabeleça primeiro a conexão WebRTC no menu Conexão entre dispositivos. O canal de localização usa a mesma sessão autorizada.</div><footer>IAF — LOCALIZAÇÃO DE DISPOSITIVOS <span>•</span> V0.6.0</footer>`;
 $('#location-start').onclick=()=>{if(!navigator.geolocation){$('#location-own').textContent='Geolocalização não suportada neste navegador.';return;}if(!iafLocationChannel||iafLocationChannel.readyState!=='open'){ $('#location-own').textContent='Conecte primeiro os dispositivos no menu Conexão entre dispositivos.';return;}iafLocationWatch=navigator.geolocation.watchPosition(pos=>{const c={latitude:pos.coords.latitude,longitude:pos.coords.longitude,accuracy:pos.coords.accuracy,at:new Date().toISOString()};$('#location-own').textContent=`GPS ativo · ${c.latitude.toFixed(6)}, ${c.longitude.toFixed(6)} · Precisão aproximada: ${Math.round(c.accuracy)} m`;if(iafLocationChannel?.readyState==='open')iafLocationChannel.send(JSON.stringify(c));},err=>{$('#location-own').textContent=`Não foi possível obter localização: ${err.message}`;},{enableHighAccuracy:true,maximumAge:5000,timeout:15000});$('#location-start').disabled=true;$('#location-stop').disabled=false;};
 $('#location-stop').onclick=()=>{if(iafLocationWatch!==null)navigator.geolocation.clearWatch(iafLocationWatch);iafLocationWatch=null;$('#location-start').disabled=false;$('#location-stop').disabled=true;$('#location-own').textContent='Compartilhamento GPS interrompido.';};
}
function showRemoteLocation(raw){try{const d=JSON.parse(raw);if(!Number.isFinite(d.latitude)||!Number.isFinite(d.longitude))return;const el=$('#location-remote');if(el)el.textContent=`Localização recebida · ${d.latitude.toFixed(6)}, ${d.longitude.toFixed(6)} · Precisão: ${Math.round(d.accuracy||0)} m · ${new Date(d.at).toLocaleTimeString('pt-BR')}`;const a=$('#location-map-link');if(a){a.href=`https://www.google.com/maps?q=${d.latitude},${d.longitude}`;a.classList.remove('hidden');}}catch{}}
const iafOriginalShowView=showView;
showView=function(view){if(view==='devices'){document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.view===view));return renderDevices();}if(view==='locations'){document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.view===view));return renderLocations();}if(view==='audit'){document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.view===view));$('#crumb-current').textContent='Registros de auditoria';$('#content-view').innerHTML=`<div class="welcome-row"><div><div class="eyebrow">CONTROLE DO SISTEMA</div><h1>Registros de auditoria</h1><p class="lead">A gravação de auditoria está temporariamente pausada para estabilização do sistema.</p></div></div><div class="notice"><span class="notice-icon">i</span><div><strong>Auditoria pausada temporariamente</strong><p>Nenhum novo evento ou alteração está sendo registrado nesta versão. Os dados antigos foram preservados, mas não são atualizados.</p></div></div>`;return;}return iafOriginalShowView(view);};
