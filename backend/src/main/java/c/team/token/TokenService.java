package c.team.token;

import c.team.account.model.UserAccount;
import c.team.token.exception.InvalidTokenException;
import c.team.token.model.Token;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class TokenService {

    private final TokenRepository tokenRepository;

    public String getLoginForToken(UUID tokenValue) {
        Token token = tokenRepository.findTokenByValue(tokenValue)
                .filter(t -> Instant.now().isBefore(t.getExpirationDate()))
                .orElseThrow(InvalidTokenException::new);
        token.setExpirationDate(Instant.now().plus(1, ChronoUnit.HOURS));
        tokenRepository.save(token);
        return token.getUsername();
    }

    public UUID generateTokenForAccount(UserAccount userAccount) {
        Token token = tokenRepository.findTokenByUsername(userAccount.getUsername())
                .orElse(new Token(userAccount.getUsername()));
        token.setValue(UUID.randomUUID());
        token.setExpirationDate(Instant.now().plus(1, ChronoUnit.HOURS));
        return tokenRepository.save(token).getValue();
    }
}
