# Docker

can be run in docker by running `mvn clean install`, and then `./run.sh`, \
or using intellij configurations

# API

Swagger api documentation can be accessed on url `/swagger-ui.html`

## Session handling quick view
#### Creating, joining and closing:
* **Creating session:** /session/create -> returns session ID, passcode and approval room ID - only if guests need to be approved (active session created in DB)
  * If guests need to be approved - additional websockets need to be subscribed
  * ***Guest:***
    * **Sends request to:** /app/session/{sessionApprovalId}/guest-approval-request
    * **Subscribes for response to:** /topic/session/{sessionApprovalId}/guest-approval-response/guest-{guestId}
  * ***Room leader:***
    * **Subscribes for request to:** /topic/session/{sessionApprovalId}/guest-approval-request
    * **Sends response to user to:** /app/session/{sessionApprovalId}/guest-approval-response/{guestId} 
    
* **Connecting to session:** /session/connect -> returns session info - session ID/approval room ID, session title, 
  guest ID and whether guests require approval (used to find session websocket endpoint when sending a message - 
  /app/session/{sessionId}/send or where to ask for an approval for joining)
* **Closing session:** /session/close -> session with given ID is now closed (still in DB)
* **Getting participant list:** /session/participant-list -> returns list of participants (their ID and name)
* **Getting timeline for one session:** /session/timeline -> returns list of all messages sent in session
* **Getting whole session history for leader account:** /session/session-history -> returns list of all sessions organized by user
#### Websocket communication in one session:
* **Creating websocket:** /session-handling (websocket connection address)
* **Subscribtion:** /topic/session/{sessionId} (receiving all messages, requires getting session ID from connect request)
* **Sending message:** /app/session/{sessionId}/send (requires getting session ID from connect request)
* **Registering as a new guest:** /app/session/{sessionId}/new-user (potentially a welcoming message, requires getting session ID from connect request)
* **Quizzes:**
  * Quiz is retrieved from quiz repository with quiz request or created - it has following fields:
    * id - ID of quiz (String)
    * userId - ID of user creating quiz (String)
    * questionIds - list of Questions IDs (List<String>)
    * (has Dto version, where questionIds are replaced with questions - List<Question>)
  * Question:
    * id - ID of question (String)
    * content - question itself (String)
    * answers - list of Answers (List<Answer>)
  * Answer:
    * text - text for answer, a letter if it's a closed question (String)
    * correct - information whether chosen answer is correct (Bool) // perhaps checking answer might be backend responsibility
  * QuizAnswers:
    * quizAnswers - dictionary questionId -> list of Answers for to this question (String -> List<Answer>)
  * ***Leader sends a quiz***: /app/session/{sessionId}/quiz - here leader sends a message with quiz (content field of message is Quiz)
  * ***Guests receive a quiz***: /topic/session/{sessionId}/quiz - here guests subscribe to receive a quiz
  * ***Guests send answers***: /app/session/{sessionId}/quiz-answers - here guests send a message with answers to quiz (content field of message is QuizAnswers)
  * ***Leader receives answers***: /topic/session/{sessionId}/quiz-answers - here leader subscribes to receive quiz answers