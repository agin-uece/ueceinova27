#!/bin/bash
# =============================================================================
# entrypoint-sonar.sh
# Coloque este arquivo em: backend/entrypoint-sonar.sh
# =============================================================================
set -e

SONAR_URL="${SONAR_HOST_URL:-http://sonarqube:9000}"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║         Inova27 — Análise de Qualidade       ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# =============================================================================
# 1. Aguardar o SonarQube ficar completamente UP
#    (o healthcheck do Docker já ajuda, mas este loop garante que a API
#     está respondendo corretamente antes de enviar a análise)
# =============================================================================
echo "⏳ Aguardando SonarQube em: ${SONAR_URL}"

MAX_RETRIES=50
RETRY=0

until curl -sf "${SONAR_URL}/api/system/status" 2>/dev/null | grep -q '"status":"UP"'; do
  RETRY=$((RETRY + 1))
  if [ "${RETRY}" -ge "${MAX_RETRIES}" ]; then
    echo ""
    echo "❌ ERRO: SonarQube não ficou disponível após $((MAX_RETRIES * 15)) segundos."
    echo "   Verifique os logs: docker compose logs sonarqube"
    exit 1
  fi
  echo "   Ainda inicializando... (${RETRY}/${MAX_RETRIES} — aguardando 15s)"
  sleep 15
done

echo "✅ SonarQube disponível e pronto!"
echo ""

# =============================================================================
# 2. Garantir permissão de execução no Gradle Wrapper
# =============================================================================
chmod +x ./gradlew 2>/dev/null || true

# =============================================================================
# 3. Definir autenticação do Sonar
#    Prioridade: SONAR_TOKEN > admin/senha
# =============================================================================
if [ -n "${SONAR_TOKEN}" ]; then
  echo "🔑 Autenticando via SONAR_TOKEN"
  SONAR_AUTH_ARGS="-Dsonar.token=${SONAR_TOKEN}"
else
  ADMIN_LOGIN="${SONARQUBE_ADMIN_LOGIN:-admin}"
  ADMIN_PASS="${SONARQUBE_ADMIN_PASSWORD:-admin}"
  echo "🔑 Autenticando com credenciais: ${ADMIN_LOGIN}"
  echo "   ⚠️  Recomendado: crie um token em My Account > Security e use SONAR_TOKEN no .env"
  SONAR_AUTH_ARGS="-Dsonar.login=${ADMIN_LOGIN} -Dsonar.password=${ADMIN_PASS}"
fi

# =============================================================================
# 4. Executar tudo junto: test → jacocoTestReport → sonarqube
# =============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Rodando testes, gerando Jacoco e enviando ao Sonar..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Criamos um diretório de cache isolado para o scanner não brigar com o backend
CACHE_DIR="/app/.gradle-scanner"

if [ -n "${SONAR_TOKEN}" ]; then
  ./gradlew test jacocoTestReport sonarqube \
    --no-daemon \
    --project-cache-dir="${CACHE_DIR}" \
    -Dsonar.host.url="${SONAR_URL}" \
    -Dsonar.token="${SONAR_TOKEN}"
else
  ./gradlew test jacocoTestReport sonarqube \
    --no-daemon \
    --project-cache-dir="${CACHE_DIR}" \
    -Dsonar.host.url="${SONAR_URL}" \
    -Dsonar.login="${SONARQUBE_ADMIN_LOGIN:-admin}" \
    -Dsonar.password="${SONARQUBE_ADMIN_PASSWORD:-admin}"
fi

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║    ✅  Análise concluída com sucesso!        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "🔗 Dashboard: ${SONAR_URL}/dashboard?id=Inova27"
echo ""