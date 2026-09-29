# INOVA27

Plataforma acadêmica de inovação tecnológica, estruturada com um ecossistema moderno em containers.

## 🛠️ Tecnologias Utilizadas
* **Frontend:** React / Next.js
* **Backend:** Java 21 + Spring Boot
* **Banco de Dados:** PostgreSQL com extensão `pgvector`
* **Qualidade de Código:** SonarQube
* **Infraestrutura:** Docker e Docker Compose

---

## ⚙️ Pré-requisitos
Por utilizar uma arquitetura totalmente baseada em containers, você precisa apenas de:
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
* Git

---

## 🚀 Como executar o projeto localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/inova27.git
cd inova27
```

### 2. Subir todos os serviços
O `docker-compose.yml` já orquestra o Frontend, Backend, Banco de Dados e as ferramentas de qualidade de código. Na raiz do projeto, execute o comando abaixo para construir as imagens e subir tudo em background:

```bash
docker-compose up --build -d
```
*Nota: O parâmetro `--build` garante que o Docker compile as últimas versões do seu código nas pastas `./backend` e `./frontend`.*

### 3. Acessar a aplicação
Aguarde alguns instantes para que todos os serviços fiquem "saudáveis" (*healthy*). Depois, acesse:

* **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
* **Backend (Spring Boot):** [http://localhost:8080](http://localhost:8080)
* **Banco de Dados (PostgreSQL):** `localhost:5432`
* **SonarQube:** [http://localhost:9000](http://localhost:9000) *(Demora cerca de 2 minutos para inicializar na primeira execução)*

---

## 📊 Análise de Qualidade de Código (SonarQube)

O projeto inclui um container exclusivo (`sonar-scanner`) configurado com JDK 21 e Gradle 8. Ele roda os testes, gera o relatório Jacoco e envia automaticamente para o painel do SonarQube.

Ele é executado **uma única vez** quando você sobe o projeto. Caso você altere o código do backend e queira rodar uma nova análise manualmente, basta reiniciar apenas esse container:

```bash
docker-compose restart sonar-scanner
```
