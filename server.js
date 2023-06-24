var express = require('express');
var app = express();
var ejs = require("ejs");
const bodyParser = require('body-parser')

require('dotenv').config()

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
var jsonParser = bodyParser.json()
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')


const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.encrypted_api_key,
  })

var answer = [];

app.get('/', (req, res) => {
  res.render("index",{
    gptanswer : null,
})
});



app.post("/",function (req,res) {

  answer.splice(0, answer.length);

  async function getAiResponse(topic) {
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: topic,
      max_tokens: 1024,
      n: 1,
      stop: null,
      temperature: 0.7
    });
    var response = completion.data.choices[0].text;
    answer.push(response)
    console.log(completion.status)

    res.render("index",{
      gptanswer : answer,
  })


  }
  getAiResponse(req.body.query);
  console.log(getAiResponse)
})


app.listen(process.env.PORT || 3000, () => {
    console.log('Chatbot listening on port 3000!');
});
