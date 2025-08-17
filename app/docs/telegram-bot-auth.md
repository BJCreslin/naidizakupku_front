# Telegram Bot Authentication API

## Описание

Система авторизации через Telegram бота с использованием временных кодов. Пользователь получает код командой `/code` в боте, затем вводит его в веб-приложении для авторизации.

## Эндпоинты для бэкенда (Kotlin Spring Boot)

### 1. Получение информации о боте

**GET** `/api/backend/auth/telegram-bot/info`

Возвращает информацию о Telegram боте для авторизации.

**Response:**
```json
{
  "success": true,
  "botInfo": {
    "botUsername": "your_bot_username",
    "botUrl": "https://t.me/your_bot_username"
  }
}
```

**Kotlin Controller:**
```kotlin
@RestController
@RequestMapping("/api/backend/auth/telegram-bot")
class TelegramBotAuthController(
    private val telegramBotService: TelegramBotService
) {
    
    @GetMapping("/info")
    fun getBotInfo(): ResponseEntity<BotInfoResponse> {
        val botInfo = telegramBotService.getBotInfo()
        return ResponseEntity.ok(BotInfoResponse(
            success = true,
            botInfo = botInfo
        ))
    }
}
```

### 2. Генерация QR кода

**POST** `/api/backend/auth/telegram-bot/qr-code`

Генерирует QR код для быстрого перехода к боту.

**Request:**
```json
{
  "botUrl": "https://t.me/your_bot_username"
}
```

**Response:**
```json
{
  "success": true,
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Kotlin Controller:**
```kotlin
@PostMapping("/qr-code")
fun generateQrCode(@RequestBody request: QrCodeRequest): ResponseEntity<QrCodeResponse> {
    val qrCodeUrl = telegramBotService.generateQrCode(request.botUrl)
    return ResponseEntity.ok(QrCodeResponse(
        success = true,
        qrCodeUrl = qrCodeUrl
    ))
}
```

### 3. Авторизация по коду

**POST** `/api/backend/auth/telegram-bot/login`

Проверяет код от бота и возвращает JWT токен при успешной авторизации.

**Request:**
```json
{
  "code": 123456
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "sessionId": "session_123",
    "telegramId": 123456789,
    "username": "user123",
    "firstName": "Иван",
    "lastName": "Иванов",
    "photoUrl": "https://t.me/i/userpic/320/user123.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00Z",
    "lastActivityAt": "2024-01-01T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Kotlin Controller:**
```kotlin
@PostMapping("/login")
fun loginWithCode(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
    return try {
        val authResult = telegramBotService.authenticateWithCode(request.code)
        ResponseEntity.ok(LoginResponse(
            success = true,
            session = authResult.session,
            token = authResult.token
        ))
    } catch (e: InvalidCodeException) {
        ResponseEntity.badRequest().body(LoginResponse(
            success = false,
            error = "Неверный код или время истекло"
        ))
    }
}
```

## Модели данных (Kotlin)

### Request Models
```kotlin
data class QrCodeRequest(
    val botUrl: String
)

data class LoginRequest(
    val code: Int
)
```

### Response Models
```kotlin
data class BotInfoResponse(
    val success: Boolean,
    val botInfo: BotInfo? = null,
    val error: String? = null
)

data class BotInfo(
    val botUsername: String,
    val botUrl: String
)

data class QrCodeResponse(
    val success: Boolean,
    val qrCodeUrl: String? = null,
    val error: String? = null
)

data class LoginResponse(
    val success: Boolean,
    val session: AuthSession? = null,
    val token: String? = null,
    val error: String? = null
)

data class AuthSession(
    val sessionId: String,
    val telegramId: Long,
    val username: String?,
    val firstName: String,
    val lastName: String?,
    val photoUrl: String?,
    val isActive: Boolean,
    val createdAt: String,
    val lastActivityAt: String
)
```

## Сервисный слой (Kotlin)

### TelegramBotService
```kotlin
@Service
class TelegramBotService(
    private val telegramBotClient: TelegramBotClient,
    private val jwtService: JwtService,
    private val userRepository: UserRepository,
    private val codeRepository: CodeRepository
) {
    
    fun getBotInfo(): BotInfo {
        return BotInfo(
            botUsername = telegramBotClient.getBotUsername(),
            botUrl = "https://t.me/${telegramBotClient.getBotUsername()}"
        )
    }
    
    fun generateQrCode(botUrl: String): String {
        // Генерация QR кода с помощью библиотеки (например, ZXing)
        val qrCodeWriter = QRCodeWriter()
        val bitMatrix = qrCodeWriter.encode(botUrl, BarcodeFormat.QR_CODE, 256, 256)
        
        // Конвертация в base64
        val bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix)
        val baos = ByteArrayOutputStream()
        ImageIO.write(bufferedImage, "PNG", baos)
        val imageBytes = baos.toByteArray()
        
        return "data:image/png;base64,${Base64.getEncoder().encodeToString(imageBytes)}"
    }
    
    fun authenticateWithCode(code: Int): AuthResult {
        // Проверяем код в базе данных
        val codeEntity = codeRepository.findByCodeAndValid(code, true)
            ?: throw InvalidCodeException("Код не найден или недействителен")
        
        // Проверяем время жизни кода (например, 5 минут)
        if (codeEntity.createdAt.isBefore(LocalDateTime.now().minusMinutes(5))) {
            codeEntity.valid = false
            codeRepository.save(codeEntity)
            throw InvalidCodeException("Время действия кода истекло")
        }
        
        // Получаем пользователя по Telegram ID
        val user = userRepository.findByTelegramId(codeEntity.telegramId)
            ?: throw InvalidCodeException("Пользователь не найден")
        
        // Создаем сессию
        val session = createSession(user)
        
        // Генерируем JWT токен
        val token = jwtService.generateToken(user)
        
        // Помечаем код как использованный
        codeEntity.valid = false
        codeRepository.save(codeEntity)
        
        return AuthResult(session, token)
    }
    
    private fun createSession(user: User): AuthSession {
        val sessionId = UUID.randomUUID().toString()
        val now = LocalDateTime.now().toString()
        
        return AuthSession(
            sessionId = sessionId,
            telegramId = user.telegramId,
            username = user.username,
            firstName = user.firstName,
            lastName = user.lastName,
            photoUrl = user.photoUrl,
            isActive = true,
            createdAt = now,
            lastActivityAt = now
        )
    }
}

data class AuthResult(
    val session: AuthSession,
    val token: String
)

class InvalidCodeException(message: String) : RuntimeException(message)
```

## Entity модели (JPA)

```kotlin
@Entity
@Table(name = "auth_codes")
data class AuthCode(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    val code: Int,
    
    @Column(nullable = false)
    val telegramId: Long,
    
    @Column(nullable = false)
    var valid: Boolean = true,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, unique = true)
    val telegramId: Long,
    
    @Column
    val username: String?,
    
    @Column(nullable = false)
    val firstName: String,
    
    @Column
    val lastName: String?,
    
    @Column
    val photoUrl: String?,
    
    @Column(nullable = false)
    val isActive: Boolean = true,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    var lastActivityAt: LocalDateTime = LocalDateTime.now()
)
```

## Repository интерфейсы

```kotlin
@Repository
interface CodeRepository : JpaRepository<AuthCode, Long> {
    fun findByCodeAndValid(code: Int, valid: Boolean): AuthCode?
    fun deleteByTelegramIdAndValid(telegramId: Long, valid: Boolean)
}

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByTelegramId(telegramId: Long): User?
    fun findByUsername(username: String): User?
}
```

## Telegram Bot Handler

```kotlin
@Component
class TelegramBotHandler(
    private val codeRepository: CodeRepository,
    private val userRepository: UserRepository
) {
    
    @TelegramMessageHandler("/code")
    fun handleCodeCommand(update: Update): SendMessage {
        val chatId = update.message?.chat?.id ?: return SendMessage()
        val user = update.message?.from ?: return SendMessage()
        
        // Генерируем случайный код от 1 до 1000000
        val code = (1..1000000).random()
        
        // Сохраняем код в базу
        val authCode = AuthCode(
            code = code,
            telegramId = user.id
        )
        codeRepository.save(authCode)
        
        // Удаляем старые коды для этого пользователя
        codeRepository.deleteByTelegramIdAndValid(user.id, true)
        
        return SendMessage(
            chatId = chatId,
            text = "Ваш код для авторизации: $code\n\nКод действует 5 минут."
        )
    }
}
```

## Зависимости для build.gradle.kts

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("io.jsonwebtoken:jjwt-api:0.11.5")
    implementation("io.jsonwebtoken:jjwt-impl:0.11.5")
    implementation("io.jsonwebtoken:jjwt-jackson:0.11.5")
    implementation("com.google.zxing:core:3.5.1")
    implementation("com.google.zxing:javase:3.5.1")
    implementation("org.telegram:telegrambots-spring-boot-starter:6.8.0")
    
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
```

## Конфигурация application.yml

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/naidizakupku
    username: postgres
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

telegram:
  bot:
    username: your_bot_username
    token: your_bot_token

jwt:
  secret: your_jwt_secret_key_here_make_it_long_and_secure
  expiration: 86400000 # 24 hours in milliseconds
```

## Логика работы

1. **Получение информации о боте**: Фронтенд запрашивает информацию о боте для отображения ссылки и QR кода.

2. **Генерация QR кода**: Фронтенд может запросить QR код для быстрого перехода к боту.

3. **Получение кода в боте**: Пользователь переходит в бота и отправляет команду `/code`, получая временный код.

4. **Авторизация по коду**: Пользователь вводит код в веб-приложении, который отправляется на бэкенд для проверки.

5. **Проверка кода**: Бэкенд проверяет код в базе данных, его валидность и время жизни.

6. **Создание сессии**: При успешной проверке создается сессия и генерируется JWT токен.

7. **Возврат токена**: Фронтенд получает JWT токен для последующих запросов.
