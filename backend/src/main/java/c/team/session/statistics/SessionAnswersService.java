package c.team.session.statistics;

import c.team.quiz.QuestionRepository;
import c.team.quiz.QuizRepository;
import c.team.quiz.exception.QuestionNotFoundException;
import c.team.quiz.exception.QuizNotFoundException;
import c.team.quiz.model.Answer;
import c.team.quiz.model.Question;
import c.team.quiz.model.Quiz;
import c.team.session.statistics.model.SessionAnswers;
import c.team.session.statistics.model.SessionAnswersDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@AllArgsConstructor
// A tu nie powinno być autowire?
public class SessionAnswersService {

    private final QuestionRepository questionRepository;
    private final SessionAnswersRepository sessionAnswersRepository;

    public synchronized void addAnswers(String sessionId, String questionId, List<Integer> answers) {
        SessionAnswers sessionAnswers = sessionAnswersRepository.findBySessionIdAndQuestionId(sessionId, questionId)
                .orElseGet(() -> new SessionAnswers(sessionId, questionId));
        answers.forEach(a -> sessionAnswers.getAnswerCounts().merge(a, 1, Integer::sum));
        sessionAnswersRepository.save(sessionAnswers);
    }

    public List<SessionAnswersDto> findAnswers(String sessionId) {
        return sessionAnswersRepository.findAllBySessionId(sessionId).stream().map(this::sessionAnswersToDto).collect(Collectors.toList());
    }

    private SessionAnswersDto sessionAnswersToDto(SessionAnswers sessionAnswers) {
        Question question = questionRepository.findById(sessionAnswers.getQuestionId()).orElseThrow(QuestionNotFoundException::new);
        return new SessionAnswersDto(question, sessionAnswers.getAnswerCounts());
    }

    // Return indexes of answers if they exists, if not then add new answer and return index
    public List<Integer> getAnswerCountsOrAddForQuestion(String questionId, List<Answer> answers){
        Question question = questionRepository.findById(questionId).orElseThrow(QuestionNotFoundException::new);
        assert question.getAnswers() != null; // Dunno what happens on backend if it is false
        List<Integer> answerIdx = new ArrayList<>();
        IntStream.range(0, answers.size())
                .forEach(i -> {
                    List<Answer> questionAnswers = question.getAnswers();
                    Answer answer = answers.get(i);

                    if(questionAnswers.contains(answer))
                        answerIdx.add(questionAnswers.indexOf(answer));
                    else {
                        answerIdx.add(questionAnswers.size());
                        questionAnswers.add(answer);    // Add new answer to question (for open questions)
                    }
                    questionRepository.save(question);
                });
        return answerIdx;
    }
}
