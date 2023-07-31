# Discussion

## Plan

We want third parties run their own custom alert rules using our sdk. Here is the flow for the same:

- Signup for the sdk and get your unique `range-sdk-code`
- Write the code for your worker in TS similar to our template:
  - define the init function
  - define the necessary caller function: `onBlock` or `onTransaction` or `onMessage`
- After running the init() function, the worker will listen for incoming block tasks in a queue specially created for them
- once a task is received, the worker will process and return any generated events
- these generated events will be returned to another special queue created for the client
- From `range-team` side:
  - the master-scheduler will listen for these init functions
  - and will push necessary tasks into special queue for them
  - we will also process returned events(storing them in appdb and sending notifications to defined destinations)

## Suggestions & Questions

- Instead of creating a special queue for each client
- What if we give access of our kafka block streaming service to the client
- that way they can listen for incoming blocks or request for specific blocks
- that way, we won't be needing the task queue for clients, only response queue
