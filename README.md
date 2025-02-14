Add read me# 📢 The News - Gamificação

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

### **Frontend** (Futuro Desenvolvimento)
- **React.js** (Biblioteca Frontend)
- **TypeScript**

## 📂 Estrutura do Projeto

```
backend/
│── src/
│   ├── controllers/          # Lógica de negócios das rotas
│   ├── routes/               # Definição das rotas da API
│   ├── database/             # Conexão com PostgreSQL (Supabase)
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
DATABASE_URL=postgresql://usuario:senha@db.rgjzcooknxobmsuyvbfj.supabase.co:5432/postgres
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

📥 **Parâmetros**:
- `email` (string) → E-mail do usuário
- `id` (string) → ID da newsletter

📤 **Respostas**:
- ✅ **200 OK** → Registro salvo com sucesso
- ❌ **400 Bad Request** → Faltando parâmetros ou newsletter já registrada
- ❌ **500 Internal Server Error** → Erro no servidor

📌 **Exemplo de Requisição**:
```http
GET /webhook?email=usuario@email.com&id=post_123456
```
📌 **Exemplo de Resposta (sucesso)**:
```json
{
  "data": {
    "id": "post_123456",
    "email": "usuario@email.com",
    "message": "Registro salvo com sucesso!"
  }
}
```

---

### **2️⃣ Obter Streaks de um Usuário**
```http
GET /user/{email}
```
📌 **Descrição**: Obtém o streak atual e o histórico de um usuário.

📥 **Parâmetros**:
- `email` (string) → E-mail do usuário

📤 **Respostas**:
- ✅ **200 OK** → Retorna os streaks do usuário
- ❌ **404 Not Found** → Usuário não encontrado
- ❌ **500 Internal Server Error** → Erro no servidor

📌 **Exemplo de Requisição**:
```http
GET /user/usuario@email.com
```
📌 **Exemplo de Resposta (sucesso)**:
```json
{
  "email": "usuario@email.com",
  "streak": 5,
  "history": ["2025-02-14", "2025-02-13", "2025-02-12", "2025-02-11", "2025-02-10"]
}
```

## 📊 Estrutura do Banco de Dados

### **Tabela `users`**
Armazena os usuários que abriram newsletters.
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Tabela `streaks`**
Armazena os registros de abertura de newsletters.
```sql
CREATE TABLE streaks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    newsletter_id VARCHAR(255),
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ✅ Melhorias Futuras
- 📈 Painel administrativo para visualizar métricas de engajamento.
- 🏆 Implementação de **badges e conquistas** para incentivar os usuários.
- 🔔 **Notificações via e-mail** para manter os streaks.
- 📊 **Gráficos interativos** para estatísticas dos usuários.

## 📝 Licença
Este projeto é de uso interno e pode ser utilizado para fins educacionais.

---

_Desenvolvido com ❤️ por [Seu Nome]_ 🚀

 