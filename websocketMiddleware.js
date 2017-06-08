const WebSocket = require ("ws");
const ManipulationMethods = require("./manipulationMethods");

class WebSocketMiddleware extends ManipulationMethods{
	constructor(url){
		super();
		this.ws = new WebSocket(url);
		this.msgMapper = [];
		this.ws.addEventListener("open", this.open.bind(this));
		this.ws.addEventListener("close",this.close.bind(this));
	}
	message(msg){
		let data = JSON.parse(msg.data);
		let type;
		console.log(data);
		if(data.msg)
			type = data.msg;
		switch (type){
		case "ping":
			this.send({"msg":"pong"});
			break;
		case "result":
			console.log(this.resultMapper(data));
			break;
		}
	}
	open(event){
		this.status = "OPEN";
		this.send({"msg":"connect","version":"1","support":["1","pre2","pre1"]});
		this.ws.addEventListener("message",this.message.bind(this));

	}
	close(event){
		console.log("close");
	}
	middleware() {
		return (state) => (next) => (action) => {
			this.dispatch = state.dispatch;
			this.next = next;
			if(this.status === "OPEN"){
				switch(action.type){
				
				default:
					break;
				}
			}
			next(action);
		};
	}
	send(data){
		this.ws.send(JSON.stringify(data));
	}
	resultMapper(data){
		let respId = data.id;
		let resp;
		this.msgMapper = this.msgMapper.filter((msg) => {
			if(msg.respId === eval(respId)){
				resp = msg;
				return false;
			}
			else{
				return true;
			}
		} );
		if(data.result)
			resp.result = data.result;
		else
        resp.result = data.error;
		return resp;
	}
}

module.exports =  WebSocketMiddleware;