const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');

io.on('connection', socket => {
  socket.on('message', ({ name, message }) => {
    io.emit('message', { name, message })
  })
})
app.get('/data', (req, res) => {
  res.send('Hello World!')
})

const program = async () => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });

  const instance = new MySQLEvents(connection, {
    startAtEnd: true,
    excludedSchemas: {
      mysql: true,
    },
  });

  await instance.start();

  instance.addTrigger({
    name: 'TEST',
    expression: '*',
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: (event) => { // You will receive the events here
      console.log(event);
      const a={ name: "mum", message: "Hello from DB change event" }
      io.on('connection',
       
          io.emit('message', a)
       
      )
    },
  });
  
  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
  .then(() => console.log('Waiting for database events...'))
  .catch(console.error);





http.listen(4000, function() {
  console.log('listening on port 4000')
})
