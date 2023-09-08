package com.mycompany.myapp.service;
import com.mycompany.myapp.domain.TrockeurUser;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.TrockeurUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service class for managing Trockeurs users.
 */
@Service
@Transactional
public class TrockeurUserService {
    private final TrockeurUserRepository trockeurUserRepository;

    public TrockeurUserService(TrockeurUserRepository trockeurUserRepository) {
        this.trockeurUserRepository = trockeurUserRepository;
    }

    public TrockeurUser registerTrockeurUser(User user) {
        TrockeurUser trockeurUser = new TrockeurUser();
        // TODO : quand formulaire terminé, renseigner les champs
        trockeurUser.setAddress("");
        // size >= 5 for zipcode
        trockeurUser.setZipCode("default");
        trockeurUser.setDescription("");
        trockeurUser.setProfilePicturePath("");
        trockeurUser.setUser(user);
        trockeurUserRepository.save(trockeurUser);
        return trockeurUser;
    }

}
