package c.team.quiz.model;

import java.util.List;

// Can be used as 'content' field of message
// Sent by guests only (in QUIZ_ANSWERS message)
public class QuizAnswers {
    String quizId;
    List<Answer> quizAnswers;
}
