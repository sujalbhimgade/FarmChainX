// com/farmchainx/api/admin/dto/UserDto.java
package com.farmchainx.api.admin.dto;
import java.util.Set;

public record UserDto(Long id, String fullName, String email, String mobile, Set<String> roles, String status, Boolean verified) {}
