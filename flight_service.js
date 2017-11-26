module.exports = function flight_service(options) {
	this.add('role:flight,cmd:reserve', function(msg, respond) {
		this.make( 'flight' ).load$(msg.flight_id, function( err, chosen_flight ) {
			if( err ) return respond( false )
				
			
			for ( i = 0; i < chosen_flight.board.length; i++) {
				if (chosen_flight.board[i][0] == msg.levels && chosen_flight.board[i][1] == msg.width && chosen_flight.board[i][2] == msg.length && chosen_flight.board[i][3] == 0) {
					chosen_flight.board[i][3] = msg.reservation_id
					return respond( true )
				} else {
					return respond( false )
				}
			}
		})
	})
	this.add('role:flight,cmd:add', function(msg, respond) {
		var seats = []
		for ( i = 0; i < msg.levels; i++) {
			for ( j = 0; j < msg.width; j++) {
				for ( k = 0; k < msg.length; k++) {
					seats.push([i,j,k,0])
				}
			}
		}
		this
			.make( 'flight' )
			.data$({
				flight_id: msg.flight_id,
				from: msg.from,
				to: msg.to,
				datetime: msg.datetime,
				price: msg.price,
				levels: msg.levels,
				width: msg.width,
				length: msg.length,
				board: seats
			})
			.save$( function( err, response) {
				if (err) return respond(err)
				
				respond(null, true)
			})
	})
	this.add('role:flight,cmd:remove', function(msg, respond) {
		this.make('flight').remove$(msg.flight_id, respond)
	})
	this.add('role:flight,cmd:query', function(msg, respond) {
		var queried_results = []
		if (typeof msg.from != "undefined") {
			this.make('flight').list$({from: msg.from}, function (err, list)  {
				queried_results = my_slice(list, queried_results)
			})
		}
		if (typeof msg.to != "undefined") {
			this.make('flight').list$({to: msg.to}, function (err, list)  {
				queried_results = my_slice(list, queried_results)
			})
		}
		if (typeof msg.reservation_id != "undefined") {
			this.make('flight').list$(function (err, list)  {
				newlist = my_slice(list, queried_results)
				result = []
				for (i = 0; i< newlist.length; i++) {
					found = false
					for (j = 0; j< newlist[i].board.length; j++) {
						if (newlist[i].board[j][3] == msg.reservation_id) {
							found = true
						}
					}
					if (found) {
						result.push(newlist[i])
					}
				}
				queried_results = result.slice(0);
			})
		}
		if (typeof msg.datetime != "undefined") {
			this.make('flight').list$(function (err, list)  {
				newlist = my_slice(list, queried_results)
				result = []
				for (i = 0; i< newlist.length; i++) {
					if (newlist[i].datetime.getTime() > msg.datetime.getTime()) {
						result.push(newlist[i])
					}
				}
				queried_results = result.slice(0);
			})
		}
		if (typeof msg.price != "undefined") {
			this.make('flight').list$(function (err, list)  {
				newlist = my_slice(list, queried_results)
				result = []
				for (i = 0; i< newlist.length; i++) {
					if (newlist[i].price < msg.price) {
						result.push(newlist[i])
					}
				}
				queried_results = newlist.slice(0);
			})
		}
		respond(null,queried_results)
	})

	function my_slice(given_list, already_chosen) {
		queried_results = []
		for (i = 0; i< given_list.length; i++) {
			for (j = 0; j < already_chosen.length; j++) {
				if (i.flight_id == j.flight_id) {
					queried_results.push(i)
				}
			}
		}
		return queried_results
	}
}