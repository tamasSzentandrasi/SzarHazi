var SenecaWeb = require('seneca-web')
var Express = require('express')
var Router = Express.Router
var context = new Router()

var senecaWebConfig = {
      context: context,
      adapter: require('seneca-web-adapter-express'),
      options: { parseBody: false }
}

var app = Express()
      .use( require('body-parser').json() )
      .use( context )
      .listen(3000)

var seneca = require('seneca')()
      .use(SenecaWeb, senecaWebConfig )
	  .use('flight_service')
	  .use('car_service')
	  .use('hotel_service')
      .use('booking_service')
      .client( { type:'tcp', pin:'role:book' } )
	  .act('role:flight,cmd:add, flight_id: 1234,from: Asdtown,to: Dsatown, datetime: 2017/12/16 12:35-13:50, price: 123,levels: 2, width: 4, length: 5',console.log)