package c.team.quiz;

import c.team.account.UserAccountService;
import c.team.quiz.exception.QuizNotFoundException;
import c.team.quiz.model.CreateQuizRequest;
import c.team.quiz.model.CreateQuizResponse;
import c.team.quiz.model.GetQuizzesResponse;
import c.team.quiz.model.Quiz;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("quiz")
@AllArgsConstructor
public class QuizController {

    private final UserAccountService userAccountService;
    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<CreateQuizResponse> createQuiz(@AuthenticationPrincipal User user, @RequestBody @Valid CreateQuizRequest request) {
        String userId = userAccountService.findByUsername(user.getUsername()).getId();
        CreateQuizResponse response = new CreateQuizResponse(quizService.createQuiz(userId, request));
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<GetQuizzesResponse> getQuizzes(@AuthenticationPrincipal User user) {
        String userId = userAccountService.findByUsername(user.getUsername()).getId();
        GetQuizzesResponse response = new GetQuizzesResponse(quizService.getUserQuizzes(userId));
        return ResponseEntity.ok(response);
    }

    @GetMapping("{quizId}")
    public ResponseEntity<Quiz> getQuiz(@AuthenticationPrincipal User user, @PathVariable String quizId) {
        String userId = userAccountService.findByUsername(user.getUsername()).getId();
        Quiz quiz = quizService.findQuiz(userId, quizId).orElseThrow();
        return ResponseEntity.ok(quiz);
    }

    @ExceptionHandler(QuizNotFoundException.class)
    public final ResponseEntity<Error> handleException(UsernameNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
