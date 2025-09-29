// com/farmchainx/api/admin/repo/AuditLogRepository.java
package com.farmchainx.api.admin.repo;
import com.farmchainx.api.admin.entities.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}
