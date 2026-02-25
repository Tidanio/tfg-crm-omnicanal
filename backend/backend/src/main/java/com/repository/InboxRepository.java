package com.repository;

import com.entity.ChannelType;
import com.entity.Inbox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InboxRepository extends JpaRepository<Inbox, Long> {
  Optional<Inbox> findByChannelType(ChannelType type);
}
