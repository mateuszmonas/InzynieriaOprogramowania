package c.team.token;

import c.team.token.model.Token;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.UUID;


public interface TokenRepository extends MongoRepository<Token, String> {
    Optional<Token> findTokenByValue(UUID value);

    Optional<Token> findTokenByUsername(String username);
}
