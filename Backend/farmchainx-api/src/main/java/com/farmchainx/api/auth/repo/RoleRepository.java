package com.farmchainx.api.auth.repo;

import com.farmchainx.api.auth.entities.Role;
import com.farmchainx.api.auth.entities.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(RoleName name);
}
