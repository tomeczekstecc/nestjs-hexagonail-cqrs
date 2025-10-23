# NestJS Hexagonal Architecture with CQRS

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

A comprehensive example of implementing **Hexagonal Architecture** (Ports and Adapters) with **Domain-Driven Design (DDD)** and **Command Query Responsibility Segregation (CQRS)** patterns using NestJS and TypeScript.

## 🏗️ Architecture Overview

This project demonstrates clean architecture principles by implementing:

- **Domain-Driven Design (DDD)** for business logic modeling
- **Hexagonal Architecture** for dependency inversion and testability
- **CQRS** for separating read and write operations
- **Clean separation of concerns** across layers

## 📖 Table of Contents

- [Architecture Patterns](#-architecture-patterns)
  - [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
  - [Hexagonal Architecture](#hexagonal-architecture)
  - [CQRS Pattern](#cqrs-pattern)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Getting Started](#-getting-started)
- [Testing](#-testing)

## 🎯 Architecture Patterns

### Domain-Driven Design (DDD)

DDD is a software development approach that focuses on modeling the business domain and its rules. This project implements key DDD concepts:

#### 🏛️ Domain Layer

- **Entities**: Core business objects with identity and lifecycle
  - `User` - Represents a user in the system with business rules
- **Value Objects**: Immutable objects that describe aspects of the domain
  - `UserId` - Unique identifier for users
  - `Email` - Email validation and behavior
- **Domain Rules**: Business logic encapsulated within entities
  - User name validation (minimum 2 characters)
  - Email format validation
  - Account age calculation

```typescript
// Example: User Entity with business rules
export class User {
  static create(name: string, email: string) {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    return new User(
      new UserId(),
      name.trim(),
      new Email(email),
      new Date(),
      new Date(),
    );
  }

  updateName(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    this.name = name;
    this.updatedAt = new Date();
  }
}
```

### Hexagonal Architecture

Also known as "Ports and Adapters," this architecture promotes:

- **Dependency Inversion**: Core business logic doesn't depend on external concerns
- **Testability**: Easy to test business logic in isolation
- **Flexibility**: Easy to swap implementations (databases, external services)

#### 🔌 Key Components

1. **Domain Layer** (Inner hexagon)
   - Contains business entities and rules
   - No dependencies on external frameworks

2. **Application Layer** (Use cases/Services)
   - Orchestrates domain objects
   - Defines ports (interfaces) for external dependencies
   - Contains CQRS handlers

3. **Infrastructure Layer** (Outer hexagon)
   - Implements ports defined by application layer
   - Contains adapters for databases, external APIs, etc.
   - Framework-specific code (NestJS controllers, repositories)

```typescript
// Port (Interface) - defined in application layer
export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

// Adapter (Implementation) - in infrastructure layer
@Injectable()
export class InMemoryUserRepository implements UserRepositoryPort {
  private users: User[] = [];

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}
```

### CQRS Pattern

Command Query Responsibility Segregation separates read and write operations:

#### ⚡ Commands (Write Operations)

Commands change system state and don't return data:

```typescript
export class CreateUserCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  async execute(command: CreateUserCommand): Promise<User> {
    const user = User.create(command.name, command.email);
    return await this.userRepository.save(user);
  }
}
```

#### 🔍 Queries (Read Operations)

Queries retrieve data without changing system state:

```typescript
export class GetUserQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  async execute(query: GetUserQuery) {
    return this.userRepository.findById(query.userId);
  }
}
```

#### 🎯 Benefits of CQRS

- **Separation of Concerns**: Read and write models can be optimized independently
- **Scalability**: Can scale read and write sides differently
- **Performance**: Optimized queries for specific read scenarios
- **Maintainability**: Clear separation between operations that change state vs. retrieve data

## 📁 Project Structure

```
src/
├── user/                           # User bounded context
│   ├── domain/                     # Domain layer (business logic)
│   │   ├── entities/
│   │   │   └── user.entity.ts      # User aggregate root
│   │   └── value-objects/
│   │       ├── user-id.vo.ts       # User identifier
│   │       ├── email.vo.ts         # Email value object
│   │       └── index.ts
│   ├── application/                # Application layer (use cases)
│   │   ├── commands/               # Write operations
│   │   │   ├── create-user.ts      # Create user command
│   │   │   ├── delete-user.ts      # Delete user command
│   │   │   └── handlers/
│   │   │       ├── create-user.handler.ts
│   │   │       ├── delete-user.handler.ts
│   │   │       └── index.ts
│   │   ├── queries/                # Read operations
│   │   │   ├── get-user.query.ts
│   │   │   ├── get-users-list.query.ts
│   │   │   └── handlers/
│   │   │       ├── get-user.handler.ts
│   │   │       ├── get-users-list.handler.ts
│   │   │       └── index.ts
│   │   ├── ports/                  # Interfaces for external dependencies
│   │   │   └── user.repository.port.ts
│   │   └── use-cases/              # Application services
│   │       └── update-user.use-case.ts
│   ├── infrastructure/             # Infrastructure layer (adapters)
│   │   └── adapters/
│   │       └── in-memory-user.repository.ts
│   ├── presentation/               # Presentation layer (controllers)
│   │   └── user.controller.ts      # REST API endpoints
│   └── user.module.ts              # NestJS module configuration
└── app.module.ts                   # Main application module
```

### Layer Responsibilities

#### 🏛️ Domain Layer

- **Purpose**: Contains business logic and rules
- **Dependencies**: None (pure TypeScript)
- **Components**: Entities, Value Objects, Domain Events

#### 🔧 Application Layer

- **Purpose**: Orchestrates use cases and defines contracts
- **Dependencies**: Domain layer only
- **Components**: Command/Query handlers, Ports (interfaces), Use cases

#### 🔌 Infrastructure Layer

- **Purpose**: Implements technical concerns
- **Dependencies**: Application and Domain layers
- **Components**: Repository implementations, External service adapters

#### 🎮 Presentation Layer

- **Purpose**: Handles user interface concerns
- **Dependencies**: Application layer
- **Components**: Controllers, DTOs, API documentation

## 🛣️ API Routes

### User Management

#### Create User

```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2025-10-22T10:00:00.000Z",
  "updatedAt": "2025-10-22T10:00:00.000Z",
  "accountAge": 0
}
```

#### Get All Users

```http
GET /users
```

**Response:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2025-10-22T10:00:00.000Z",
    "updatedAt": "2025-10-22T10:00:00.000Z",
    "accountAge": 1
  }
]
```

#### Get User by ID

```http
GET /users/{id}
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2025-10-22T10:00:00.000Z",
  "updatedAt": "2025-10-22T10:00:00.000Z",
  "accountAge": 1
}
```

#### Update User

```http
PUT /users/{id}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "createdAt": "2025-10-22T10:00:00.000Z",
  "updatedAt": "2025-10-22T11:30:00.000Z",
  "accountAge": 1
}
```

#### Delete User

```http
DELETE /users/{id}
```

**Response:** `204 No Content`

### Error Responses

#### Validation Error

```json
{
  "statusCode": 400,
  "message": "Name must be at least 2 characters long",
  "error": "Bad Request"
}
```

#### User Not Found

```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

#### User Already Exists

```json
{
  "statusCode": 409,
  "message": "User already exists",
  "error": "Conflict"
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nestjs-hexagonail-cqrs
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm run dev
```

The API will be available at `http://localhost:3000`

### Available Scripts

```bash
# Development
pnpm run dev          # Start in watch mode
pnpm run start        # Start normally
pnpm run start:debug  # Start with debugging

# Production
pnpm run build        # Build the project
pnpm run start:prod   # Start production build

# Code Quality
pnpm run lint         # Lint and fix code
pnpm run format       # Format code with Prettier

# Testing
pnpm run test         # Run unit tests
pnpm run test:watch   # Run tests in watch mode
pnpm run test:cov     # Run tests with coverage
pnpm run test:e2e     # Run end-to-end tests
```

## 🧪 Testing Strategy

The project follows a comprehensive testing approach aligned with the hexagonal architecture:

### Unit Tests

- **Domain Layer**: Test business logic in isolation
- **Application Layer**: Test command/query handlers with mocked dependencies
- **Infrastructure Layer**: Test adapters with real or test doubles

### Integration Tests

- **API Layer**: Test complete request/response cycles
- **Repository Layer**: Test database interactions

### Example Test Structure

```typescript
// Domain entity test
describe('User Entity', () => {
  it('should create user with valid data', () => {
    const user = User.create('John Doe', 'john@example.com');
    expect(user.getName()).toBe('John Doe');
  });

  it('should throw error for invalid name', () => {
    expect(() => User.create('J', 'john@example.com')).toThrow(
      'Name must be at least 2 characters long',
    );
  });
});

// Command handler test
describe('CreateUserHandler', () => {
  it('should create user successfully', async () => {
    const mockRepository = createMockRepository();
    const handler = new CreateUserHandler(mockRepository);

    const command = new CreateUserCommand('John Doe', 'john@example.com');
    const result = await handler.execute(command);

    expect(result.getName()).toBe('John Doe');
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

## 💡 Key Benefits

### 🎯 Business Logic Protection

- **Domain-driven approach** keeps business rules in the domain layer
- **Framework independence** - business logic doesn't depend on NestJS
- **Testability** - easy to test business rules in isolation

### 🔧 Maintainability

- **Clear separation of concerns** across layers
- **SOLID principles** applied throughout
- **Dependency inversion** makes the code flexible and extensible

### 🚀 Scalability

- **CQRS** allows independent scaling of read/write operations
- **Modular structure** supports microservice extraction
- **Clean interfaces** enable easy component replacement

### 🛡️ Robustness

- **Type safety** with TypeScript
- **Domain validation** at entity level
- **Error handling** at appropriate layers

## 🔄 Extending the Application

### Adding New Features

1. **Domain First**: Start by modeling the domain entities and rules
2. **Define Commands/Queries**: Create the required operations
3. **Implement Handlers**: Add the business logic
4. **Create Adapters**: Implement infrastructure concerns
5. **Add Controllers**: Expose through REST API

### Example: Adding Product Management

```typescript
// 1. Domain Entity
export class Product {
  constructor(
    private readonly id: ProductId,
    private name: string,
    private price: Money,
    private readonly createdAt: Date,
  ) {}

  static create(name: string, price: number): Product {
    if (price <= 0) throw new Error('Price must be positive');
    return new Product(new ProductId(), name, new Money(price), new Date());
  }
}

// 2. Command
export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly price: number,
  ) {}
}

// 3. Handler
@CommandHandler(CreateProductCommand)
export class CreateProductHandler {
  async execute(command: CreateProductCommand): Promise<Product> {
    const product = Product.create(command.name, command.price);
    return await this.productRepository.save(product);
  }
}
```

## 📚 Learning Resources

### Architecture Patterns

- [Domain-Driven Design by Eric Evans](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)
- [Implementing Domain-Driven Design by Vaughn Vernon](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577)
- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)

### CQRS and Event Sourcing

- [CQRS Journey by Microsoft](<https://docs.microsoft.com/en-us/previous-versions/msp-n-p/jj554200(v=pandp.10)>)
- [Event Storming by Alberto Brandolini](https://www.eventstorming.com/)

### NestJS

- [Official NestJS Documentation](https://docs.nestjs.com/)
- [NestJS CQRS Module](https://docs.nestjs.com/recipes/cqrs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the established patterns
4. Add tests for new functionality
5. Run the test suite: `pnpm test`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
