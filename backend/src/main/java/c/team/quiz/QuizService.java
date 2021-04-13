package c.team.quiz;

import c.team.quiz.model.CreateQuizRequest;
import c.team.quiz.model.Quiz;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;

    public String createQuiz(String userId, CreateQuizRequest createQuizRequest) {
        Quiz quiz = Quiz.builder()
                .questions(createQuizRequest.getQuestions())
                .userId(userId)
                .build();
        return quizRepository.save(quiz).getId();
    }

    public List<Quiz> getUserQuizzes(String userId) {
        return quizRepository.findAllByUserId(userId);
    }

    public Optional<Quiz> findQuiz(String userId, String quizId) {
        return quizRepository.findByIdAndUserId(quizId, userId);
    }
}
