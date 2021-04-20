package c.team.quiz;

import c.team.quiz.exception.QuizNotFoundException;
import c.team.quiz.model.CreateQuizRequest;
import c.team.quiz.model.CreateQuizResponse;
import c.team.quiz.model.GetQuizzesResponse;
import c.team.quiz.model.Quiz;
import c.team.security.model.UserPrincipal;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("quiz")
@AllArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<CreateQuizResponse> createQuiz(@AuthenticationPrincipal UserPrincipal user, @RequestBody @Valid CreateQuizRequest request) {
        String quizId = quizService.createQuiz(user.getId(), request);
        CreateQuizResponse response = new CreateQuizResponse(quizId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<GetQuizzesResponse> getQuizzes(@AuthenticationPrincipal UserPrincipal user) {
        List<Quiz> quizzes = quizService.getUserQuizzes(user.getId());
        GetQuizzesResponse response = new GetQuizzesResponse(quizzes);
        return ResponseEntity.ok(response);
    }

    @GetMapping("{quizId}")
    public ResponseEntity<Quiz> getQuiz(@AuthenticationPrincipal UserPrincipal user, @PathVariable String quizId) {
        Quiz quiz = quizService.findQuiz(user.getId(), quizId).orElseThrow();
        return ResponseEntity.ok(quiz);
    }

    @ExceptionHandler(QuizNotFoundException.class)
    public final ResponseEntity<Error> handleException(UsernameNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
