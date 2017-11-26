module.exports = function booking_service(options) {

  var flight_service = require('flight_service')
  var car_service = require('car_service')
  var hotel_service = require('hotel_service')
  var seneca = require('seneca')()
  
  this.add('role:book,cmd:reserve,car:true,hotel:true', function reserve(msg, respond) {
	flight_service.act('role:flight', {
		cmd:'reserve',
		id:msg.id,
		reservation_number:msg.reserve_num,
		seats:msg.seats,
		date:msg.date_set}, flight_answer)
	car_service.act('role:car', {
		cmd:'reserve',
		id:msg.car_id,
		reservation_number:msg.reserve_num,
		date:msg.date_set,
		target_location:msg.hotel_id}, car_answer)
	hotel_service.act('role:hotel', {
		cmd:'reserve',
		id:msg.hotel_id,
		reservation_number:msg.reserve_num,
		date:msg.date_set,
		target_rooms:msg.hotel_rooms}, hotel_answer)
    respond(null, { answer: flight_answer && car_answer && hotel_answer })
  })
  
  this.add('role:book,cmd:reserve,car:false,hotel:true', function reserve(msg, respond) {
	flight_service.act('role:flight', {
		cmd:'reserve',
		id:msg.id,
		reservation_number:msg.reserve_num,
		seats:msg.seats,
		date:msg.date_set}, flight_answer)
	hotel_service.act('role:hotel', {
		cmd:'reserve',
		id:msg.hotel_id,
		reservation_number:msg.reserve_num,
		date:msg.date_set,
		target_rooms:msg.hotel_rooms}, hotel_answer)
    respond(null, { answer: flight_answer && hotel_answer })
  })
  
  //this.add('role:book,cmd:reserve,car:true,hotel:false', function reserve(msg, respond) {
  //	flight_service.act({'cmd:reserve'}
  //	car_service.act({'cmd:reserve'}
  //  respond(null, { answer: flight_answer && car_answer })
  //})
  
  this.add('role:book,cmd:reserve,car:false,hotel:false', function reserve(msg, respond) {
	flight_service.act('role:flight', {
		cmd:'reserve',
		id:msg.id,
		reservation_number:msg.reserve_num,
		seats:msg.seats,
		date:msg.date_set}, flight_answer)
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
	flight_service.act('role:flight', {
		cmd:'add',
		id:msg.id,
		from_town:msg.from_city,
		to_town:msg.to_city
		seats:msg.seats,
		date:msg.date_set
		price_set:msg.price_set}, flight_answer)
    respond(null, { answer: flight_answer })
  })
  
  this.add('role:book,cmd:add,car:true', function add_elem(msg, respond) {
	car_service.act('role:car', {
		cmd:'add',
		id:msg.car_id,
		type:msg.car_type,
		size:msg.car_size,
		price:msg.price_set}, car_answer)
    respond(null, { answer: car_answer })
  })
  
  this.add('role:book,cmd:add,hotel:true', function add_elem(msg, respond) {
	hotel_service.act('role:hotel', {
		cmd:'add',
		id:msg.hotel_id,
		name:msg.hotel_name,
		rooms:msg.hotel_rooms}, hotel_answer)
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
	flight_service.act('role:flight', {
		cmd:'remove',
	id:msg.id}, flight_answer)
    respond(null, { answer: flight_answer })
  })
  
  this.add('role:book,cmd:remove,car:true', function remove_elem(msg, respond) {
	car_service.act('role:car', {
		cmd:'remove',
	id:msg.car_id}, car_answer)
    respond(null, { answer: car_answer })
  })
  
  this.add('role:book,cmd:remove,hotel:true', function remove_elem(msg, respond) {
	hotel_service.act('role:hotel', {
		cmd:'remove',
  id:msg.hotel_id}, hotel_answer)
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
	  flight_service.act('role:flight', {
		cmd:'query',
		from_town:msg.from_city,
		to_town:msg.to_city}, flight_answer)
	  respond(null, {answer:flight_answer })
  })
  
  this.add('role:book,cmd:query,flight:true,date:true', function query(msg, respond) {
	  flight_service.act('role:flight', {
		cmd:'query',
		from_town:msg.from_city,
		to_town:msg.to_city,
	  date:msg.date}, flight_answer)
	  respond(null, {answer:flight_answer })
  })
  
  this.add('role:book,cmd:query,flight:true,date:true,seats:true', function query(msg, respond) {
	  flight_service.act('role:flight', {
		cmd:'query',
		from_town:msg.from_city,
		to_town:msg.to_city,
		date:msg.date,
		seats:msg.seats}, flight_answer)
	  respond(null, {answer:flight_answer })
  })
  
  this.add('role:book,cmd:query,flight:true,date:true,seats:true,price:true', function query(msg, respond) {
	  flight_service.act('role:flight', {
		cmd:'query',
		from_town:msg.from_city,
		to_town:msg.to_city,
		date:msg.date,
		seats:msg.seats,
		price_set:msg.price_cap}, flight_answer)
	  respond(null, {answer:flight_answer })
  })
  
  this.wrap('role:book,cmd:query, flight:true', function (msg, respond) {
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
  
  this.add('role:book,cmd:query,car:true', function query(msg, respond) {
	  car_service.act('role:car', {
		cmd:'query',
		in_town:msg.to_city}, car_answer)
	  respond(null, {answer:car_answer })
  })
  
  this.add('role:book,cmd:query,car:true,date:true', function query(msg, respond) {
	  car_service.act('role:car', {
		cmd:'query',
		in_town:msg.to_city,
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
	  hotel_service.act('role:hotel', {
		cmd:'query',
		in_town:msg.to_city}, hotel_answer)
	  respond(null, {answer:hotel_answer })
  })
  
  this.add('role:book,cmd:query,hotel:true,date:true', function query(msg, respond) {
	  hotel_service.act('role:hotel', {
		cmd:'query',
		in_town:msg.to_city,
		date:msg.date}, hotel_answer)
	  respond(null, {answer:hotel_answer })
  })
  
  this.add('role:book,cmd:query,hotel:true,date:true,multiple:true', function query(msg, respond) {
	  hotel_service.act('role:hotel', {
		cmd:'query',
		in_town:msg.to_city,
		date:msg.date,
		amount:msg.amount}, hotel_answer)
	  respond(null, {answer:hotel_answer })
  })
  
  this.add('role:book,cmd:query,hotel:true,date:true,price:true', function query(msg, respond) {
	  hotel_service.act('role:hotel', {
		cmd:'query',
		in_town:msg.to_city,
		date:msg.date,
		price_cap:msg.price_set}, hotel_answer)
	  respond(null, {answer:hotel_answer })
  })
  
  this.add('role:book,cmd:query,hotel:true,date:true,seats:true,price:true', function query(msg, respond) {
	  hotel_service.act('role:hotel', {
		cmd:'query',
		in_town:msg.to_city,
		date:msg.date,
		amount:msg.amount,
		price_cap:msg.price_set}, hotel_answer)
	  respond(null, {answer:hotel_answer })
  })
  
  this.wrap('role:book,cmd:query, hotel:true', function (msg, respond) {
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
  
  this.add('role:book,cmd:query,reservation:true', function query(msg, respond) {
	  queried_result = []
	  this.make('reservations').list$({reservation_id: msg.reservation_id}, function (err, list)  {
		  queried_result = list
	  }
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
  
  this.wrap('role:book,cmd:query, reservation:true', function (msg, respond) {
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
	
  require('seneca')().client({ type: 'tcp', pin: 'role:car_service' })
					 .client({ type: 'tcp', pin: 'role:hotel_service' })
					 .client({ type: 'tcp', pin: 'role:flight_service' })
}