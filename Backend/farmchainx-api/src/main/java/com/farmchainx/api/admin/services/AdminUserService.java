// com/farmchainx/api/admin/services/AdminUserService.java
package com.farmchainx.api.admin.services;

import com.farmchainx.api.admin.dto.*;
import com.farmchainx.api.auth.entities.*;
import com.farmchainx.api.auth.repo.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminUserService {
  private final UserRepository users;
  private final RoleRepository roles;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public AdminUserService(UserRepository users, RoleRepository roles) {
    this.users = users; this.roles = roles;
  }

  public PageResponse<UserDto> list(String q, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
    Page<User> p = users.findAll(pageable); // simple listing; extend with search spec if needed
    var content = p.getContent().stream().map(this::toDto).toList();
    return new PageResponse<>(content, p.getTotalElements(), p.getTotalPages(), page, size);
  }

  public UserDto create(UserUpsertRequest req) {
    if (users.existsByEmail(req.email())) throw new IllegalArgumentException("Email already in use");
    User u = User.builder()
        .fullName(req.fullName())
        .email(req.email())
        .password(encoder.encode(req.password() == null ? "ChangeMe@123" : req.password()))
        .mobile(req.mobile())
        .roles(resolveRoles(req.roles()))
        .build();
    return toDto(users.save(u));
  }

  public UserDto update(Long id, UserUpsertRequest req) {
    User u = users.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    u.setFullName(req.fullName());
    if (req.password() != null && !req.password().isBlank()) u.setPassword(encoder.encode(req.password()));
    u.setMobile(req.mobile());
    u.setRoles(resolveRoles(req.roles()));
    return toDto(users.save(u));
  }

  public void delete(Long id) {
    if (!users.existsById(id)) throw new EntityNotFoundException("User not found");
    users.deleteById(id);
  }

  public UserDto setRoles(Long id, Set<String> roleNames) {
    User u = users.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    u.setRoles(resolveRoles(roleNames));
    return toDto(users.save(u));
  }

  private Set<Role> resolveRoles(Set<String> names) {
    return names.stream()
        .map(n -> roles.findByName(RoleName.valueOf(n.toUpperCase()))
            .orElseThrow(() -> new IllegalArgumentException("Role not found: " + n)))
        .collect(Collectors.toSet());
  }

  private UserDto toDto(User u) {
    Set<String> roleNames = u.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet());
    return new UserDto(u.getId(), u.getFullName(), u.getEmail(), u.getMobile(), roleNames, "active", true);
  }
}
