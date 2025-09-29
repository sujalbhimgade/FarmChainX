package com.farmchainx.api.trace.services;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.trace.entities.SupplyStage;
import com.farmchainx.api.trace.entities.TraceEvent;
import com.farmchainx.api.trace.repo.TraceEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class TraceService {
  private final TraceEventRepository repo;
  public TraceService(TraceEventRepository repo) {
    this.repo = repo;
  }
  @Transactional
  public TraceEvent add(String batchCode, SupplyStage stage, String location, String description, User actor) {
    TraceEvent e = TraceEvent.builder()
        .batchCode(batchCode)
        .stage(stage)
        .location(location)
        .description(description)
        .actor(actor)
        .createdAt(Instant.now())
        .build();
    return repo.save(e);
  }
  @Transactional(readOnly = true)
  public List<TraceEvent> journey(String batchCode) {
    return repo.findByBatchCodeOrderByCreatedAtAsc(batchCode);
  }
}
