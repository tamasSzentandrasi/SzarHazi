require('seneca')()
  .use('booking_service')
  .listen({ type: 'tcp', pin: 'role:book' })