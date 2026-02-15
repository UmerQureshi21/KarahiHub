package com.umerqureshicodes.backend.repositories;

import com.umerqureshicodes.backend.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Generic params: <AppUser, String> because the @Id (email) is a String.
// findByEmail is a derived query — Spring generates the SQL from the method name.
@Repository
public interface AppUserRepository extends JpaRepository<AppUser, String> {
    Optional<AppUser> findByEmail(String email);
}
