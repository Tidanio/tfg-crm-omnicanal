package com.repository;

import com.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
  Optional<Contact> findByEmail(String email);
  Optional<Contact> findByWhatsappId(String whatsappId);
  Optional<Contact> findByInstagramId(String instagramId);
}
