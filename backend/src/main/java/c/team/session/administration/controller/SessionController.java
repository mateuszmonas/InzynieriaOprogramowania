package c.team.session.administration.controller;

import c.team.message.exception.InvalidMessageTypeException;
import c.team.message.model.Message;
import c.team.message.model.MessageType;
import c.team.quiz.exception.QuizNotFoundException;
import c.team.quiz.model.QuizAnswers;
import c.team.session.administration.ReactionService;
import c.team.session.administration.SessionService;
import c.team.session.statistics.SessionAnswersService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Controller
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionController {

    private final ObjectMapper objectMapper;
    private final SessionService sessionsService;
    private final SessionAnswersService answersService;
    private final ReactionService reactionService;

    @MessageMapping("/socket/session/{sessionId}/send")
    @SendTo("/topic/session/{sessionId}")
    public Message sendMessage(@DestinationVariable String sessionId, @Payload final Message message){
        // Possibly throwing some exception if message type is wrong, but need to define "wrong" types
        sessionsService.addMessageToSessionLog(sessionId, message);
        // Possibly some validation whether sender is in this session
        return message;
    }

    @MessageMapping("/socket/session/{sessionId}/new-user")
    @SendTo("/topic/session/{sessionId}")
    public Message addParticipant(@DestinationVariable String sessionId, @Payload final Message message, SimpMessageHeaderAccessor headerAccessor){
        if(message.getType() != MessageType.CONNECT)
            throw new InvalidMessageTypeException();
        headerAccessor.getSessionAttributes().put("guestId", message.getSender());  // sender == guestId
        headerAccessor.getSessionAttributes().put("sessionId", sessionId);
        sessionsService.approveGuest(sessionId, message.getSender());
        return message;
    }

    @MessageMapping("/socket/session/{sessionApprovalId}/guest-approval-request")  // Here guest sends a request
    @SendTo("/topic/session/{sessionApprovalId}/guest-approval-request")    // Here room leader subscribes for requests
    public Message guestApprovalRequest(@DestinationVariable String sessionApprovalId, @Payload final Message message){
        if(message.getType() != MessageType.GUEST_APPROVAL)
            throw new InvalidMessageTypeException();
        return message;
    }

    // Routed to endpoint for particular guest
    @MessageMapping("/socket/session/{sessionApprovalId}/guest-approval-response/{guestId}")
    // Here room leader sends response
    @SendTo("/topic/session/{sessionApprovalId}/guest-approval-response/guest-{guestId}")
    // Here guest subscribes to listen for response
    // Can be done with UserDestinationMessageHandler and @SentToUser but it's harder
    public Message guestApprovalResponse(@DestinationVariable String sessionApprovalId, @DestinationVariable String guestId, @Payload final Message message) throws JsonProcessingException {
        if (message.getType() != MessageType.GUEST_APPROVAL)
            throw new InvalidMessageTypeException();
        boolean leaderApproval = objectMapper.readValue(message.getContent(), Boolean.class);

        String sessionId = sessionsService
                .findByGuestApprovalRoomId(UUID.fromString(sessionApprovalId))
                .getId();

        Message updatedResponse = Message.builder()
                .sender(message.getSender())
                .timestamp(message.getTimestamp())
                .content(message.getContent())
                .sessionId(leaderApproval ? sessionId : "")
                .build();

        if(!leaderApproval)
            sessionsService.removeGuestFromSession(sessionId, guestId);
        return updatedResponse;
    }

    @MessageMapping("/socket/session/{sessionId}/quiz")    // Here leader sends a quiz
    @SendTo("/topic/session/{sessionId}/quiz")      // Here participants subscribe to receive quiz
    public Message sendQuizToParticipants(@DestinationVariable String sessionId, @Payload final Message message) {
        if (message.getType() != MessageType.QUIZ)
            throw new InvalidMessageTypeException();
        sessionsService.addMessageToSessionLog(sessionId, message);
        return message;
    }

    @MessageMapping("/socket/session/{sessionId}/reaction")
    @SendTo("/topic/session/{sessionId}/reaction")
    public String sendReaction(@DestinationVariable String sessionId, @Payload String reactionString) {
        reactionService.saveReaction(sessionId, reactionString);
        sessionsService.addMessageToSessionLog(sessionId, Message.builder()
                .timestamp(OffsetDateTime.now().toString())
                .sessionId(sessionId)
                .content(reactionString)
                .type(MessageType.EMOTE)
                .build());
        return reactionString;
    }

    // Might require additional security
    @MessageMapping("/socket/session/{sessionId}/quiz-answers")    // Here participants send quiz answers
    @SendTo("/topic/session/{sessionId}/quiz-answers")      // Here leader subscribes to receive quiz answers
    public Message sendQuizAnswersToLeader(@DestinationVariable String sessionId,
                                           @Payload final Message message) throws JsonProcessingException {
        if (message.getType() != MessageType.QUIZ_ANSWERS)
            throw new InvalidMessageTypeException();
        sessionsService.addMessageToSessionLog(sessionId, message);

        QuizAnswers answersToQuestions = answersService.convertMapToQuizAnswers(
                objectMapper.readValue(message.getContent(), new TypeReference<>() {}));

        answersToQuestions.getQuizAnswers().forEach((questionId, answers) -> {
            List<Integer> answerIdx = answersService.getAnswerCountsOrAddForQuestion(questionId, answers);
            answersService.addAnswers(sessionId, questionId, answerIdx);
        });
        return message;
    }

    @ExceptionHandler(InvalidMessageTypeException.class)
    public final ResponseEntity<Error> handleException(InvalidMessageTypeException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @ExceptionHandler(QuizNotFoundException.class)
    public final ResponseEntity<Error> handleException(QuizNotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
