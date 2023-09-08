package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TrockeurUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TrockeurUser entity.
 */
@Repository
public interface TrockeurUserRepository extends JpaRepository<TrockeurUser, Long> {
    default Optional<TrockeurUser> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TrockeurUser> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TrockeurUser> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select trockeurUser from TrockeurUser trockeurUser left join fetch trockeurUser.user",
        countQuery = "select count(trockeurUser) from TrockeurUser trockeurUser"
    )
    Page<TrockeurUser> findAllWithToOneRelationships(Pageable pageable);

    @Query("select trockeurUser from TrockeurUser trockeurUser left join fetch trockeurUser.user")
    List<TrockeurUser> findAllWithToOneRelationships();

    @Query("select trockeurUser from TrockeurUser trockeurUser left join fetch trockeurUser.user where trockeurUser.id =:id")
    Optional<TrockeurUser> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select trockeurUser.id from TrockeurUser trockeurUser where trockeurUser.user.login =:login")
    Optional<Long> findTrockeurUserIdByLogin(@Param("login") Optional<String> login);
}
