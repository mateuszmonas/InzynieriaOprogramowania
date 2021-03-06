package c.team.quiz;

import c.team.quiz.exception.QuizNotFoundException;
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
        Quiz quiz = quizRepository.save(new Quiz(createQuizRequest.getName(), userId));
        List<Question> questions = createQuizRequest.getQuestions()
                .stream()
                .map(q -> q.toQuestion(quiz.getId()))
                .collect(Collectors.toList());
        questionRepository.saveAll(questions);
        return quiz.getId();
    }

    public void updateQuiz(String quizId, UpdateQuizRequest request){
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(QuizNotFoundException::new);
        quiz.setName(request.getName());
        List<Question> prevQuestions = questionRepository.findAllByQuizId(quizId);
        questionRepository.deleteAll(prevQuestions);

        List<Question> updatedQuestions = request.getQuestions()
                .stream()
                .map(q -> q.toQuestion(quiz.getId()))
                .collect(Collectors.toList());
        questionRepository.saveAll(updatedQuestions);
        quizRepository.save(quiz);
    }

    public void deleteQuiz(String quizId) {
        List<Question> questions = questionRepository.findAllByQuizId(quizId);
        questionRepository.deleteAll(questions);
        quizRepository.deleteById(quizId);
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
        return new QuizDto(quiz.getId(), quiz.getName(), questionDtos);
    }
}
