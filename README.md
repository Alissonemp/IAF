# IAF — Conexão entre dispositivos e localização (v0.6.0)

## Executar
1. Extraia o ZIP.
2. Sirva a pasta por HTTPS ou localhost (por exemplo, Live Server em localhost). Câmera, compartilhamento de tela e GPS não funcionam de forma confiável abrindo o arquivo `index.html` diretamente.
3. Senha demonstrativa: `IAFdemo2026!`.

## Alterações desta versão

### Auditoria temporariamente pausada
- A gravação de novos eventos foi suspensa conforme solicitado para estabilização.
- A tela de auditoria informa que está pausada.
- O histórico local já existente não é apagado, mas não recebe novos registros.
- A suspensão é temporária e deve ser substituída por uma implementação no servidor quando a auditoria for retomada.

### Conexão entre dispositivos
- Novo menu **Conexão entre dispositivos**.
- Identificador local simples por navegador/dispositivo.
- Pareamento WebRTC com troca manual de oferta e resposta (copiar/colar) entre computador e celular.
- O computador gera um convite; o celular recebe a oferta, solicita permissão para câmera frontal/traseira e, opcionalmente, microfone e compartilhamento de tela; o celular gera a resposta para o computador. A interface usa textos mais diretos e prioriza a câmera frontal.
- O computador anuncia explicitamente que deseja receber vídeo e áudio (transceptores `recvonly`), recebe as faixas negociadas e tenta iniciar a reprodução automaticamente no elemento de vídeo remoto.
- O compartilhamento de tela depende do suporte do navegador/dispositivo. Muitos navegadores móveis não oferecem captura de tela.
- O navegador sempre apresenta os diálogos nativos de permissão; o usuário pode negar ou encerrar a transmissão.

### Localização
- Novo menu **Localização de dispositivos**.
- O usuário do dispositivo de origem inicia o compartilhamento e concede a permissão de geolocalização no navegador.
- A localização é transmitida pelo canal de dados WebRTC já conectado.
- O dispositivo receptor mostra latitude, longitude, precisão aproximada e link para abrir o ponto no Google Maps.
- O usuário pode interromper o compartilhamento a qualquer momento.

## Como parear (fluxo manual)
1. Abra o IAF no computador e no celular usando a mesma versão hospedada em HTTPS.
2. No computador, abra **Conexão entre dispositivos** e clique em **Iniciar conexão / Gerar convite**.
3. Copie o código do computador e envie-o ao celular por um canal privado.
4. No celular, cole o convite. A câmera frontal já vem selecionada. Clique em **Conectar e compartilhar câmera** e aceite os diálogos nativos de permissão.
5. Copie a resposta gerada no celular e envie ao computador.
6. No computador, cole a resposta e clique em **Conectar e exibir câmera**.
7. Para GPS, abra **Localização de dispositivos** no celular e clique em **Permitir e compartilhar GPS**. No computador, abra o mesmo menu para visualizar os dados recebidos.

## Limitações e requisitos importantes
- Esta versão implementa pareamento WebRTC manual, sem servidor de sinalização. A troca de códigos é necessária para cada sessão. Para uso institucional, recomenda-se implementar um serviço de sinalização autenticado (WebSocket), autenticação individual, expiração de sessão, autorização por dispositivo e registro de consentimento.
- A configuração STUN ajuda a descobrir caminhos de rede, mas algumas redes/firewalls exigem servidor TURN. Sem TURN, a conexão poderá falhar em determinadas redes móveis ou corporativas.
- Câmera, tela e GPS exigem contexto seguro HTTPS (ou localhost para testes) e permissões concedidas pelo usuário do dispositivo que compartilha.
- O compartilhamento de tela em celulares varia conforme sistema operacional e navegador; alguns não o suportam.
- A localização é exibida como coordenadas e link de mapa. Não há rastreamento oculto, histórico de trajetos ou coleta em segundo plano.
- Os dispositivos precisam permanecer com a página aberta durante a sessão. Atualizar/fechar a página encerra a conexão.
- Identificador de dispositivo é apenas um identificador local de navegador, não uma identidade inviolável de hardware.
- Esta é uma implementação de protótipo front-end. Não usar para vigilância, segurança operacional crítica ou dados sensíveis sem backend, controle de acesso, política de retenção e avaliação de segurança.

## Mantido
- Layout institucional e módulos existentes.
- Explore, Documentos e Editor de documentos da versão anterior.
- A auditoria fica apenas pausada, não removida.


## Correção v0.6.0 — negociação WebRTC
- Corrigido o erro `Failed to set remote answer sdp: Called in wrong state: stable`.
- O computador agora só aplica uma resposta quando a conexão está em `have-local-offer`.
- Respostas repetidas, respostas inválidas e tentativas fora de ordem são bloqueadas com mensagens explicativas.
- Os botões de gerar oferta, aceitar oferta e finalizar conexão ficam bloqueados enquanto a operação está em andamento, evitando duplo clique e processamento concorrente.
- Ao iniciar uma nova tentativa, os fluxos locais anteriores são encerrados e uma nova negociação é criada.
- A espera de ICE agora limpa o temporizador e o listener ao concluir.

Se a página antiga estiver aberta, atualize-a com recarga forçada (Ctrl+Shift+R no computador) e use códigos novos nos dois aparelhos. Não reutilize oferta/resposta de uma sessão anterior.


## Correção v0.6.0 — exibição da câmera
- O computador agora adiciona transceptores de vídeo e áudio em modo `recvonly` antes de criar a oferta. Isso informa ao celular que o computador está pronto para receber a câmera; sem essa negociação, a transmissão podia ser autorizada no celular sem aparecer no computador.
- O vídeo remoto agora agrega faixas recebidas quando o navegador não fornece `event.streams`, configura reprodução inline e tenta iniciar `video.play()` assim que a faixa fica disponível.
- A interface foi simplificada com chamadas mais claras e câmera frontal como padrão.
- A conexão automática de um toque ainda exige um servidor de sinalização autenticado (WebSocket) para trocar ofertas/respostas sem copiar códigos. A permissão de câmera não autoriza ativação remota: o usuário do celular ainda precisa iniciar/aceitar cada sessão no próprio aparelho.
