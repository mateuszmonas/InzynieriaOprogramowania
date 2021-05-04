package c.team.quiz.model;

import lombok.Getter;

import java.util.List;
import java.util.Map;

// Can be used as 'content' field of message
// Sent by guests only (in QUIZ_ANSWERS message)
@Getter
public class QuizAnswers {
    private Map<String, List<Answer>> quizAnswers;
}
