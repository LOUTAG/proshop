const express = require("express");
const cors = require('cors');
const app = express();

/*** middlewares ***/
app.use(cors())
app.use(express.json());

app.get('/', (req, res)=>{
    res.json('ok');
})

/*** PORT ***/
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`app running port ${PORT}`));
