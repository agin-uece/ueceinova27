# INOVA27 - Ecossistema Acadêmico de Inovação

Plataforma acadêmica estruturada em microsserviços conteinerizados, focada em inovação tecnológica e busca semântica assistida por Inteligência Artificial.

---
## Sumário

1. [Visão Geral](#visão-geral)
2. [Tecnologias](#tecnologias)
3. [Pré-requisitos](#pré-requisitos)
4. [Implantação em Produção (DETIC)](#implantação-em-produção-detic)
5. [Execução do Projeto](#execução-do-projeto)
6. [Qualidade de Código (SonarQube)](#qualidade-de-código-sonarqube)
7. [Validação e Troubleshooting](#validação-e-troubleshooting)

---

## Visão Geral

O INOVA27 é um ecossistema moderno que integra:

- **Busca Semântica:** utiliza `pgvector` e modelos de embeddings do Ollama.
- **IA Generativa:** expansão de consultas utilizando o modelo Phi-3.
- **Containers:** orquestração dos serviços via Docker Compose.
- **Qualidade:** análise estática de código integrada ao SonarQube.

---

## Tecnologias

- **Frontend:** React 19 / Next.js 16 / Tailwind CSS
- **Backend:** Java 21 / Spring Boot 3 / Gradle 8
- **Banco de Dados:** PostgreSQL 16 + `pgvector`
- **IA/LLM:** Ollama (modelos `phi3` e `mxbai-embed-large`)
- **Qualidade:** SonarQube Community Edition
- **Infraestrutura:** Docker / Docker Compose

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

| Ferramenta | Versão Recomendada | Link de Instalação |
| :--- | :--- | :--- |
| **Docker** | 24.0.0 ou superior | [Docker](https://www.docker.com/get-started) |
| **Docker Compose** | 2.20.0 ou superior | [Documentação](https://docs.docker.com/compose/install/) |
| **Git** | Versão recente | [Git](https://git-scm.com/) |

> **Nota sobre o Ollama:** o projeto utiliza o Ollama via Docker. Não é necessário instalá-lo nativamente no computador, a menos que você queira utilizá-lo fora dos containers. A imagem Docker configurada utiliza a tag `latest`.

---

## Implantação em Produção (DETIC)

> **Atenção, DETIC:** esta versão do INOVA27 **não é uma aplicação estática**. Ela é composta por frontend (Next.js), backend (Java/Spring Boot), banco PostgreSQL com `pgvector` e um serviço de IA (Ollama). Todos são executados em containers pelo Docker Compose. **Em produção, utilize somente o perfil `prod`** (não suba SonarQube nem ferramentas de desenvolvimento).

### Componentes e versões

| Componente | Tecnologia / Versão | Serviço no Compose |
| :--- | :--- | :--- |
| Frontend | Node.js 20, Next.js 16, React 19 | `frontend` |
| Backend | Java 21, Spring Boot 3, Gradle 8.14 (build) | `backend` |
| Banco de dados | PostgreSQL 16 + `pgvector` (`pgvector/pgvector:pg16`) | `postgres` |
| IA / busca semântica | Ollama (`latest`), modelos `phi3` e `mxbai-embed-large` | `ollama`, `ollama-pull` |

### Requisitos do servidor

- Linux com **Docker 24+** e **Docker Compose 2.20+** (plugin `docker compose`) e **Git**.
- Acesso à internet na primeira execução (download de imagens e modelos do Ollama).
- Recursos estimados: ao menos 4 CPUs, 8 GB de RAM e 15 GB de disco livres (os modelos de IA ocupam alguns GB). Ajuste conforme o uso observado.
- Portas internas usadas: `3000` (frontend), `8080` (backend). PostgreSQL (`5432`) e Ollama (`11434`) são publicados **apenas em `127.0.0.1`**.

### Passo a passo

```bash
# 1. Obter o código (branch de produção/desenvolvimento conforme combinado com a AGIN)
git clone https://github.com/agin-uece/ueceinova27.git
cd ueceinova27

# 2. Criar e preencher o arquivo de variáveis de ambiente
cp .env.example .env
nano .env

# 3. Subir somente o perfil de produção
docker compose --profile prod up --build -d

# 4. Verificar
docker compose --profile prod ps
docker compose --profile prod logs -f
```

> Na primeira subida, `ollama-pull` baixa os modelos e o backend só inicia depois que o download termina. Pode levar vários minutos.

### Variáveis obrigatórias no `.env` para produção

**Não reutilize os valores do `.env.example`: troque todas as senhas e segredos.**

| Variável | O que configurar |
| :--- | :--- |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Credenciais do banco (senha forte). |
| `DB_USERNAME`, `DB_PASSWORD` | Devem ser iguais a `POSTGRES_USER` / `POSTGRES_PASSWORD`. |
| `JWT_SECRET` | Segredo de assinatura dos tokens, com no mínimo 64 caracteres (ex.: `openssl rand -base64 64`). |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `EMAIL_DESTINATARIO_AGIN` | Servidor SMTP usado pelo sistema para envio de e-mails. |
| `APP_ADMIN_EMAIL`, `APP_ADMIN_SENHA` | Credenciais do administrador inicial do sistema (controle de acesso). |
| `FRONTEND_URL` | URL pública do site, ex.: `https://inova27.uece.br`. |
| `CORS_ALLOWED_ORIGINS` | Mesma URL pública do frontend. |
| `NEXT_PUBLIC_API_URL` | URL pública **acessível pelo navegador** do backend (ex.: `https://inova27.uece.br/api` ou `https://api.inova27.uece.br`). É embutida no frontend durante o build: ao alterá-la, execute novamente com `--build`. |

`OLLAMA_BASE_URL` e a URL do banco são definidas automaticamente pelo Compose para uso interno entre os containers; não é necessário alterá-las para produção. As variáveis `SONAR_*` são usadas apenas no perfil `dev` e podem ser ignoradas.

### Exposição na internet (HTTPS)

O sistema escuta em HTTP nas portas `3000` (frontend) e `8080` (backend). Recomenda-se publicar `inova27.uece.br` por meio de um **proxy reverso (Nginx, Apache etc.) com certificado TLS**, encaminhando para `localhost:3000` (frontend) e para `localhost:8080` (backend, na URL definida em `NEXT_PUBLIC_API_URL`).

### Comandos de operação

```bash
# Status e logs
docker compose --profile prod ps
docker compose --profile prod logs -f backend

# Parar (mantém os dados)
docker compose --profile prod down

# Atualizar para uma nova versão do código
git pull
docker compose --profile prod up --build -d

# Reiniciar um serviço
docker compose --profile prod restart backend
```

> **Dados:** o banco e os modelos de IA ficam em volumes Docker (`postgres_data`, `ollama_data`). **Nunca use `down -v`** em produção, pois isso apaga todos os dados.

### Backup e restauração do banco

```bash
# Backup
docker exec inova27-postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > backup_inova27.sql

# Restauração
docker exec -i inova27-postgres sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"' < backup_inova27.sql
```

---

## Execução do Projeto

Siga os passos abaixo na ordem apresentada.

### 1. Clonar o Repositório

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/agin-uece/ueceinova27.git 
cd ueceinova27
```

### 2. Configuração da Infraestrutura

#### 2.1. Preparação das Variáveis de Ambiente

O projeto depende de um arquivo `.env` na raiz. Após clonar o repositório, crie-o a partir do arquivo de exemplo:

```bash
cp .env.example .env
```

Configure as variáveis necessárias no arquivo `.env`:

- `POSTGRES_PASSWORD`: senha do banco de dados.
- `JWT_SECRET`: chave para assinatura de tokens, com no mínimo 64 caracteres.
- `OLLAMA_BASE_URL`: endereço da API do Ollama.
  - Para o backend executado **dentro do Docker**: `http://ollama:11434`
  - Para o backend executado **fora do Docker**: `http://localhost:11434`

Verifique também se as demais variáveis exigidas pelo arquivo `docker-compose.yml` estão configuradas corretamente.

#### 2.2. Inicialização do Banco de Dados

O arquivo `init.sql`, localizado na raiz do projeto, é montado no container PostgreSQL para criar a extensão `vector` e a tabela `busca_semantica`, necessárias à funcionalidade de busca semântica.

> **Importante:** scripts de inicialização do PostgreSQL normalmente são executados apenas quando o diretório de dados do banco é inicializado pela primeira vez. Caso o volume já contenha dados, alterações no `init.sql` não serão aplicadas automaticamente.

### 3. Perfis de Execução (Docker Compose Profiles)

O `docker-compose.yml` define três perfis. **Sem `--profile`, nenhum serviço sobe.**

| Perfil | Serviços | Uso |
| :--- | :--- | :--- |
| `dev` | postgres, ollama, ollama-pull, backend-dev, frontend-dev, sonar_db, sonarqube, sonar-scanner | Desenvolvimento com hot reload e análise de qualidade |
| `test` | postgres-test (descartável, em memória), backend-tests | Execução dos testes do backend |
| `prod` | postgres, ollama, ollama-pull, backend, frontend | Somente o necessário para rodar a aplicação (imagens otimizadas, sem bind mounts) |

> `dev` e `prod` publicam as mesmas portas (3000 e 8080) e o mesmo banco: execute um por vez (`docker compose --profile dev down` antes de trocar).

#### Desenvolvimento

```bash
docker compose --profile dev up --build -d
docker compose --profile dev logs -f backend-dev frontend-dev
docker compose --profile dev down
```

#### Testes

```bash
docker compose --profile test run --rm backend-tests
docker compose --profile test down
```

#### Produção

```bash
docker compose --profile prod up --build -d
docker compose --profile prod down
```

> Em produção, `NEXT_PUBLIC_API_URL` é embutida no frontend durante o build. Se alterá-la, reconstrua com `--build`. Revise também no `.env` os segredos (`JWT_SECRET`, senhas) e `CORS_ALLOWED_ORIGINS`/`FRONTEND_URL`.

> Dentro do Docker, o compose sobrescreve `SPRING_DATASOURCE_URL` (`postgres:5432`) e `OLLAMA_BASE_URL` (`http://ollama:11434`) para o backend, independentemente do valor no `.env`.

#### Validar a configuração

```bash
docker compose --profile dev config --services
docker compose --profile test config --services
docker compose --profile prod config --services
```

### 4. Acompanhar a Inicialização

Durante a inicialização (`dev` ou `prod`), os serviços realizam as seguintes operações:

1. **Ollama:** o serviço `ollama-pull` baixa os modelos `phi3` e `mxbai-embed-large`.
2. **PostgreSQL:** inicia o banco de dados e executa o `init.sql`, quando aplicável à inicialização do volume.
3. **Backend:** inicia conforme as dependências e as condições de disponibilidade configuradas no Docker Compose.
4. **SonarQube (somente `dev`):** inicia o serviço de análise de qualidade, podendo levar alguns minutos.

Para verificar o estado dos containers (use o perfil em execução):

```bash
docker compose --profile dev ps
```

Para acompanhar os logs de todos os serviços:

```bash
docker compose --profile dev logs -f
```

### 5. Endereços de Acesso

| Serviço | Endereço | Perfis |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:3000](http://localhost:3000) | dev, prod |
| **Backend (Swagger/API)** | [http://localhost:8080](http://localhost:8080) | dev, prod |
| **SonarQube** | [http://localhost:9000](http://localhost:9000) | dev |
| **Ollama API** (somente localhost) | [http://localhost:11434](http://localhost:11434) | dev, prod |
| **PostgreSQL** (somente localhost) | `localhost:5432` | dev, prod |

> **SonarQube:** em uma instalação inicial, as credenciais padrão costumam ser `admin` / `admin`. O sistema pode solicitar a alteração da senha no primeiro acesso.

---

## Qualidade de Código (SonarQube)

SonarQube e `sonar-scanner` pertencem **somente ao perfil `dev`**. O `sonar-scanner` roda os testes, gera o relatório Jacoco, envia ao SonarQube e finaliza.

### Executar uma Nova Análise

```bash
docker compose --profile dev run --rm sonar-scanner
```

Para acompanhar os logs do processo:

```bash
docker compose --profile dev logs -f sonar-scanner
```
Os resultados da análise ficam disponíveis no dashboard do SonarQube:

[http://localhost:9000/dashboard?id=Inova27](http://localhost:9000/dashboard?id=Inova27)

---

## Validação e Troubleshooting

### 1. Verificar o Status dos Serviços

Liste os containers e seus estados:

```bash
docker compose ps
```

Para consultar os logs de um serviço específico:

```bash
docker compose logs <nome-do-servico>
```

Substitua `<nome-do-servico>` pelo nome do serviço definido no Docker Compose.

### 2. Verificar os Modelos do Ollama

Para conferir se os modelos foram baixados corretamente, execute:

```bash
docker exec -it inova27-ollama ollama list
```

A listagem deverá conter os modelos `mxbai-embed-large` e `phi3`.

> **Nota:** o nome `inova27-ollama` deve corresponder ao nome real do container criado pelo Docker Compose. Confira esse nome usando `docker compose ps` caso o comando não funcione.

### 3. Problemas Comuns

| Problema | Causa Provável | Solução |
| :--- | :--- | :--- |
| **Erro de conexão com o Ollama** | URL incorreta no `.env` ou serviço indisponível | Se o backend estiver dentro do Docker, confira se `OLLAMA_BASE_URL` está configurada como `http://ollama:11434`. |
| **Porta 5432 ocupada** | PostgreSQL nativo em execução no host ou outro container utilizando a porta | Pare o serviço conflitante ou ajuste o mapeamento de portas no `docker-compose.yml`. |
| **SonarQube lento ou reiniciando** | Recursos insuficientes para o container | Verifique a memória disponível para o Docker e os logs do SonarQube. |
| **Modelos não encontrados** | Serviço `ollama-pull` falhou ou ainda está executando | Consulte os logs com `docker compose logs ollama-pull`. |
| **Erro de permissão no Gradle** | Arquivo `gradlew` sem permissão de execução no Linux | Execute `chmod +x backend/gradlew` no host, caso o projeto utilize esse caminho. |
| **Backend não inicia** | Variáveis de ambiente ausentes, banco indisponível ou configuração incorreta | Consulte os logs com `docker compose logs <nome-do-servico>` e confira as variáveis do `.env`. |
| **Banco não contém a extensão ou tabela esperada** | Volume existente não executou novamente o script de inicialização | Verifique se o `init.sql` foi aplicado. Evite remover volumes sem antes fazer backup dos dados. |

---

*Desenvolvido para o INOVA27 - 2026*
