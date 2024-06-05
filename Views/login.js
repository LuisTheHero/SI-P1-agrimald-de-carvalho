const mysql = require("mysql");//Este linha importa o módulo mysql para o seu script. permitindo assim q o node possa se conectar e trabalhe com a BD
const express = require("express");//Este linha importa o módulo express para o seu script. O express é um framework minimalista e flexível para Node.js que facilita a criação de apps web e APIs.
const bodyParser = require("body-parser");//Este comando importa o módulo body-parser para o seu script. 
//O body-parser é um middleware que analisa o corpo das solicitações HTTP e o converte em um objeto JavaScript acessível através de req.body.
const path = require("path");
    const app = express();

    app.use("/views", express.static("views"));
    app.set('view engine', 'ejs');  
    app.set('views', path.join(__dirname, 'views'));
    app.use("/assets", express.static("assets")); //Essa linha define um middleware q ajuda arquivos estáticos. Quedze* q qualquer arquivo na pasta assets pode ser acessado pelo navegador. 
    app.use("/home", express.static("home")); //Essa linha define um middleware q ajuda arquivos estáticos. Quedze* q qualquer arquivo na pasta home pode ser acessado pelo navegador.
    app.use("/views", express.static("views"));

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


//1 - PRIMEIRO CRUD: LOGIN AND REGISTER


    app.use(bodyParser.urlencoded({ extended: true }));//adiciona body-parser à app Express:Ele analisa dados codificados em URL (formularios via post) 
    // transforma em um objeto JavaScript acessível através de req.body. O parâmetro extended: true permite que objetos aninhados sejam analisados corretamente.
    app.use(bodyParser.json());

    bodyParser.urlencoded({ extended: true });
    
    app.get("/G", function (req, res) {
        res.sendFile(__dirname + "/home/index.html");
    });
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



//2 - SEGUNDO CRUD: DEPOIMENTOS

app.get("/depoimento", function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'home', 'depoimento.html'));
});

app.post("/depoimento", function (req, res) {
    const name = req.body.name;
    const depoi = req.body.depoimento;

    console.log(name, depoi);

    const sql = 'INSERT INTO depoimento (name, depoi) VALUES (?, ?)';
    connection.query(sql, [name, depoi], function (err, result) {
        if (err) throw err;

        console.log("Depoimento enviado.");
        res.redirect('/depoimentos');
    });
});

// Rota para exibir a lista de depoimentos
app.get("/depoimentos", function(req, res) {
    const sql = "SELECT * FROM depoimento";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            console.error("Erro ao consultar depoimentos:", error);
            return res.status(500).send("Erro no servidor");
        }

        // Renderiza a visualização "display" passando a lista de depoimentos
        res.render("display", { depoimentos: results });
    });
});

// Rotas para atuzalizar depoimentos
app.get("/update", function(req, res) {
    connection.connect(function (error) {
        if (error) console.log(error)
        
        var sql = "select * from depoimento where id =?;";

        var id = req.query.id

        connection.query(sql,[id], function(error,results) {
        if (error) console.log( error);

        // Renderiza a visualização "display" passando a lista de depoimentos
        res.render("update", { depoimentos: results });
    });
    })
});

app.post("/updateData", function(req,res){
    var name = req.body.name;
    var depoi = req.body.depoimento;
    var id = req.body.id;

    console.log(name,depoi,id);

    var sql = "update depoimento set name=? , depoi=? where id=?;";

    connection.query(sql,[name,depoi,id],function(error,result){
        if (error) console.log(error);

        console.log("data updated");
        res.redirect("/")
    })
})

app.get("/delete",function(req,res){

    connection.connect(function(err){
        if (err) console.log(err);

        var sql = "delete from depoimento where id=?";

        var id = req.query.id;

        connection.query(sql,[id],function(error,result){

            if (error) console.log(error);

            res.redirect("/")
        })
    })
})


//3 - TERCEIRO CRUD: 

app.get("/expecialidades", function (req, res) {
    res.sendFile(path.join(__dirname, 'home', 'expecialidades.html'));
});

app.post("/expecialidades", function (req, res) {
    const name = req.body.name;
    const expecialidades = req.body.expecialidades;

    console.log(name, expecialidades);

    const sql = 'INSERT INTO expecialidades (name, expecialidades) VALUES (?, ?)';
    connection.query(sql, [name, expecialidades], function (err, results) {
        if (err) throw err;

        console.log("Especialidade enviado.");
        res.redirect('/display3x');
    });
});

// Rota para exibir a lista de expecialidades
app.get("/display3x", function(req, res) {
    const sql = "SELECT * FROM expecialidades";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            console.error("Erro ao consultar expecialidades:", error);
            return res.status(500).send("Erro no servidor");
        }

        // Renderiza a visualização "display" passando a lista de expecialidades
        res.render("display3x", { expecialidades: results });
    });
});

// Rotas para atuzalizar expecialidades
app.get("/update3x", function(req, res) {
    connection.connect(function (error) {
        if (error) console.log(error)
        
        var sql = "select * from expecialidades where id =?;";

        var id = req.query.id

        connection.query(sql,[id], function(error,results) {
        if (error) console.log( error);

        // Renderiza a visualização "display" passando a lista de expecialidades
        res.render("update3x", { expecialidades: results });
    });
    })
});

app.post("/updateData3x", function(req,res){
    var name = req.body.name;
    var expecialidades = req.body.expecialidades;
    var id = req.body.id;

    console.log(name,expecialidades,id);

    var sql = "update expecialidades set name=? , expecialidades=? where id=?;";

    connection.query(sql,[name,expecialidades,id],function(error,results){
        if (error) console.log(error);

        console.log("expecialidades updated");
        res.redirect("/")
    })
})

app.get("/delete3x",function(req,res){

    connection.connect(function(err){
        if (err) console.log(err);

        var sql = "delete from expecialidades where id=?";

        var id = req.query.id;

        connection.query(sql,[id],function(error,result){

            if (error) console.log(error);
            
            res.redirect("/")
        })
    })
})

//4 - TERCEIRO CRUD: 

app.get("/videoaula", function (req, res) {
    res.sendFile(path.join(__dirname, 'home', 'videoaula.html'));
});

app.post("/videoaula", function (req, res) {
    const name = req.body.name;
    const videoaula = req.body.videoaula;

    console.log(name, videoaula);

    const sql = 'INSERT INTO videoaula (name, videoaula) VALUES (?, ?)';
    connection.query(sql, [name, videoaula], function (err, results) {
        if (err) throw err;

        console.log("Especialidade enviado.");
        res.redirect('/display4x');
    });
});

// Rota para exibir a lista de videoaula
app.get("/display4x", function(req, res) {
    const sql = "SELECT * FROM videoaula";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            console.error("Erro ao consultar videoaula:", error);
            return res.status(500).send("Erro no servidor");
        }

        // Renderiza a visualização "display" passando a lista de videoaula
        res.render("display4x", { videoaula: results });
    });
});

// Rotas para atuzalizar videoaula
app.get("/update4x", function(req, res) {
    connection.connect(function (error) {
        if (error) console.log(error)
        
        var sql = "select * from videoaula where id =?;";

        var id = req.query.id

        connection.query(sql,[id], function(error,results) {
        if (error) console.log( error);

        // Renderiza a visualização "display" passando a lista de videoaula
        res.render("update4x", { videoaula: results });
    });
    })
});

app.post("/updateData4x", function(req,res){
    var name = req.body.name;
    var videoaula = req.body.videoaula;
    var id = req.body.id;

    console.log(name,videoaula,id);

    var sql = "update videoaula set name=? , videoaula=? where id=?;";

    connection.query(sql,[name,videoaula,id],function(error,results){
        if (error) console.log(error);

        console.log("videoaula updated");
        res.redirect("/")
    })
})

app.get("/delete4x",function(req,res){

    connection.connect(function(err){
        if (err) console.log(err);

        var sql = "delete from videoaula where id=?";

        var id = req.query.id;

        connection.query(sql,[id],function(error,result){

            if (error) console.log(error);
            
            res.redirect("/")
        })
    })
})


// Iniciar o servidor Express na porta 
const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
    console.log(`Servidor rodando na porta: http://localhost:${PORT}/`);
});
