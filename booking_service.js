module.exports = function booking_service(options) {

  //var flight_service = require('flight_service')
  //var this = require('car_service')
  //var this = require('this')
  var seneca = require('seneca')()
  
  this.add('role:book,cmd:reserve,car:true,hotel:true', function reserve(msg, respond) {
	this.act('role:flight', {
		cmd:'reserve',
		flight_id: msg.flight_id,
		from: msg.from,
		to: msg.to,
		datetime: msg.datetime,
		price: msg.price,
		levels: msg.levels,
		width: msg.width,
		length: msg.length,
		reservation_id: msg.reservation_id}, flight_answer)
	this.act('role:car', {
		cmd:'reserve',
		car_id: msg.car_id,
		reservation_id: msg.reservation_id,
		reservation_count: msg.reservation_count,
		from: msg.from,
		to: msg.to}, car_answer)
	this.act('role:hotel', {
		cmd:'reserve',
		hotel_id: msg.hotel_id,
		room: msg.room,
		reservation_id: msg.reservation_id,
		reservation_count: msg.reservation_count,
		from: msg.from,
		to: msg.to}, hotel_answer)
    respond(null, { answer: flight_answer && car_answer && hotel_answer })
  })
  
  this.add('role:book,cmd:reserve,car:false,hotel:true', function reserve(msg, respond) {
	this.act('role:flight', {
		cmd:'reserve',
		flight_id: msg.flight_id,
		from: msg.from,
		to: msg.to,
		datetime: msg.datetime,
		price: msg.price,
		levels: msg.levels,
		width: msg.width,
		length: msg.length,
		reservation_id: msg.reservation_id}, flight_answer)
	this.act('role:hotel', {
		cmd:'reserve',
		hotel_id: msg.hotel_id,
		room: msg.room,
		reservation_id: msg.reservation_id,
		reservation_count: msg.reservation_count,
		from: msg.from,
		to: msg.to}, hotel_answer)
    respond(null, { answer: flight_answer && hotel_answer })
  })
  
  this.add('role:book,cmd:reserve,car:true,hotel:false', function reserve(msg, respond) {
  	this.act('role:flight', {
		cmd:'reserve',
		flight_id: msg.flight_id,
		from: msg.from,
		to: msg.to,
		datetime: msg.datetime,
		price: msg.price,
		levels: msg.levels,
		width: msg.width,
		length: msg.length,
		reservation_id: msg.reservation_id}, flight_answer)
  	this.act('role:car', {
		cmd:'reserve',
		car_id: msg.car_id,
		reservation_id: msg.reservation_id,
		reservation_count: msg.reservation_count,
		from: msg.from,
		to: msg.to}, car_answer)
    respond(null, { answer: flight_answer && car_answer })
  })
  
  this.add('role:book,cmd:reserve,car:false,hotel:false', function reserve(msg, respond) {
	this.act('role:flight', {
		cmd:'reserve',
		flight_id: msg.flight_id,
		from: msg.from,
		to: msg.to,
		datetime: msg.datetime,
		price: msg.price,
		levels: msg.levels,
		width: msg.width,
		length: msg.length,
		reservation_id: msg.reservation_id}, flight_answer)
    respond(null, { answer: flight_answer})
  })

  this.wrap('role:book,cmd:reserve', function (msg, respond) {
    msg.flight_id  = Number(msg.id).valueOf()
	if (msg.car == "true") {
		msg.car_id = Number(msg.car_id).valueOf()
	}
	if (msg.hotel == "true") {
		msg.hotel_id = Number(msg.hotel_id).valueOf()
	}
    this.prior(msg, respond)
  })
  
  this.add('role:book,cmd:add,flight:true', function add_elem(msg, respond) {
	this.act('role:flight', {
		cmd:'add',
		flight_id: msg.flight_id,
		from: msg.from,
		to: msg.to,
		datetime: msg.datetime,
		price: msg.price,
		levels: msg.levels,
		width: msg.width,
		length: msg.length,}, flight_answer)
    respond(null, { answer: flight_answer })
  })
  
  this.add('role:book,cmd:add,car:true', function add_elem(msg, respond) {
	this.act('role:car', {
		cmd:'add',
		car_id: msg.car_id,
		car_type: msg.car_type,
		city: msg.city,
		size: msg.size,
		price: msg.price}, car_answer)
    respond(null, { answer: car_answer })
  })
  
  this.add('role:book,cmd:add,hotel:true', function add_elem(msg, respond) {
	this.act('role:hotel', {
		cmd:'add',
		hotel_id: msg.hotel_id,
		hotel_name: msg.hotel_name,
		city: msg.city,
		price: msg.price,
		rooms: msg.rooms}, hotel_answer)
    respond(null, { answer: hotel_answer })
  })

  this.wrap('role:book,cmd:add', function (msg, respond) {
    if (msg.flight == "true") {
		msg.flight_id  = Number(msg.id).valueOf()
	}
	else if (msg.car == "true") {
		msg.car_id = Number(msg.car_id).valueOf()
	}
	else if (msg.hotel == "true") {
		msg.hotel_id = Number(msg.hotel_id).valueOf()
	}
    this.prior(msg, respond)
  })
  
  this.add('role:book,cmd:remove,flight:true', function remove_elem(msg, respond) {
	this.act('role:flight', {
		cmd:'remove',
		flight_id:msg.flight_id}, flight_answer)
    respond(null, { answer: flight_answer })
  })
  
  this.add('role:book,cmd:remove,car:true', function remove_elem(msg, respond) {
	this.act('role:car', {
		cmd:'remove',
		car_id:msg.car_id}, car_answer)
    respond(null, { answer: car_answer })
  })
  
  this.add('role:book,cmd:remove,hotel:true', function remove_elem(msg, respond) {
	this.act('role:hotel', {
		cmd:'remove',
		hotel_id:msg.hotel_id}, hotel_answer)
    respond(null, { answer: hotel_answer })
  })

  this.wrap('role:book,cmd:remove', function (msg, respond) {
    if (msg.flight == "true") {
		msg.flight_id  = Number(msg.id).valueOf()
	}
	else if (msg.car == "true") {
		msg.car_id = Number(msg.car_id).valueOf()
	}
	else if (msg.hotel == "true") {
		msg.hotel_id = Number(msg.hotel_id).valueOf()
	}
    this.prior(msg, respond)
  })

  this.add('role:book,cmd:query,flight:true', function query(msg, respond) {
	  this.act('role:flight', {
		cmd:'query',
		from: msg.from,
		to: msg.to,
		price: msg.price,
		reservation_id:msg.reservation_id}, flight_answer)
	  respond(null, {answer:flight_answer })
  })
  
  this.add('role:book,cmd:query,flight:true,date:true', function query(msg, respond) {
	  this.act('role:flight', {
		cmd:'query',
		from: msg.from,
		to: msg.to,
		datetime: msg.datetime}, flight_answer)
	  respond(null, {answer:flight_answer })
  })
  
  this.add('role:book,cmd:query,flight:true,date:true,seats:true', function query(msg, respond) {
	  this.act('role:flight', {
		cmd:'query',
		from: msg.from,
		to: msg.to,
		datetime: msg.datetime,
		seats:msg.seats}, flight_answer)
	  respond(null, {answer:flight_answer })
  })
  
  this.add('role:book,cmd:query,flight:true,date:true,seats:true,price:true', function query(msg, respond) {
	  this.act('role:flight', {
		cmd:'query',
		from: msg.from,
		to: msg.to,
		datetime: msg.datetime,
		seats:msg.seats,
		price:msg.price}, flight_answer)
	  respond(null, {answer:flight_answer })
  })
  
  this.wrap('role:book,cmd:query, flight:true', function (msg, respond) {
    if (msg.date == "true") {
		msg.datetime = Date(msg.datetime)
	}
	if (msg.seats == "true") {
		msg.seats = Number(msg.seats).valueOf()
	}
	if (msg.price == "true") {
		msg.price = Number(msg.price).valueOf()
	}
    this.prior(msg, respond)
  })
  
  this.add('role:book,cmd:query,car:true', function query(msg, respond) {
	  this.act('role:car', {
		cmd:'query',
		city:msg.to_city}, car_answer)
	  respond(null, {answer:car_answer })
  })
  
  this.add('role:book,cmd:query,car:true,date:true', function query(msg, respond) {
	  this.act('role:car', {
		cmd:'query',
		city:msg.to_city,
		date:msg.date}, car_answer)
	  respond(null, {answer:car_answer })
  })
  
  this.wrap('role:book,cmd:query, car:true', function (msg, respond) {
    if (msg.date == "true") {
		msg.date_set  = Date(msg.date_set)
	}
	if (msg.seats == "true") {
		msg.seat_count = Number(msg.seat_count).valueOf()
	}
	if (msg.price == "true") {
		msg.price_cap = Number(msg.price_cap).valueOf()
	}
    this.prior(msg, respond)
  })
  
  this.add('role:book,cmd:query,hotel:true', function query(msg, respond) {
	  this.act('role:hotel', {
		cmd:'query',
		city:msg.city, 
		hotel_name: msg.hotel_name}, hotel_answer)
	  respond(null, {answer:hotel_answer })
  })
  
  this.add('role:book,cmd:query,hotel:true,date:true', function query(msg, respond) {
	  this.act('role:hotel', {
		cmd:'query',
		city:msg.city, 
		hotel_name: msg.hotel_name,
		from: msg.from,
		to:msg.to}, hotel_answer)
	  respond(null, {answer:hotel_answer })
  })
  
  this.add('role:book,cmd:query,hotel:true,date:true,multiple:true', function query(msg, respond) {
	  this.act('role:hotel', {
		cmd:'query',
		city:msg.city, 
		hotel_name: msg.hotel_name,
		from: msg.from,
		to:msg.to,
		size:msg.size}, hotel_answer)
	  respond(null, {answer:hotel_answer })
  })
  
  this.add('role:book,cmd:query,hotel:true,date:true,price:true', function query(msg, respond) {
	  this.act('role:hotel', {
		cmd:'query',
		city:msg.city, 
		hotel_name: msg.hotel_name,
		from: msg.from,
		to:msg.to,
		price:msg.price}, hotel_answer)
	  respond(null, {answer:hotel_answer })
  })
  
  this.add('role:book,cmd:query,hotel:true,date:true,seats:true,price:true', function query(msg, respond) {
	  this.act('role:hotel', {
		cmd:'query',
		city:msg.city, 
		hotel_name: msg.hotel_name,
		from: msg.from,
		to:msg.to,
		price:msg.price,
		size:msg.size}, hotel_answer)
	  respond(null, {answer:hotel_answer })
  })
  
  this.wrap('role:book,cmd:query, hotel:true', function (msg, respond) {
    if (msg.date == "true") {
		msg.from = Date(msg.from)
		msg.to = Date(msg.to)
	}
	if (msg.seats == "true") {
		msg.size = Number(msg.size).valueOf()
	}
	if (msg.price == "true") {
		msg.price = Number(msg.price).valueOf()
	}
    this.prior(msg, respond)
  })
  
  this.add('role:book,cmd:query,reservation:true', function query(msg, respond) {
	  queried_result = []
	  this.make('reservations').list$({reservation_id: msg.reservation_id}, function (err, list)  {
		  queried_result = list
	  })
	  respond(null, queried_result)
  })
  
  //this.add('role:book,cmd:query,reservation:true,date:true', function query(msg, respond) {
  //	  this.make( 'reservation' ).load$( msg.reserve_num, reservation_answer )
  //	  respond(null, {answer:reservation_answer })
   //})
  
  //this.add('role:book,cmd:query,reservation:true,date:true,seats:true', function query(msg, respond) {
  //	  reservation_service.act({'cmd:query,date:true,seats:true'})
  //	  respond(null, {answer:reservation_answer })
  //})
  
  //this.add('role:book,cmd:query,reservation:true,date:true,seats:true,price:true', function query(msg, respond) {
 //	  reservation_service.act({'cmd:query,date:true,seats:true,price:true'})
 //	  respond(null, {answer:reservation_answer })
  //})
  
  function my_slice(given_list, already_chosen) {
		queried_list = []
		for (i = 0; i< given_list.length; i++) {
			for (j = 0; j < already_chosen.length; j++) {
				if (i.car_id == j.car_id) {
					queried_list.push(i)
				}
			}
		}
		return queried_list
	}
	
  require('seneca')().client({ type: 'tcp', pin: 'role:car' })
					 .client({ type: 'tcp', pin: 'role:hotel' })
					 .client({ type: 'tcp', pin: 'role:flight' })
}