package com.mycompany.myapp.service;
import com.mycompany.myapp.domain.TrockeurUser;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.TrockeurUserRepository;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service class for managing Trockeurs users.
 */
@Service
@Transactional
public class TrockeurUserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final TrockeurUserRepository trockeurUserRepository;

    public TrockeurUserService(TrockeurUserRepository trockeurUserRepository) {
        this.trockeurUserRepository = trockeurUserRepository;
    }

    public TrockeurUser registerTrockeurUser(String address, String postalCode, User user) {
        TrockeurUser trockeurUser = new TrockeurUser();
        trockeurUser.setAddress(address);
        // size >= 5 for zipcode
        trockeurUser.setZipCode(postalCode);
        trockeurUser.setUser(user);
        trockeurUserRepository.save(trockeurUser);
        return trockeurUser;
    }

    public TrockeurUser updateTrockeurUser(String address, String postalCode, String description, String profilePicturePath, User user) {
        Optional<Long> optUserId = trockeurUserRepository.findTrockeurUserIdByLogin(Optional.of(user.getLogin()));
        if (optUserId.isPresent()) {
            Long userId = optUserId.get();
            Optional<TrockeurUser> optTrockeurUser = trockeurUserRepository.findById(userId);
            if (optTrockeurUser.isPresent()) {
                TrockeurUser trockeurUser = optTrockeurUser.get();

                if (address != null) {
                trockeurUser.setAddress(address);
                }
                if (postalCode != null) {
                    trockeurUser.setZipCode(postalCode);
                }
                if (description != null) {
                    trockeurUser.setDescription(description);
                }
                if (profilePicturePath != null) {
                    trockeurUser.setProfilePicturePath(profilePicturePath);
                }
                trockeurUser.setUser(user);
                trockeurUserRepository.save(trockeurUser);

                log.debug("Changed Information for Trockeur User: {}", trockeurUser);

                return trockeurUser;
            }
        }
        log.debug("Can't change information for Trockeur User");
        return null;
    }

}
