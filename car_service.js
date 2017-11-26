module.exports = function car_service(options) {
	this.add('role:car,cmd:reserve', function(msg, respond) {
		this.make( 'car' ).load$(msg.car_id, function( err, chosen_car) {
			if( err ) return respond( false )
						
			if (!(chosen_car.size < msg.reservation_count) && get_ready_state(chosen_car, msg.datetime))  {
					this.make('reservations')
						.data$({
								car_id: chosen_car,
								res_from: msg.from,
								res_to: msg.to,
								reservation_id: msg.reservation_id
						})
						.save$( function( err, response) {
							if (err) return respond(err);
						})
					return respond( true )
				} else {
					return respond( false )
				}
		})
	})
	this.add('role:car,cmd:add', function(msg, respond) {
		this
			.make( 'car' )
			.data$({
				car_id: msg.car_id,
				car_type: msg.car_type,
				city: msg.city,
				size: msg.size,
				price: msg.price
			})
			.save$( function( err, response) {
				if (err) return respond(err)
				
				respond(null, true)
			})
	})
	this.add('role:car,cmd:remove', function(msg, respond) {
		this.make('car').remove$(msg.car_id, respond)
	})
	this.add('role:car,cmd:query', function(msg, respond) {
		var queried_results = []
		if (typeof msg.city != "undefined") {
			this.make('car').list$({city: msg.city}, function (err, list)  {
				queried_results = my_slice(list, queried_results)
			})
		}
		if (typeof msg.type != "undefined") {
			this.make('car').list$({car_type: msg.car_type}, function (err, list)  {
				queried_results = my_slice(list, queried_results)
			})
		}
		if (typeof msg.price != "undefined") {
			this.make('car').list$(function (err, list)  {
				newlist = my_slice(list, queried_results)
				result = []
				for (i = 0; i< newlist.length; i++) {
					if (newlist[i].price < msg.price) {
						result.push(newlist[i])
					}
				}
				queried_results = result.slice(0);
			})
		}
		if (typeof msg.size != "undefined") {
			this.make('car').list$(function (err, list)  {
				newlist = my_slice(list, queried_results)
				result = []
				for (i = 0; i< newlist.length; i++) {
					if (!(newlist[i].size < msg.size)) {
						result.push(newlist[i])
					}
				}
				queried_results = result.slice(0);
			})
		}
		respond(null,queried_results)
	})

	function my_slice(given_list, already_chosen) {
		queried_results = []
		for (i = 0; i< given_list.length; i++) {
			for (j = 0; j < already_chosen.length; j++) {
				if (i.car_id == j.car_id) {
					queried_results.push(i)
				}
			}
		}
		return queried_results
	}
	
	function get_ready_state(chosen_car, res_from, res_to) {
		this.make( 'car' ).load$(msg.car_id, function( err, chosen_car) {
			this.make('reservations').list$({hotel: chosen_car.name}, function (err, list)  {
				for (i = 0; i<list.lenght; i++) {
					if ((list[i].from.getTime() > res_from.getTime() && list[i].to.getTime() < res_to.getTime()) || 
						(list[i].from.getTime() < res_to.getTime() && list[i].to.getTime() > res_to.getTime()) ||
						(list[i].from.getTime() < res_from.getTime() && list[i].to.getTime() > res_to.getTime())) {
							return false;
					}
				}
				return true;
			})
		})
	}
}