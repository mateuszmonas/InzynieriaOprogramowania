package c.team.session.statistics;

import c.team.security.model.UserPrincipal;
import c.team.session.administration.SessionService;
import c.team.session.administration.model.Session;
import c.team.session.statistics.model.GetSessionAnswersResponse;
import c.team.session.statistics.model.SessionAnswersDto;
import c.team.session.statistics.model.timeline.TimelineResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/session/{sessionId}/statistics")
@AllArgsConstructor
public class SessionStatisticsController {
    private final SessionService sessionService;
    private final SessionAnswersService sessionAnswersService;

    @GetMapping("/answers")
    public ResponseEntity<GetSessionAnswersResponse> getSessionAnswers(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable String sessionId) {
        sessionService.validateOwnerById(sessionId, userPrincipal.getId());
        List<SessionAnswersDto> serviceAnswers = sessionAnswersService.findAnswers(sessionId);
        return ResponseEntity.ok(new GetSessionAnswersResponse(serviceAnswers));
    }

    @GetMapping("/timeline")
    public ResponseEntity<TimelineResponse> getTimeline(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable String sessionId) {
        sessionService.validateOwnerById(sessionId, userPrincipal.getId());
        Session session = sessionService.findBySessionId(sessionId);
        TimelineResponse response = new TimelineResponse(session.getLog());
        return ResponseEntity.ok(response);
    }
}
