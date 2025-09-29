// src/main/java/com/farmchainx/api/trace/repo/TraceEventRepository.java
package com.farmchainx.api.trace.repo;

import com.farmchainx.api.trace.entities.TraceEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TraceEventRepository extends JpaRepository<TraceEvent, Long> {
  List<TraceEvent> findByBatchCodeOrderByCreatedAtAsc(String batchCode);
  Optional<TraceEvent> findTopByBatchCodeOrderByCreatedAtDesc(String batchCode);
}
