module.exports = function hotel_service(options) {
	this.add('role:hotel,cmd:reserve', function(msg, respond) {
		this.make( 'hotel' ).load$(msg.hotel_id, function( err, chosen_hotel) {
			if( err ) return respond( false );
						
			for ( i = 0; i < chosen_hotel.rooms; i++) {
				if (i == msg.room && get_ready_state(chosen_hotel.rooms[i], msg.from, msg.to)) {
					this.make('reservations')
						.data$({
								hotel: chosen_hotel.name,
								room_id: i
								res_from: msg.from
								res_to: msg.to
								reservation_id: msg.reservation_id
						})
						.save$( function( err, response) {
							if (err) return respond(err);
						})
					respond(null, true);
				}
			}
			respond(null, false);
			
		}
	}
	this.add('role:hotel,cmd:add', function(msg, respond) {
		var room_array = []
		for ( i = 0; i < msg.rooms.length; i++) {
			room_array.push([i, msg.rooms[i][0], msg.rooms[i][1], 0]);
		}
		this
			.make( 'hotel' )
			.data$({
				hotel_id: msg.hotel_id
				hotel_name: msg.hotel_name
				city: msg.city
				price: msg.price
				rooms: room_array
			})
			.save$( function( err, response) {
				if (err) return respond(err);
				
				respond(null, true);
			})
	})
	this.add('role:hotel,cmd:remove', function(msg, respond) {
		this.make('hotel').remove#(msg.hotel_id, respond);
	})
	this.add('role:hotel,cmd:query', function(msg, respond) {
		var queried_results = [];
		if (typeof msg.from != "undefined") {
			this.make('hotel').list$({city: msg.city}, function (err, list)  {
				queried_results = my_slice(list, queried_results);
			}
		}
		if (typeof msg.to != "undefined") {
			this.make('hotel').list$({hotel_name: msg.hotel_name}, function (err, list)  {
				queried_results = my_slice(list, queried_results);
			}
		}
		if (typeof msg.price != "undefined") {
			this.make('hotel').list$(function (err, list)  {
				newlist = my_slice(list, queried_results);
				result = [];
				for (i = 0; i< newlist.length; i++) {
					found = false;
					for (j = 0; j < newlist[i].rooms.length; j++) {
						if (newlist[i].rooms[j].price < msg.price) {
							found = true;
						}
					}
					if (found) {
						result.push(newlist[i]);
					}
				}
				queried_results = result.slice(0);
			}
		}
		respond(null,queried_results);
	})

	function my_slice(given_list, already_chosen) {
		queried_results = []
		for (i = 0; i< given_list.length; i++) {
			for (j = 0; j < already_chosen.length; j++) {
				if (i.hotel_id == j.hotel_id) {
					queried_results.push(i);
				}
			}
		}
		return queried_results;
	}
	
	function get_ready_state(chosen_room, res_from, res_to) {
		this.make( 'hotel' ).load$(msg.hotel_id, function( err, chosen_hotel) {
			this.make('reservations').list$({hotel: chosen_hotel.name}, function (err, list)  {
				for (i = 0; i<list.lenght; i++) {
					if (list[i].room_id == chosen_room) {
						if ((list[i].from.getTime() > res_from.getTime() && list[i].to.getTime() < res_to.getTime()) || 
							(list[i].from.getTime() < res_to.getTime() && list[i].to.getTime() > res_to.getTime()) ||
							(list[i].from.getTime() < res_from.getTime() && list[i].to.getTime() > res_to.getTime())) {
								return false;
						}
					} 
				}
				return true;
			}
		}
	}
		
}