# INOVA27 - Ecossistema Acadêmico de Inovação

Plataforma acadêmica estruturada em microsserviços conteinerizados, focada em inovação tecnológica e busca semântica assistida por Inteligência Artificial.

---
## Sumário

1. [Visão Geral](#visão-geral)
2. [Tecnologias](#tecnologias)
3. [Pré-requisitos](#pré-requisitos)
4. [Execução do Projeto](#execução-do-projeto)
5. [Qualidade de Código (SonarQube)](#qualidade-de-código-sonarqube)
6. [Validação e Troubleshooting](#validação-e-troubleshooting)

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
- `MAIL_USERNAME` / `MAIL_PASSWORD`: credenciais para envio de e-mails, utilizando uma senha de aplicativo do Gmail quando aplicável.
- `OLLAMA_BASE_URL`: endereço da API do Ollama.
  - Para o backend executado **dentro do Docker**: `http://ollama:11434`
  - Para o backend executado **fora do Docker**: `http://localhost:11434`

Verifique também se as demais variáveis exigidas pelo arquivo `docker-compose.yml` estão configuradas corretamente.

#### 2.2. Inicialização do Banco de Dados

O arquivo `init.sql`, localizado na raiz do projeto, é montado no container PostgreSQL para criar a extensão `vector` e a tabela `busca_semantica`, necessárias à funcionalidade de busca semântica.

> **Importante:** scripts de inicialização do PostgreSQL normalmente são executados apenas quando o diretório de dados do banco é inicializado pela primeira vez. Caso o volume já contenha dados, alterações no `init.sql` não serão aplicadas automaticamente.

### 3. Iniciar os Containers

Execute o comando abaixo para construir as imagens e iniciar os serviços em segundo plano:

```bash
docker compose up --build -d
```

### 4. Acompanhar a Inicialização

Durante a inicialização, os serviços realizam as seguintes operações:

1. **Ollama:** o serviço `ollama-pull` baixa os modelos `phi3` e `mxbai-embed-large`.
2. **PostgreSQL:** inicia o banco de dados e executa o `init.sql`, quando aplicável à inicialização do volume.
3. **Backend:** inicia conforme as dependências e as condições de disponibilidade configuradas no Docker Compose.
4. **SonarQube:** inicia o serviço de análise de qualidade, podendo levar alguns minutos.

Para verificar o estado dos containers, execute:

```bash
docker compose ps
```

Para acompanhar os logs de todos os serviços:

```bash
docker compose logs -f
```

### 5. Endereços de Acesso

Após a inicialização dos serviços, acesse as aplicações pelos endereços abaixo:

| Serviço | Endereço |
| :--- | :--- |
| **Frontend** | [http://localhost:3000](http://localhost:3000) |
| **Backend (Swagger/API)** | [http://localhost:8080](http://localhost:8080) |
| **SonarQube** | [http://localhost:9000](http://localhost:9000) |
| **Ollama API** | [http://localhost:11434](http://localhost:11434) |

> **SonarQube:** em uma instalação inicial, as credenciais padrão costumam ser `admin` / `admin`. O sistema pode solicitar a alteração da senha no primeiro acesso.

---

## Qualidade de Código (SonarQube)

O projeto possui um container `sonar-scanner` configurado para executar a análise de código. Conforme a configuração do Docker Compose, essa análise é executada durante a inicialização do ambiente.

### Executar uma Nova Análise

Para reiniciar o serviço de análise, execute:

```bash
docker compose restart sonar-scanner
```

Para acompanhar os logs do processo:

```bash
docker compose logs -f sonar-scanner
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