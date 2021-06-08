package c.team.session.administration;

import c.team.session.administration.model.Reaction;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@AllArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepository;

    public void saveReaction(String sessionId, String reactionString) {
        Reaction reaction = Reaction.builder()
                .timestamp(OffsetDateTime.now())
                .sessionId(sessionId)
                .value(reactionString)
                .build();
        reactionRepository.save(reaction);
    }

}
