package c.team.quiz;

import c.team.quiz.model.CreateQuizRequest;
import c.team.quiz.model.Question;
import c.team.quiz.model.Quiz;
import c.team.quiz.model.QuizDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    public String createQuiz(String userId, CreateQuizRequest createQuizRequest) {
        List<Question> questions = questionRepository.saveAll(createQuizRequest.getQuestions());
        List<String> questionIds = questions.stream().map(Question::getId).collect(Collectors.toList());
        Quiz quiz = Quiz.builder()
                .questionIds(questionIds)
                .userId(userId)
                .build();
        return quizRepository.save(quiz).getId();
    }

    public List<QuizDto> getUserQuizzes(String userId) {
        return quizRepository.findAllByUserId(userId).stream().map(this::quizToQuizDto).collect(Collectors.toList());
    }

    public Optional<QuizDto> findQuiz(String userId, String quizId) {
        return quizRepository.findByIdAndUserId(quizId, userId).map(this::quizToQuizDto);
    }

    private QuizDto quizToQuizDto(Quiz quiz) {
        return QuizDto.builder()
                .id(quiz.getId())
                .userId(quiz.getUserId())
                .questions(questionRepository.findAllById(quiz.getQuestionIds()))
                .build();
    }
}
