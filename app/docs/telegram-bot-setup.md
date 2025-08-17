# Настройка Telegram бота для авторизации

## 1. Создание бота

1. Откройте Telegram и найдите @BotFather
2. Отправьте команду `/newbot`
3. Следуйте инструкциям:
   - Введите имя бота (например, "Найди закупку Auth Bot")
   - Введите username бота (например, "naidizakupku_auth_bot")
4. Сохраните полученный токен бота

## 2. Настройка команд бота

Отправьте @BotFather команду `/setcommands` и выберите вашего бота, затем отправьте:

```
code - Получить код для авторизации
start - Начать работу с ботом
help - Показать справку
```

## 3. Настройка бота в коде

### Конфигурация application.yml

```yaml
telegram:
  bot:
    username: naidizakupku_auth_bot  # Ваш username бота
    token: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz  # Ваш токен бота
```

### Обработчик команд

```kotlin
@Component
class TelegramBotHandler(
    private val codeRepository: CodeRepository,
    private val userRepository: UserRepository
) {
    
    @TelegramMessageHandler("/start")
    fun handleStartCommand(update: Update): SendMessage {
        val chatId = update.message?.chat?.id ?: return SendMessage()
        
        return SendMessage(
            chatId = chatId,
            text = """
                👋 Добро пожаловать в бот авторизации!
                
                Для входа в приложение "Найди закупку":
                1. Отправьте команду /code
                2. Получите временный код
                3. Введите код в приложении
                
                Код действует 5 минут.
            """.trimIndent()
        )
    }
    
    @TelegramMessageHandler("/code")
    fun handleCodeCommand(update: Update): SendMessage {
        val chatId = update.message?.chat?.id ?: return SendMessage()
        val user = update.message?.from ?: return SendMessage()
        
        // Проверяем, существует ли пользователь
        var dbUser = userRepository.findByTelegramId(user.id)
        
        // Если пользователя нет, создаем его
        if (dbUser == null) {
            dbUser = User(
                telegramId = user.id,
                username = user.userName,
                firstName = user.firstName,
                lastName = user.lastName,
                photoUrl = null // Можно получить через getProfilePhotos
            )
            userRepository.save(dbUser)
        }
        
        // Генерируем случайный код от 1 до 1000000
        val code = (1..1000000).random()
        
        // Удаляем старые коды для этого пользователя
        codeRepository.deleteByTelegramIdAndValid(user.id, true)
        
        // Сохраняем новый код
        val authCode = AuthCode(
            code = code,
            telegramId = user.id
        )
        codeRepository.save(authCode)
        
        return SendMessage(
            chatId = chatId,
            text = """
                🔐 Ваш код для авторизации: **$code**
                
                ⏰ Код действует 5 минут
                📱 Введите код в приложении "Найди закупку"
                
                Если код не работает, отправьте /code еще раз
            """.trimIndent(),
            parseMode = "Markdown"
        )
    }
    
    @TelegramMessageHandler("/help")
    fun handleHelpCommand(update: Update): SendMessage {
        val chatId = update.message?.chat?.id ?: return SendMessage()
        
        return SendMessage(
            chatId = chatId,
            text = """
                📖 Справка по командам:
                
                /start - Начать работу с ботом
                /code - Получить код для авторизации
                /help - Показать эту справку
                
                🔐 Для авторизации:
                1. Отправьте /code
                2. Получите код
                3. Введите код в приложении
                
                ⚠️ Код действует только 5 минут!
            """.trimIndent()
        )
    }
}
```

## 4. Настройка базы данных

### SQL скрипт для создания таблиц

```sql
-- Таблица пользователей
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица кодов авторизации
CREATE TABLE auth_codes (
    id BIGSERIAL PRIMARY KEY,
    code INTEGER NOT NULL,
    telegram_id BIGINT NOT NULL,
    valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);

-- Индексы для оптимизации
CREATE INDEX idx_auth_codes_code_valid ON auth_codes(code, valid);
CREATE INDEX idx_auth_codes_telegram_id ON auth_codes(telegram_id);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
```

## 5. Настройка JWT

### JwtService

```kotlin
@Service
class JwtService {
    
    @Value("\${jwt.secret}")
    private lateinit var secret: String
    
    @Value("\${jwt.expiration}")
    private var expiration: Long = 86400000 // 24 hours
    
    fun generateToken(user: User): String {
        val claims = mapOf(
            "telegramId" to user.telegramId.toString(),
            "username" to (user.username ?: ""),
            "firstName" to user.firstName,
            "lastName" to (user.lastName ?: "")
        )
        
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(user.telegramId.toString())
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact()
    }
    
    fun validateToken(token: String): Boolean {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
            true
        } catch (e: Exception) {
            false
        }
    }
    
    fun extractTelegramId(token: String): Long? {
        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .body
            
            claims["telegramId"]?.toString()?.toLong()
        } catch (e: Exception) {
            null
        }
    }
    
    private fun getSigningKey(): Key {
        val keyBytes = secret.toByteArray(StandardCharsets.UTF_8)
        return Keys.hmacShaKeyFor(keyBytes)
    }
}
```

## 6. Настройка безопасности

### SecurityConfig

```kotlin
@Configuration
@EnableWebSecurity
class SecurityConfig {
    
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/auth/telegram-bot/**").permitAll()
                    .requestMatchers("/api/auth/telegram/**").permitAll()
                    .anyRequest().authenticated()
            }
            .sessionManagement { session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter::class.java)
        
        return http.build()
    }
    
    @Bean
    fun jwtAuthenticationFilter(): JwtAuthenticationFilter {
        return JwtAuthenticationFilter()
    }
}
```

## 7. Тестирование

### Тестовые сценарии

1. **Создание бота и получение токена**
2. **Настройка команд бота**
3. **Тестирование команды /start**
4. **Тестирование команды /code**
5. **Тестирование авторизации по коду**
6. **Тестирование истечения срока действия кода**

### Команды для тестирования

```bash
# Проверка работы бота
curl -X GET "http://localhost:8080/api/auth/telegram-bot/info"

# Генерация QR кода
curl -X POST "http://localhost:8080/api/auth/telegram-bot/qr-code" \
  -H "Content-Type: application/json" \
  -d '{"botUrl": "https://t.me/your_bot_username"}'

# Авторизация по коду
curl -X POST "http://localhost:8080/api/auth/telegram-bot/login" \
  -H "Content-Type: application/json" \
  -d '{"code": 123456}'
```

## 8. Мониторинг и логирование

### Логирование действий бота

```kotlin
@Slf4j
@Component
class TelegramBotHandler {
    
    @TelegramMessageHandler("/code")
    fun handleCodeCommand(update: Update): SendMessage {
        val user = update.message?.from
        log.info("User ${user?.id} (${user?.userName}) requested auth code")
        
        // ... логика генерации кода
        
        log.info("Generated code $code for user ${user?.id}")
        return SendMessage(...)
    }
}
```

## 9. Обработка ошибок

### Обработка исключений

```kotlin
@ControllerAdvice
class GlobalExceptionHandler {
    
    @ExceptionHandler(InvalidCodeException::class)
    fun handleInvalidCode(ex: InvalidCodeException): ResponseEntity<LoginResponse> {
        return ResponseEntity.badRequest().body(LoginResponse(
            success = false,
            error = ex.message
        ))
    }
    
    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception): ResponseEntity<LoginResponse> {
        log.error("Unexpected error during authentication", ex)
        return ResponseEntity.status(500).body(LoginResponse(
            success = false,
            error = "Внутренняя ошибка сервера"
        ))
    }
}
```

## 10. Развертывание

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=naidizakupku
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Переменные окружения

```bash
# .env файл
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
DATABASE_URL=jdbc:postgresql://postgres:5432/naidizakupku
```
