// com/farmchainx/api/admin/services/AdminAuditService.java
package com.farmchainx.api.admin.services;

import com.farmchainx.api.admin.dto.AuditLogDto;
import com.farmchainx.api.admin.entities.AuditLog;
import com.farmchainx.api.admin.repo.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AdminAuditService {
  private final AuditLogRepository logs;

  public AdminAuditService(AuditLogRepository logs) { this.logs = logs; }

  public List<AuditLogDto> list() {
    return logs.findAll().stream().map(this::toDto).toList();
  }

  public void record(Long userId, String action, String entityType, String entityId, String beforeJson, String afterJson) {
    logs.save(AuditLog.builder()
        .userId(userId).action(action).entityType(entityType).entityId(entityId)
        .beforeJson(beforeJson).afterJson(afterJson).at(Instant.now()).build());
  }

  private AuditLogDto toDto(AuditLog a) {
    return new AuditLogDto(a.getId(), a.getUserId(), a.getAction(), a.getEntityType(), a.getEntityId(), a.getAt());
  }
}
