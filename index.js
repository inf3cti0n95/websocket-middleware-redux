var createStore  = require("redux").createStore;
var applyMiddlware = require("redux").applyMiddleware;
var WebSocketMiddleware = require("./websocketMiddleware");
const wsm = new WebSocketMiddleware("wss://demo.rocket.chat/websocket");

const reducer = function(state,action){

	switch(action.type){
        case "login":
        let respId = wsm.reqLogin(action.username,action.password);
        wsm.msgMapper.push({method:"login",respId:respId});
        break;
	
	default:
		return state;        

	}

};


const store = createStore(reducer,{},applyMiddlware(wsm.middleware()));

store.subscribe(()=>{
	console.log("Subscribe",store.getState());
});

// store.dispatch({type:"INC",number:2})
store.dispatch({type:"INIT"});
wsm.ws.once("open",()=>{
	console.log("here");
	store.dispatch({type: "login",username:"user1",password:"password"});
});
