package com.config;

import com.entity.ChannelType;
import com.entity.Contact;
import com.entity.Conversation;
import com.entity.ConversationStatus;
import com.entity.Inbox;
import com.entity.Message;
import com.repository.ContactRepository;
import com.repository.ConversationRepository;
import com.repository.InboxRepository;
import com.repository.MessageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class StartupSeeder {
  @Bean
  CommandLineRunner seedData(InboxRepository inboxRepository, ContactRepository contactRepository, ConversationRepository conversationRepository, MessageRepository messageRepository) {
    return args -> {
      // 1. Crear Inboxes
      Inbox waInbox = seedInbox(inboxRepository, ChannelType.WHATSAPP, "Dev WhatsApp Inbox");
      Inbox igInbox = seedInbox(inboxRepository, ChannelType.INSTAGRAM, "Dev Instagram Inbox");
      Inbox emInbox = seedInbox(inboxRepository, ChannelType.EMAIL, "Dev Email Inbox");

      // Si ya hay conversaciones, no creamos más datos de prueba para evitar duplicados masivos
      if (conversationRepository.count() > 0) return;

      // 2. Crear Contactos y Conversaciones (2 WhatsApp, 2 Instagram, 1 Email)

      // Chat 1: WhatsApp - Cliente enfadado
      createConversation(contactRepository, conversationRepository, messageRepository, waInbox,
          "Juan Pérez", "555-0001", null, null,
          new String[]{
              "INCOMING: Hola, mi pedido no ha llegado todavía. Llevo esperando 3 días.",
              "OUTGOING: Hola Juan, lamento escuchar eso. Déjame revisar tu número de seguimiento.",
              "INCOMING: Es el pedido #12345. Necesito una solución ya."
          });

      // Chat 2: WhatsApp - Consulta de precios
      createConversation(contactRepository, conversationRepository, messageRepository, waInbox,
          "Ana García", "555-0002", null, null,
          new String[]{
              "INCOMING: Buenas tardes, ¿me podrían dar precio del servicio premium?",
              "OUTGOING: ¡Hola Ana! Claro, el servicio premium cuesta 29.99€ al mes.",
              "INCOMING: ¿Incluye soporte 24/7?",
              "OUTGOING: Sí, incluye soporte prioritario y acceso a todas las funciones."
          });

      // Chat 3: Instagram - Influencer
      createConversation(contactRepository, conversationRepository, messageRepository, igInbox,
          "TechInfluencer_99", null, null, "tech_influencer",
          new String[]{
              "INCOMING: ¡Hey! Me encanta vuestro producto. ¿Hacéis colaboraciones?",
              "OUTGOING: Hola! Gracias por contactarnos. Pásanos tu media kit y lo revisamos con marketing."
          });

      // Chat 4: Instagram - Duda sobre envío
      createConversation(contactRepository, conversationRepository, messageRepository, igInbox,
          "Laura_Style", null, null, "laura.style.official",
          new String[]{
              "INCOMING: Hola, hacéis envíos a Canarias?",
              "OUTGOING: Hola Laura, sí realizamos envíos a Canarias. El coste es de 15€."
          });

      // Chat 5: Email - Soporte técnico
      createConversation(contactRepository, conversationRepository, messageRepository, emInbox,
          "Carlos Ruiz", null, "carlos.ruiz@example.com", null,
          new String[]{
              "INCOMING: Asunto: Error en la factura de marzo\n\nHola, he recibido un cargo incorrecto en mi última factura. Adjunto el PDF.",
              "OUTGOING: Estimado Carlos,\n\nGracias por contactar con soporte. Vamos a revisar tu caso inmediatamente."
          });
    };
  }

  private Inbox seedInbox(InboxRepository repo, ChannelType type, String name) {
    return repo.findByChannelType(type).stream().findFirst().orElseGet(() -> {
      Inbox inbox = new Inbox();
      inbox.setName(name);
      inbox.setChannelType(type);
      return repo.save(inbox);
    });
  }

  private void createConversation(ContactRepository contactRepo, ConversationRepository convRepo, MessageRepository msgRepo,
                                  Inbox inbox, String contactName, String phone, String email, String igUser, String[] messages) {
    // Crear o buscar contacto
    Contact contact = new Contact();
    contact.setName(contactName);
    contact.setWhatsappId(phone);
    contact.setEmail(email);
    contact.setInstagramId(igUser);
    contact = contactRepo.save(contact);

    // Crear conversación
    Conversation conv = new Conversation();
    conv.setContact(contact);
    conv.setInbox(inbox);
    conv.setStatus(ConversationStatus.OPEN);
    conv = convRepo.save(conv);

    // Crear mensajes
    LocalDateTime time = LocalDateTime.now().minusHours(messages.length);
    for (String msgText : messages) {
      boolean isIncoming = msgText.startsWith("INCOMING:");
      String content = msgText.substring(msgText.indexOf(":") + 1).trim();

      Message msg = new Message();
      msg.setConversation(conv);
      msg.setInbox(inbox);
      msg.setContent(content);
      msg.setDirection(isIncoming ? "INCOMING" : "OUTGOING");
      msg.setSenderType(isIncoming ? "CONTACT" : "USER");
      msg.setCreatedAt(time);
      msgRepo.save(msg);

      time = time.plusMinutes(5); // Mensajes espaciados por 5 mins
    }
  }
}
