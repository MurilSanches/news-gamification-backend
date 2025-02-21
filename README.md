# 📢 The News - Gamificação

## 📌 Sobre o Projeto

Este projeto implementa um sistema de **gamificação** para aumentar o engajamento dos leitores da newsletter do **The News**. Os usuários acumulam **streaks** ao abrir as newsletters regularmente, e podem visualizar suas estatísticas através de uma interface web. Além disso, um **painel administrativo** permite acompanhar métricas de engajamento.

## 🚀 Tecnologias Utilizadas

### **Backend**
- **Node.js** (Runtime JavaScript)
- **Express.js** (Framework para API)
- **TypeScript** (Tipagem Estática)
- **PostgreSQL** (Banco de Dados relacional)
- **Supabase** (Serviço de banco de dados e autenticação)
- **Postgres.js** (Cliente PostgreSQL otimizado para Node.js)

## 📂 Estrutura do Projeto

```
backend/
│── src/
│   ├── constants/            # Constantes globais do projeto
│   ├── controllers/          # Lógica de negócios das rotas
│   ├── database/             # Conexão com PostgreSQL (Supabase)
│   ├── middleware/           # Middlewares de tratamento de erro e autenticação
│   ├── routes/               # Definição das rotas da API
│   ├── services/             # Serviços que contêm regras de negócio e consultas ao BD
│   ├── utils/                # Utilitários globais do projeto
│   ├── server.ts             # Arquivo principal do servidor
│── .env                      # Configurações sensíveis do ambiente
│── package.json              # Dependências e scripts do projeto
│── README.md                 # Documentação do projeto
```

## 🛠️ Configuração e Instalação

### **1️⃣ Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/the-news-gamification.git
cd the-news-gamification/backend
```

### **2️⃣ Instale as Dependências**
```bash
npm install
```

### **3️⃣ Configurar Variáveis de Ambiente**
Crie um arquivo **`.env`** no diretório `backend/` e adicione suas credenciais do **Supabase**:

```
DATABASE_URL=SUA_URL_SUBAPASE
PORT=5000
```

### **4️⃣ Rodar o Servidor**
```bash
npm run dev
```
Se a conexão for bem-sucedida, você verá:
```bash
✅ Conexão com o banco bem-sucedida!
🚀 Servidor rodando na porta 5000
```

## 📌 Endpoints da API

### **1️⃣ Receber Webhook de Abertura de Newsletter**
```http
GET /webhook?email={email}&id={newsletter_id}
```
📌 **Descrição**: Registra a abertura da newsletter por um usuário.

---

### **2️⃣ Obter Streaks de um Usuário**
```http
GET /user/{email}
```
📌 **Descrição**: Obtém o streak atual e o histórico de um usuário.

---

### **3️⃣ Obter Estatísticas Administrativas**
```http
GET /admin/stats
```
📌 **Descrição**: Obtém estatísticas gerais do sistema, como total de usuários, usuário com maior streak e a newsletter mais visualizada.

---

### **4️⃣ Obter Análise de Acessos**
```http
GET /admin/analytics
```
📌 **Descrição**: Obtém dados de acessos diários e horários para análise.

---

### **5️⃣ Obter Ranking de Engajamento**
```http
GET /admin/ranking?type={users|newsletters}&order={asc|desc}&start_date={YYYY-MM-DD}&end_date={YYYY-MM-DD}&page={num}&limit={num}
```
📌 **Descrição**: Retorna um ranking dos usuários ou das newsletters mais engajadas.

## 📂 Collection do Postman

Para facilitar a utilização e testes da API, disponibilizamos uma **Collection do Postman** contendo todas as rotas documentadas.

📥 **Download da Collection**:
[Baixar Collection Postman](./waffle.postman_collection.json)

📌 **Como importar no Postman**:
1. Abra o Postman
2. Vá em **File** > **Import**
3. Selecione o arquivo `postman_collection.json`
4. Acesse os endpoints diretamente no Postman para testar a API


## ✅ Melhorias Futuras
- 🏆 Implementação de **badges e conquistas** para incentivar os usuários.
- 🔔 **Notificações via e-mail** para manter os streaks.

## 📝 Licença
Este projeto é de uso interno e pode ser utilizado para fins educacionais.

---

_Desenvolvido com ❤️ por Murilo Sanches_ 🚀