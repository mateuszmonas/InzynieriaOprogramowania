# Docker

can be run in docker by running `mvn clean install`, and then `./run.sh`, \
or using intellij configurations

# API

Swagger api documentation can be accessed on url `/swagger-ui.html`

## Session handling quick view
* /session/create -> returns passcode
* /session/connect -> returns session ID (used to find session websocket address)