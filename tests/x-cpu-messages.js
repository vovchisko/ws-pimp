import { execute } from 'test-a-bit'

import { create_client, create_mserver, VALID_SECRET } from './_helpers.js'

execute('cpu_limit = 2', async (success, fail) => {
  const server = create_mserver({ cpu_limit: 3 })

  const clientA = create_client()
  const clientB = create_client()
  const clientC = create_client()

  server.init()

  let received = { A: 0, B: 0, C: 0 }

  const check_messages = () => {
    if (received.A === 1 && received.B === 1 && received.C === 1) {
      success('all clients received the message once')
    }
  }

  clientA.channel.on('msg', (dat) => {
    if (received.A) fail('message received more that once on client A')
    received.A++
    check_messages()
  })

  clientB.channel.on('msg', (dat) => {
    if (received.B) fail('message received more that once on client B')
    received.B++
    check_messages()
  })

  clientC.channel.on('msg', (dat) => {
    if (received.C) fail('message received more that once on client C')
    received.C++
    check_messages()
  })

  await clientA.connect(VALID_SECRET, { user_id: 'UID1' })
  await clientB.connect(VALID_SECRET, { user_id: 'UID1' })
  await clientC.connect(VALID_SECRET, { user_id: 'UID1' })

  setTimeout(() => server.send_to('UID1', 'msg', { hey: 'there' }), 100)
})