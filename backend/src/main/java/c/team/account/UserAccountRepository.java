package c.team.account;

import c.team.account.model.UserAccount;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.UUID;

public interface UserAccountRepository extends MongoRepository<UserAccount, UUID> {
    UserAccount findAccountByUsername(String username);
    UserAccount findAccountById(String id);
}
