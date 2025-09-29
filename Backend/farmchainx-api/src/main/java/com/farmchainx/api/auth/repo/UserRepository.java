package com.farmchainx.api.auth.repo;

import com.farmchainx.api.auth.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
  boolean existsByEmail(String email);
  List<User> findAllByRoles_Name(RoleName name);

}
