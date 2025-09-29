package com.farmchainx.api.farmer.controllers;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.auth.entities.RoleName;
import com.farmchainx.api.auth.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Simple DTO to avoid exposing the entire User entity
record DistributorSummary(Long id, String name, String email, String mobile) {}

@RestController
@RequestMapping("/api/public")
public class PublicDirectoryController {

  private final UserRepository users;

  public PublicDirectoryController(UserRepository users) {
    this.users = users;
  }

  @GetMapping("/distributors")
  public ResponseEntity<List<DistributorSummary>> distributors() {
    // Requires the repository method shown below
    List<User> list = users.findAllByRoles_Name(RoleName.DISTRIBUTOR);
    List<DistributorSummary> dto = list.stream()
        .map(u -> new DistributorSummary(u.getId(), u.getFullName(), u.getEmail(), u.getMobile()))
        .toList();
    return ResponseEntity.ok(dto);
  }
}
