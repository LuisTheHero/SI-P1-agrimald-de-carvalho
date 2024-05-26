const mysql = require("mysql");//Este linha importa o módulo mysql para o seu script. permitindo assim q o node possa se conectar e trabalhe com a BD
const express = require("express");//Este linha importa o módulo express para o seu script. O express é um framework minimalista e flexível para Node.js que facilita a criação de apps web e APIs.
const bodyParser = require("body-parser");//Este comando importa o módulo body-parser para o seu script. 
//O body-parser é um middleware que analisa o corpo das solicitações HTTP e o converte em um objeto JavaScript acessível através de req.body.

const app = express();//Essa linha inicializa uma app Express. Dps Ele retorna uma parte da aplicação que pode ser usada para definir rotas e middlewares.
app.use("/assets", express.static("assets")); //Essa linha define um middleware q ajuda arquivos estáticos. Quedze* q qualquer arquivo na pasta assets pode ser acessado pelo navegador. 
app.use("/home", express.static("home")); //Essa linha define um middleware q ajuda arquivos estáticos. Quedze* q qualquer arquivo na pasta home pode ser acessado pelo navegador.
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "nodejs"
});
//Esta zona cria uma conexão com um banco de dados MySQL. O objeto passado para mysql.createConnection contém as informações de conexão

// Conectar ao banco de dados
connection.connect(function (error) {
    if (error) throw error;
    console.log("Conectado ao banco de dados com sucesso!");
});

app.use(bodyParser.urlencoded({ extended: true }));//adiciona body-parser à app Express:Ele analisa dados codificados em URL (formularios via post) 
// transforma em um objeto JavaScript acessível através de req.body. O parâmetro extended: true permite que objetos aninhados sejam analisados corretamente.


bodyParser.urlencoded({ extended: true });
// Rota para a URL raiz
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.redirect("/");
    }

    const query = "SELECT * FROM loginuser WHERE user_name = ? AND user_pass = ?";
    connection.query(query, [username, password], function (error, results) {
        if (error) {
            console.error("Erro ao executar a consulta:", error);
            return res.status(500).send("Erro no servidor");
        }

        if (results.length > 0) {
            res.redirect("/home/index.html"); // Redireciona pra home/index.html se o login for bem-sucedido
            
        } else {
            res.redirect("/"); // Redireciona de volta pra a página inicial se o login falhar
        }
    });
});

// Definir rota POST para a URL raiz ("/"), Esta rota é usada para registrar novos usuários.
app.post("/register", function (req, res) {
    const newUsername = req.body.newUsername;
    const newPassword = req.body.newPassword;

    // Verificar se username ou password não foram fornecidos
    if (!newUsername || !newPassword) {
        return res.redirect("/");// Se faltarem dados, volta pra página inicial
    }
    // Consulta SQL pra inserir novos dados de usuário
    const query = "INSERT INTO loginuser (user_name, user_pass) VALUES (?, ?)";
    connection.query(query, [newUsername, newPassword], function (error, results) {
        if (error) {
            console.error("Erro ao executar a inserção:", error);
            return res.status(500).send("Erro no servidor");
        }

        res.redirect("/"); // Redireciona de volta para a página inicial após o registro bem-sucedido
    });
});
// Definir rota GET para a URL "/welcome"
app.get("/welcome", function (req, res) {
    res.sendFile(__dirname + "/welcome.html");
});

// Iniciar o servidor Express na porta 
const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
    console.log(`Servidor rodando na porta: http://localhost:${PORT}/`);
});
