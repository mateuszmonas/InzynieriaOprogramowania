package c.team.quiz;

import c.team.quiz.model.*;
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
        Quiz quiz = quizRepository.save(new Quiz(userId));
        List<Question> questions = createQuizRequest.getQuestions()
                .stream()
                .map(q -> q.toQuestion(quiz.getId()))
                .collect(Collectors.toList());
        questionRepository.saveAll(questions);
        return quiz.getId();
    }

    public List<QuizDto> getUserQuizzes(String userId) {
        return quizRepository.findAllByUserId(userId).stream().map(this::quizToQuizDto).collect(Collectors.toList());
    }

    public Optional<QuizDto> findQuiz(String userId, String quizId) {
        return quizRepository.findByIdAndUserId(quizId, userId).map(this::quizToQuizDto);
    }

    public QuizDto quizToQuizDto(Quiz quiz) {
        List<QuestionDto> questionDtos = questionRepository.findAllByQuizId(quiz.getId())
                .stream()
                .map(Question::toQuestionDto)
                .collect(Collectors.toList());
        return QuizDto.builder()
                .id(quiz.getId())
                .questions(questionDtos)
                .build();
    }
}
