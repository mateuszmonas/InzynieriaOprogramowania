package c.team.session.history;

import c.team.security.model.UserPrincipal;
import c.team.session.administration.SessionService;
import c.team.session.administration.model.Session;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("history")
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class HistoryController {
    private final SessionService sessionsService;

    // Request used in account menu
    @GetMapping
    public ResponseEntity<SessionHistoryResponse> getSessionHistory(@AuthenticationPrincipal UserPrincipal user){
        List<Session> userSessions = sessionsService.findByLeaderAccountId(user.getId());
        SessionHistoryResponse response = new SessionHistoryResponse(userSessions);
        return ResponseEntity.ok(response);
    }
}
