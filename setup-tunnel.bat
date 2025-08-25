@echo off
echo ======================================
echo CONFIGURACAO DO TUNEL SSH PARA MYSQL
echo ======================================
echo.
echo Este script vai configurar o tunel SSH para acessar o banco MySQL
echo.
echo PASSOS NECESSARIOS:
echo.
echo 1. Voce precisa das credenciais SSH do servidor EasyPanel
echo 2. Execute o comando abaixo no PowerShell/CMD (substitua USER pelo usuario correto):
echo.
echo    ssh -L 3306:atma-mysql:3306 USER@easypanel.roilabs.com.br
echo.
echo    Exemplos de usuarios comuns:
echo    - root@easypanel.roilabs.com.br
echo    - ubuntu@easypanel.roilabs.com.br
echo    - admin@easypanel.roilabs.com.br
echo.
echo 3. Deixe o terminal SSH aberto (nao feche!)
echo.
echo 4. Em outro terminal, execute:
echo    cd Backend
echo    copy .env.tunnel .env
echo    npm run db:migrate
echo.
echo ======================================
echo.
echo Pressione qualquer tecla para tentar conectar automaticamente...
pause > nul

echo Tentando conexao SSH automatica...
echo.

echo Tentando com root...
ssh -o ConnectTimeout=5 -L 3306:atma-mysql:3306 root@easypanel.roilabs.com.br
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Tentando com ubuntu...
    ssh -o ConnectTimeout=5 -L 3306:atma-mysql:3306 ubuntu@easypanel.roilabs.com.br
)
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Tentando com admin...
    ssh -o ConnectTimeout=5 -L 3306:atma-mysql:3306 admin@easypanel.roilabs.com.br
)

echo.
echo Se nenhuma conexao funcionou, verifique:
echo 1. Credenciais SSH corretas
echo 2. Firewall liberado para SSH (porta 22)
echo 3. Acesso SSH habilitado no EasyPanel
echo.
pause