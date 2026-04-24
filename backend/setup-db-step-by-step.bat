@echo off
echo ==========================================
echo CONFIGURACAO DO BANCO - PASSO A PASSO
echo ==========================================
echo.
echo IMPORTANTE: O tunel SSH deve estar ativo!
echo.
echo Pressione ENTER para continuar ou CTRL+C para cancelar...
pause > nul

echo.
echo [1/5] Mudando para pasta Backend...
cd /d "%~dp0"
echo Pasta atual: %CD%

echo.
echo [2/5] Copiando configuracao para usar tunel SSH...
if exist ".env.tunnel" (
    copy ".env.tunnel" ".env"
    echo ✅ Arquivo .env configurado para usar tunel
) else (
    echo ❌ ERRO: Arquivo .env.tunnel nao encontrado!
    pause
    exit /b 1
)

echo.
echo [3/5] Testando conexao com banco MySQL...
echo Aguarde...
npm run db:test
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERRO: Nao foi possivel conectar ao banco!
    echo.
    echo Verifique se:
    echo 1. O tunel SSH esta ativo (outro terminal)
    echo 2. A senha SSH estava correta
    echo 3. O usuario SSH esta correto
    echo.
    pause
    exit /b 1
)

echo.
echo [4/5] Criando estrutura do banco de dados...
npm run db:migrate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERRO: Falha ao criar estrutura do banco
    pause
    exit /b 1
)

echo.
echo [5/5] Inserindo dados iniciais...
npm run db:seed

echo.
echo ==========================================
echo ✅ BANCO DE DADOS CONFIGURADO COM SUCESSO!
echo ==========================================
echo.
echo Proximo passo: Testar a aplicacao
echo Execute: npm start
echo.
pause