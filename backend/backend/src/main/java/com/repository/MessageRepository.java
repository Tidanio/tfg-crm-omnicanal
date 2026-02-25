package com.repository;

import com.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
  Optional<Message> findByEmailMessageId(String emailMessageId);
  List<Message> findByEmailThreadId(String emailThreadId);
  List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId, Pageable pageable);
}
