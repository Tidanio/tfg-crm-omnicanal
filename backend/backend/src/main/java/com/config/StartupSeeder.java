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

import com.repository.UserRepository;
import com.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class StartupSeeder {
  @Bean
  CommandLineRunner seedData(InboxRepository inboxRepository, ContactRepository contactRepository, ConversationRepository conversationRepository, MessageRepository messageRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
    return args -> {
      // 0. Crear usuario Admin por defecto
      if (userRepository.findByUsername("admin").isEmpty()) {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRole("ADMIN");
        userRepository.save(admin);
      }
      // 1. Crear Inboxes
      Inbox waInbox = seedInbox(inboxRepository, ChannelType.WHATSAPP, "Dev WhatsApp Inbox");
      Inbox igInbox = seedInbox(inboxRepository, ChannelType.INSTAGRAM, "Dev Instagram Inbox");
      Inbox emInbox = seedInbox(inboxRepository, ChannelType.EMAIL, "Dev Email Inbox");

      // Si ya hay conversaciones, no creamos más datos de prueba para evitar duplicados masivos
      if (conversationRepository.count() > 0) return;

      // 2. Crear Contactos y Conversaciones (Ampliación a 10 contactos)

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

      // Chat 3: WhatsApp - Solicitud de factura
      createConversation(contactRepository, conversationRepository, messageRepository, waInbox,
          "Empresas SL", "555-0003", "facturacion@empresassl.com", null,
          new String[]{
              "INCOMING: Hola, necesitamos la factura del último mes.",
              "OUTGOING: Por supuesto, ¿me confirmas el CIF?",
              "INCOMING: B12345678"
          });

      // Chat 4: WhatsApp - Problema técnico
      createConversation(contactRepository, conversationRepository, messageRepository, waInbox,
          "David M.", "555-0004", null, null,
          new String[]{
              "INCOMING: La aplicación no me carga en el móvil.",
              "OUTGOING: ¿Has probado a reiniciar?",
              "INCOMING: Sí, sigue igual."
          });

      // Chat 5: Instagram - Influencer
      createConversation(contactRepository, conversationRepository, messageRepository, igInbox,
          "TechInfluencer_99", null, null, "tech_influencer",
          new String[]{
              "INCOMING: ¡Hey! Me encanta vuestro producto. ¿Hacéis colaboraciones?",
              "OUTGOING: Hola! Gracias por contactarnos. Pásanos tu media kit y lo revisamos con marketing."
          });

      // Chat 6: Instagram - Duda sobre envío
      createConversation(contactRepository, conversationRepository, messageRepository, igInbox,
          "Laura_Style", null, null, "laura.style.official",
          new String[]{
              "INCOMING: Hola, hacéis envíos a Canarias?",
              "OUTGOING: Hola Laura, sí realizamos envíos a Canarias. El coste es de 15€."
          });

      // Chat 7: Instagram - Stock agotado
      createConversation(contactRepository, conversationRepository, messageRepository, igInbox,
          "Carlos Gym", null, null, "carlos_fitness",
          new String[]{
              "INCOMING: ¿Cuándo reponéis las proteínas?",
              "OUTGOING: Hola Carlos, esperamos recibir stock el martes que viene."
          });

      // Chat 8: Email - Soporte técnico
      createConversation(contactRepository, conversationRepository, messageRepository, emInbox,
          "Carlos Ruiz", null, "carlos.ruiz@example.com", null,
          new String[]{
              "INCOMING: Asunto: Error en la factura de marzo\n\nHola, he recibido un cargo incorrecto en mi última factura. Adjunto el PDF.",
              "OUTGOING: Estimado Carlos,\n\nGracias por contactar con soporte. Vamos a revisar tu caso inmediatamente."
          });

      // Chat 9: Email - Propuesta comercial
      createConversation(contactRepository, conversationRepository, messageRepository, emInbox,
          "Marketing Digital", null, "hola@marketing.com", null,
          new String[]{
              "INCOMING: Asunto: Propuesta de SEO\n\nBuenos días, os enviamos una propuesta para mejorar vuestro posicionamiento."
          });

      // Chat 10: Email - Devolución
      createConversation(contactRepository, conversationRepository, messageRepository, emInbox,
          "Maria V.", null, "maria.v@gmail.com", null,
          new String[]{
              "INCOMING: Asunto: Devolución pedido #999\n\nQuiero devolver los zapatos, no me valen.",
              "OUTGOING: Hola Maria, sin problema. Te adjunto la etiqueta de devolución."
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
    conv.setInbox(inbox); // Asignamos el Inbox
    conv.setChannel(inbox.getChannelType());
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
