package c.team.account;

import c.team.account.exception.DuplicateUsernameException;
import c.team.account.model.UserAccount;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        return userAccountRepository.findAccountByUsername(username)
                .filter(account -> passwordEncoder.matches(password, account.getPassword()))
                .orElseThrow(() -> new UsernameNotFoundException("user does not exist: " + username));
    }

    public UserAccount findByUsername(String username) {
        return userAccountRepository.findAccountByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("user does not exist: " + username));
    }

    public UserAccount findByUserId(String id){
        return Optional.ofNullable(userAccountRepository.findAccountById(id))
                .orElseThrow(() -> new UsernameNotFoundException("user with id: " + id + " not exist"));
    }
}
