require('dotenv').config();
const express = require('express');
const app = express();
const hbs = require('hbs')
const bodyparser = require('body-parser')
const port = process.env.PORT;
const path = require("path");
require("./db/conn");
const static_path = path.join(__dirname, "./public");
const templatepath = path.join(__dirname, "./templates/view/user");
const partialpath = path.join(__dirname, "./templates/partials");

app.use(express.static(static_path));


app.set('view engine','hbs');
app.set('views',templatepath)
hbs.registerPartials(partialpath);

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}))

//use routers
const indexRouter = require('./router/index')
app.use('/',indexRouter);
const registerRouter = require('./router/registers')
app.use('/',registerRouter);

// admin route
const adminRouter = require('./router/adminRoute')
app.use('/admin',adminRouter);



app.use('/css',express.static(path.join(__dirname,"./node_modules/bootstrap/dist/css")));

app.use('/js',express.static(path.join(__dirname,"./node_modules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"./node_modules/jquery/dist")));





app.get("*", function (req, res) {
    res.render("404");
  });
  

app.listen(port, () => {

    console.log(`Server is running at port no ${port} `)
})
