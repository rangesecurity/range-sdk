# Discussion

## Plan

We want third parties run their own custom alert rules using our sdk. Here is the flow for the same:

- Signup for the sdk and get your unique `range-sdk-code`
- Write the code for your worker in TS similar to our template:
  - define the necessary caller function: `onBlock` or `onTransaction` or `onMessage`
  - pass them into our Range.init() function
- After running the init() function, the worker will listen for incoming block tasks from kafka topics
- Once a block is received, the worker will process it
- Any generated events will be sent back to a rabbitmq queue
- From `range-team` side:
  - provide wrapped kafka access to authorized users
  - provide wrapped endpoint access to authorized users
  - process generated errors or events(storing them in appdb and sending notifications to defined destinations)
