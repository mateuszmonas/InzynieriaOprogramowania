package c.team.account;

import c.team.account.exception.DuplicateUsernameException;
import c.team.account.exception.UserNotFoundException;
import c.team.account.model.UserAccount;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public void createAccount(String username, String password) {
        UserAccount userAccount = UserAccount.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .build();
        try {
            userAccountRepository.save(userAccount);
        } catch (DuplicateKeyException e) {
            throw new DuplicateUsernameException();
        }
    }

    public UserAccount findByUsernameAndPassword(String username, String password) {
        return Optional.ofNullable(userAccountRepository.findAccountByUsername(username)).filter(a -> passwordEncoder.matches(password, a.getPassword())).orElseThrow(UserNotFoundException::new);
    }

    public UserAccount findByUsername(String username) {
        return Optional.ofNullable(userAccountRepository.findAccountByUsername(username)).orElseThrow(() -> new UsernameNotFoundException(""));
    }

}
