import { execute } from 'test-a-bit'

import { create_clients_swarm, create_server, VALID_SECRET } from './_helpers.js'

execute('many clients', async (success, fail) => {

  const total_clients = 20
  let points = 0

  const server = create_server()
  const clients = create_clients_swarm(total_clients)

  server.joined.on(c => {
    server.log('joined', c.id)
    process.nextTick(() => c.drop('BECAUSE-OF-TEST'))
  })

  server.init()

  for (let i = 0; i < clients.length; i++) {
    clients[i].connect(VALID_SECRET, { index: i })
    clients[i].closed.on((code, reason) => {
      if (code === 1000 && reason === 'BECAUSE-OF-TEST') {
        points++
        if (points === total_clients) {
          success(`all ${ points } users disconnected`)
        }
      } else {
        fail('invalid reason catch')
      }
    })
  }
})




