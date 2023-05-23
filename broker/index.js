const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
    cors: {
        origin: "*"
      }
});
var amqplib = require('amqplib/callback_api');

var APPRABMQ
try {
    amqplib.connect('amqp://localhost', function(error0, conn) {			
    if (error0) {
        throw error0;
    }
    APPRABMQ=conn
})
} catch (error) {
    throw error
}


io.on('connection', (socket) => {
    socket.on('results', (res)=>{
        let qmsg = JSON.stringify(res)
        if(APPRABMQ){
            APPRABMQ.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }
                channel.assertQueue('', {
                    exclusive: true
                  }, function(error2, q) {
                    if (error2) {
                      throw error2;
                    }
                    var correlationId = generateUuid();

                    channel.consume(q.queue, function(msg) {
                      if (msg.properties.correlationId == correlationId) {
                        console.log(msg.content.toString());
                        socket.emit("response", msg.content.toString());
                      }
                    }, {
                      noAck: true
                    });
              
                    channel.sendToQueue('rpc_queue',
                      Buffer.from(qmsg),{
                        correlationId: correlationId,
                        replyTo: q.queue });
                  });
                
            });
        		
		} else {
			socket.emit('RabbitMQ is off',function(sresp){});
		}
    })
  });
  
  server.listen(3001, () => {
    console.log('listening on *:3001');
  });


function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }