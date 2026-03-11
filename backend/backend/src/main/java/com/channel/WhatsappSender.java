package com.channel;

import com.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@Component
public class WhatsappSender implements ChannelSender {

  private static final Logger logger = LoggerFactory.getLogger(WhatsappSender.class);
  private static final String API_URL_TEMPLATE = "https://graph.facebook.com/v17.0/%s/messages";

  private final SystemConfigService configService;
  private final RestTemplate restTemplate;

  // Fallback values from environment variables
  @Value("${whatsapp.api.token:}")
  private String envWhatsAppToken;

  @Value("${whatsapp.api.phone-number-id:}")
  private String envWhatsAppPhoneId;

  @Autowired
  public WhatsappSender(SystemConfigService configService) {
    this.configService = configService;
    this.restTemplate = new RestTemplate();
  }

  @Override
  public void send(String payload) {
      // Este método 'send(String payload)' es genérico de la interfaz ChannelSender.
      // Para WhatsApp necesitamos el 'to' (número de teléfono).
      // Como la interfaz es simple, asumimos que el payload contiene el mensaje,
      // pero el número de destino debería pasarse aparte.
      // Por ahora, lanzamos una advertencia o lo dejamos vacío si no se usa directamente.
      logger.warn("WhatsappSender.send(payload) called without destination number. Use sendTo(to, text) instead.");
  }

  public void sendTo(String to, String text) {
    String token = configService.getValue("whatsapp_api_token", envWhatsAppToken);
    String phoneId = configService.getValue("whatsapp_phone_number_id", envWhatsAppPhoneId);

    if (token == null || token.isEmpty() || phoneId == null || phoneId.isEmpty()) {
      logger.error("WhatsApp credentials not configured (Token or Phone ID missing)");
      return;
    }

    String url = String.format(API_URL_TEMPLATE, phoneId);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(token);

    Map<String, Object> body = new HashMap<>();
    body.put("messaging_product", "whatsapp");
    body.put("to", to);
    body.put("type", "text");
    
    Map<String, String> textObj = new HashMap<>();
    textObj.put("body", text);
    body.put("text", textObj);

    HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

    try {
      restTemplate.postForEntity(url, request, String.class);
      logger.info("WhatsApp message sent successfully to {}", to);
    } catch (Exception e) {
      logger.error("Failed to send WhatsApp message to {}: {}", to, e.getMessage());
    }
  }
}

