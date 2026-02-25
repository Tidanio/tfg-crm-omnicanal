package com.repository;

import com.entity.Conversation;
import com.entity.ConversationStatus;
import com.entity.ChannelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
  Optional<Conversation> findByContactIdAndStatusAndChannel(Long contactId, ConversationStatus status, ChannelType channel);
}
