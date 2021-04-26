package c.team.session.statistics;

import c.team.quiz.QuestionRepository;
import c.team.quiz.exception.QuestionNotFoundException;
import c.team.quiz.model.Question;
import c.team.session.statistics.model.SessionAnswers;
import c.team.session.statistics.model.SessionAnswersDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
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
}
