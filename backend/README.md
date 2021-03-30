# Docker

can be run in docker by running `mvn clean install`, and then `./run.sh`, \
or using intellij configurations

# API

Swagger api documentation can be accessed on url `/swagger-ui.html`

## Session handling quick view
#### Creating, joining and closing:
* Creating session: /session/create -> returns passcode (active session created in DB)
* Connecting to session: /session/connect -> returns session ID and session title (used to find session websocket endpoint when sending a message - /app/session/{sessionId}/send)
* Closing session: /session/close -> session with given ID is now closed (still in DB)
#### Websocket communication in one session:
* Creating websocket: /session-handling (websocket connection address)
* Subscribtion: /topic/session/{sessionId} (receiving all messages, requires getting session ID from connect request)
* Sending message: /app/session/{sessionId}/send (requires getting session ID from connect request)
* Registering as a new guest: /app/session/{sessionId}/new-user (potentially a welcoming message, requires getting session ID from connect request)
