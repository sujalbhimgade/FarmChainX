package com.farmchainx.api.auth.repo;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.auth.entities.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("select u from User u join u.roles r where r.name = :role")
    List<User> findAllByRoles_Name(@Param("role") RoleName role);
}
