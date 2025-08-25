@echo off
echo ======================================
echo CONFIGURACAO DO BANCO DE DADOS MYSQL
echo ======================================
echo.
echo Este script vai configurar o banco de dados apos o tunel SSH estar ativo
echo.
echo REQUISITOS:
echo 1. Tunel SSH deve estar ativo (execute setup-tunnel.bat primeiro)
echo 2. Em outro terminal, deixe o SSH rodando
echo.
echo ======================================
echo.

cd Backend

echo Copiando configuracao para usar tunel...
copy .env.tunnel .env
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Nao foi possivel copiar .env.tunnel
    pause
    exit /b 1
)

echo.
echo Testando conexao com banco...
npm run db:test
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Nao foi possivel conectar ao banco
    echo Verifique se o tunel SSH esta ativo
    pause
    exit /b 1
)

echo.
echo Executando migracoes...
npm run db:migrate
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Falha nas migracoes
    pause
    exit /b 1
)

echo.
echo Inserindo dados iniciais...
npm run db:seed

echo.
echo ======================================
echo BANCO DE DADOS CONFIGURADO COM SUCESSO!
echo ======================================
echo.
echo Para usar o sistema:
echo 1. Mantenha o tunel SSH ativo
echo 2. Execute: npm start (no Backend)
echo 3. Execute: npm start (no Frontend)
echo.
pause