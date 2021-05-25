package c.team.quiz;

import c.team.quiz.exception.QuizNotFoundException;
import c.team.quiz.model.*;
import c.team.security.model.UserPrincipal;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("quiz")
@AllArgsConstructor
@Slf4j
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
        List<QuizDto> quizzes = quizService.getUserQuizzes(user.getId());
        GetQuizzesResponse response = new GetQuizzesResponse(quizzes);
        return ResponseEntity.ok(response);
    }

    @GetMapping("{quizId}")
    public ResponseEntity<QuizDto> getQuiz(@AuthenticationPrincipal UserPrincipal user, @PathVariable String quizId) {
        QuizDto quiz = quizService.findQuiz(user.getId(), quizId).orElseThrow(QuizNotFoundException::new);
        return ResponseEntity.ok(quiz);
    }


    @PutMapping("{quizId}")
    @ResponseStatus(HttpStatus.OK)
    public void updateQuiz(@RequestBody @Valid UpdateQuizRequest request, @PathVariable String quizId){
        quizService.updateQuiz(quizId, request);
    }

    @DeleteMapping("{quizId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteQuiz(@PathVariable String quizId){
        quizService.deleteQuiz(quizId);
    }

    @ExceptionHandler(QuizNotFoundException.class)
    public final ResponseEntity<Error> handleException(QuizNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
