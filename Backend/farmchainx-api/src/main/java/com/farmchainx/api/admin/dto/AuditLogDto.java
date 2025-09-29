// com/farmchainx/api/admin/dto/AuditLogDto.java
package com.farmchainx.api.admin.dto;

import java.time.Instant;

public record AuditLogDto(Long id, Long userId, String action, String entityType, String entityId, Instant at) {}
