const express = require('express');

var app = express();//creates the app
const hbs = require('hbs');
const fs = require('fs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear',() =>{
    return new Date().getFullYear();
});//2 arguments: name of the helper and second argument, the function to execute. Poti executa functii in partials.
app.set('view engine',hbs);//key-value pair
app.use((req,res,next) => {//the function is executed every time the app receives a request 
    var now = new Date().toString();
    //console.log(`${now}`);
    var log = `${now}: ${req.method} ${req.url}`;//req.method->represents the http method(GET for example), and req.url represents the path. 
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) =>{
        if(err){
            console.log('Unable to append to server.log');
        }
    });
    next();//if we dont call next, it wont fire app.get. Moves to the next piece of the middleware 
});//app.use is how you register middleware. We might make a database request to see if a user is authentificated. We use next to tell express when we are done 
app.use((req,res)=> {
    res.render('mantenance.hbs');
    //by not calling next, every request will stop here
});
app.use(express.static(__dirname + '/public')) //takes the absolute path to the folder you want to serve up. __dirname stores the path to the projects directory. It store the path to node-web-server 
//it is this way because when moving the project from place to place, you might have different directory names. 
hbs.registerHelper('screamIt', (text) =>{
    return text.toUpperCase();
    
});
app.get('/', (req,res) =>{//root route: localhost:3000
    //res.send('<h1>Hello, is it me you re looking fou ?!</h1>');//response for the http request, so when someone views the website, they will going too see this string, if they make a request for the application they will get this back as data
    /*res.send({//Content-Type: application/json: this content type tells the requester wheter is an android phone, ios or browser and it should parse it as such 
        name:'Vlad',
        likes:[
            'Pizza',
            'Ice Cream'
        ]
    });*///when you pass an object, express notices that and it takes it, it converts it into JSON and it sends it back to the browser
    res.render('home.hbs', {//view folder is the default folder where it will look up for the files 
        welcomeMessage:'Welcome to my website',
        pageTitle:'Home',
        //currentYear: new Date().getFullYear()
        //nu mai avem nevoie pentru ca am inregistrat un helper function
    });
})//handler for a http get request. First argument is the URL -> in our case it's the root of the app. The second argument is the function to run(tells express what to send back to the person who made the request)
//req stores information about the request coming in(headers used, body information )
//res used to responde to the http request in every way you want -> customize data you want to send back 

app.listen(3000, () =>
{
    console.log('Server is up on port 3000');// aditional function that executes 
});//binds the application to a port on our machine. 3000 is a common port for developing locally. Is going to listen to requests until you tell it to stop.

//At response header we have Content-Type: tells the client what type of data came back. It could be a HTML website, text, JSON data and the client could be a web browser,iphone android device..
//In our case we are telling the browser that what came back is a text/html -> automagically set out by express. 
//in the <h1>Hello, is it me you re looking fou ?!</h1> case the browser renders using its default styles. 

app.get('/about', (req, res) => {//this is the second route
    //res.send('About page'); //localhost:3000/about
    res.render('about.hbs',{
        pageTitle: 'About page',
        ///currentYear: new Date().getFullYear()
    });//helps you render any of the templates you have set up with your current view engine. Rendered is like processing. Second argument for passing data
    //res.send('About page') case was rendered by html.
});

app.get('/bad', (req, res) =>{
    res.send({
        errorMessage:'Error'
    });
});
//Until now we explored 2 ways of serving files to the browser(specifying the routes and by using static files)
//The third solution is by using a templating engine: lets you render html but lets you do it in a dynamic way(inject values inside of the template, kind of like you would in ruby or php)
//Using this templating engine, you will be able to create reusable markup for things like a header or a footer which will be the same on many of your pages. 
//MODULE for the engine: handlebarsjs(hbs on npm) Other view engines: ejs, pug 

//views is the default directory that the express uses for your templates 