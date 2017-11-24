module.exports = function flight_service(options) {
	this.add('role:flight,cmd:reserve', 
		//this.load -> room change
		//this.act -> remove -> then this.act -> add
	this.add('role:flight,cmd:add', 
	this.add('role:flight,cmd:remove', 
	this.add('role:flight,cmd:query', 
		//return list
}